// Script de sincronización automática con GameWave Digital
// Se ejecuta periódicamente o al iniciar la app para detectar nuevos ports añadidos

const fs = require('fs');
const path = require('path');

const CATALOG_URL = 'https://gamewave.digital/ports/catalog.json';
const LOCAL_CATALOG = path.join(__dirname, 'gamewave_catalog.json');
const DATA_FILE = path.join(__dirname, 'js', 'gamewave-data.js');

function mapSystem(sourcePlatform, tags) {
    const p = (sourcePlatform || '').toLowerCase();
    const t = (tags || []).join(' ').toLowerCase();

    if (['playstation', 'psx', 'ps1', 'ps2', 'ps3', 'ps4', 'psp', 'ps vita'].some(k => p.includes(k))) return ['psx', 'PlayStation & PS2'];
    if (['game boy advance', 'gba', 'game boy'].some(k => p.includes(k))) return ['gba', 'Game Boy Advance'];
    if (['super nintendo', 'snes'].some(k => p.includes(k))) return ['snes', 'Super Nintendo'];
    if (['nintendo 64', 'n64'].some(k => p.includes(k))) return ['n64', 'Nintendo 64'];
    if (['nintendo ds', 'nds', '3ds'].some(k => p.includes(k))) return ['nds', 'Nintendo DS'];
    if (['nes', 'famicom'].some(k => p.includes(k))) return ['nes', 'Nintendo NES'];
    if (['sega', 'genesis', 'mega drive', 'dreamcast'].some(k => p.includes(k))) return ['sega', 'Sega Genesis'];
    return ['gamewave', 'GameWave / PC'];
}

async function syncCatalog() {
    console.log(`[Sync] Conectando a ${CATALOG_URL}...`);
    try {
        const response = await fetch(CATALOG_URL);
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        
        const catalogData = await response.json();
        const apps = catalogData.apps || [];
        console.log(`[Sync] Catálogo remoto descargado con éxito. Total ports remotos: ${apps.length}`);

        // Leer catálogo local previo para detectar diferencias
        let previousCount = 0;
        if (fs.existsSync(LOCAL_CATALOG)) {
            try {
                const prev = JSON.parse(fs.readFileSync(LOCAL_CATALOG, 'utf8'));
                previousCount = (prev.apps || []).length;
            } catch (e) {}
        }

        const newPortsDiff = apps.length - previousCount;
        if (newPortsDiff > 0) {
            console.log(`[Sync] 🚀 ¡Se detectaron ${newPortsDiff} NUEVOS PORTS añadidos a GameWave!`);
        } else {
            console.log(`[Sync] El catálogo está al día (${apps.length} ports registrados).`);
        }

        // Guardar catálogo crudo actualizado
        fs.writeFileSync(LOCAL_CATALOG, JSON.stringify(catalogData, null, 2), 'utf8');

        // Transformar y regenerar gamewave-data.js
        const converted = apps.map((a, idx) => {
            const appId = `gw-${a.id || idx}`;
            const name = (a.name || 'Juego Desconocido').replace(/\u00ef\u00bf\u00bd/g, ' - ');
            const sourcePlat = a.sourcePlatform || 'PC / Otros';
            const [sysKey, sysDisplay] = mapSystem(sourcePlat, a.tags || []);
            const projectUrl = a.projectUrl || a.verificationUrl || 'https://gamewave.digital/ports/';
            const coverUrl = a.coverUrl || 'assets/covers/gamewave-default.svg';
            const desc = a.description || a.descriptionEn || `Port comunitario de ${name} (${sourcePlat}) indexado en GameWave Digital.`;
            const tags = a.tags || [];
            const genre = a.category || (tags[0] || 'Port / Arcade');
            const isFeatured = Boolean(a.featured);

            return {
                id: appId,
                title: name,
                system: sysKey,
                systemName: sysDisplay,
                core: 'link',
                genre: genre,
                year: 2026,
                players: '1 Jugador',
                rating: isFeatured ? 4.9 : 4.7,
                featured: isFeatured,
                cover: coverUrl,
                description: desc,
                redirectUrl: projectUrl,
                isGameWave: true,
                sourcePlatform: sourcePlat
            };
        });

        const jsContent = `// Colección masiva de ports y juegos de GameWave Digital (Auto-sincronizada)\n` +
                          `// Última sincronización: ${new Date().toISOString()}\n` +
                          `const GAMEWAVE_GAMES = ${JSON.stringify(converted, null, 2)};\n\n` +
                          `if (typeof module !== 'undefined' && module.exports) { module.exports = { GAMEWAVE_GAMES }; }`;

        fs.writeFileSync(DATA_FILE, jsContent, 'utf8');
        console.log(`[Sync] Base de datos local actualizada en ${DATA_FILE}. Total: ${converted.length} juegos.`);
        return { success: true, count: converted.length, newPorts: newPortsDiff };
    } catch (err) {
        console.error(`[Sync Error] Error al sincronizar:`, err.message);
        return { success: false, error: err.message };
    }
}

if (require.main === module) {
    syncCatalog();
}

module.exports = { syncCatalog };
