// Catálogo exclusivo de Juegos 100% Nativos para Navegador (Sin emuladores de ROMs, sin descargas)

const DEFAULT_GAMES = [
    {
        id: "web-simpsons-hit-and-run",
        title: "The Simpsons: Hit & Run (Web Port)",
        system: "web",
        systemName: "Web Port 3D",
        core: "link",
        genre: "Mundo Abierto / Conducción",
        year: 2003,
        players: "1 Jugador",
        rating: 5.0,
        featured: true,
        banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
        cover: "assets/covers/gw-simpsons-hit-and-run.svg",
        description: "El mítico The Simpsons: Hit & Run ejecutándose 100% en el navegador vía WebAssembly/WebGL en su página oficial.",
        playUrl: "https://vheissu.github.io/hit-and-run-web/"
    },
    {
        id: "web-peronprime",
        title: "PeronPrime 3D: Zombie Survival",
        system: "web",
        systemName: "Juego Web 3D",
        core: "html5",
        genre: "Acción / FPS 3D",
        year: 2026,
        players: "1 Jugador",
        rating: 4.9,
        featured: true,
        banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
        cover: "assets/covers/web-peronprime.svg",
        description: "Sobrevive a infinitas oleadas de zombis en un entorno tridimensional apocalíptico creado con Three.js y WebGL. ¡Corre y dispara directamente en tu navegador!",
        isLocalFile: true,
        playUrl: "games/peronprime.html"
    },
    {
        id: "web-sm64-browser",
        title: "Super Mario 64 (Browser WebGL)",
        system: "web",
        systemName: "Web 3D Port",
        core: "link",
        genre: "Plataformas 3D",
        year: 1996,
        players: "1 Jugador",
        rating: 5.0,
        featured: true,
        banner: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80",
        cover: "assets/covers/n64-super-mario-64.svg",
        description: "Super Mario 64 recompilado y optimizado para ejecutarse nativamente en WebGL en su página oficial.",
        playUrl: "https://rob10mario64.netlify.app/"
    },
    {
        id: "web-doom",
        title: "DOOM Classic (1993)",
        system: "web",
        systemName: "PC / DOS.zone",
        core: "link",
        genre: "FPS Clásico",
        year: 1993,
        players: "1 Jugador",
        rating: 5.0,
        featured: false,
        cover: "assets/covers/web-doom.svg",
        description: "El legendario shooter de id Software ejecutándose vía WebAssembly directamente en DOS.zone.",
        playUrl: "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1"
    },
    {
        id: "web-quake",
        title: "Quake WebAssembly",
        system: "web",
        systemName: "Web 3D / FPS",
        core: "link",
        genre: "FPS Acción 3D",
        year: 1996,
        players: "1 Jugador",
        rating: 4.9,
        featured: false,
        cover: "assets/covers/web-doom.svg",
        description: "El revolucionario juego en 3D de Bethesda/id Software adaptado a WebAssembly.",
        playUrl: "https://js-dos.com/games/quake.jsdos?anonymous=1"
    },
    {
        id: "web-battle-city",
        title: "Battle City (Web Reimplementation)",
        system: "web",
        systemName: "Web Port",
        core: "link",
        genre: "Arcade / Tanks",
        year: 1985,
        players: "1-2 Jugadores",
        rating: 4.7,
        featured: false,
        cover: "assets/covers/nes-super-mario-bros.svg",
        description: "Reimplementación web moderna del clásico tanque de NES.",
        playUrl: "https://vgrichina.github.io/battlecity/"
    },
    {
        id: "web-stunts",
        title: "Stunts / 4D Sports Driving (Web)",
        system: "web",
        systemName: "Web Port",
        core: "link",
        genre: "Carreras 3D / Acrobacias",
        year: 1990,
        players: "1 Jugador",
        rating: 4.8,
        featured: false,
        cover: "assets/covers/ps2-need-for-speed-mw.svg",
        description: "El pionero juego de carreras y creación de pistas en 3D poligonales.",
        playUrl: "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fstunts.jsdos?anonymous=1"
    },
    {
        id: "web-pacman",
        title: "Pac-Man HTML5",
        system: "web",
        systemName: "Arcade Web",
        core: "html5",
        genre: "Arcade Clásico",
        year: 1980,
        players: "1 Jugador",
        rating: 4.8,
        featured: false,
        cover: "assets/covers/nes-super-mario-bros.svg",
        description: "Come todos los puntos y esquiva a los fantasmas en esta versión web fluida.",
        playUrl: "https://masonicmail.com/pacman/"
    }
];

// Constantes de sistemas soportados
const SYSTEMS_CONFIG = {
    all: { name: "Todos los Juegos", icon: "🎮", badge: "ALL", color: "#6366f1" },
    favs: { name: "Favoritos", icon: "⭐", badge: "FAV", color: "#f59e0b" },
    recent: { name: "Recientes", icon: "🕒", badge: "REC", color: "#3b82f6" },
    web: { name: "Juegos Web & 3D (Directo)", icon: "🌐", badge: "WEB 3D", color: "#10b981", core: "html5" }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DEFAULT_GAMES, SYSTEMS_CONFIG };
}
