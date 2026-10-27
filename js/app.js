// Aplicación Principal de la Consola RetroStation Web

class RetroStationApp {
    constructor() {
        this.allGames = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.currentSort = 'featured';
        this.heroIndex = 0;
        this.heroTimer = null;
        this.visibleCount = 60; // Paginación virtual para catálogo de más de 1200 juegos

        this.init();
    }

    async init() {
        // Cargar juegos por defecto y personalizados
        this.loadGames();

        // Configurar navegación de sistemas
        this.setupSystemTabs();

        // Configurar barra de búsqueda y orden
        this.setupSearchAndSort();

        // Configurar botones de acción global (Agregar juego, Cargar ROM, Exportar/Importar, Sonido)
        this.setupActionButtons();

        // Configurar Drag & Drop global para ROMs
        this.setupGlobalDragAndDrop();

        // Iniciar Carrusel Hero
        this.setupHeroCarousel();

        // Renderizar catálogo inicial
        this.renderGames();

        // Actualizar estadísticas en header
        this.updateStats();

        // Verificación de sincronización cada 7 días en el navegador
        this.checkWeeklyAutoSync();
    }

    async checkWeeklyAutoSync() {
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const lastSync = localStorage.getItem("gamewave_last_sync_timestamp");
        const now = Date.now();

        if (!lastSync || (now - parseInt(lastSync, 10)) > SEVEN_DAYS_MS) {
            console.log("[Auto-Sync] Verificando nuevos ports de GameWave Digital (Ciclo de 7 días)...");
            await this.syncGameWaveInBrowser(false);
            localStorage.setItem("gamewave_last_sync_timestamp", now.toString());
        }
    }

    async syncGameWaveInBrowser(userTriggered = true) {
        const syncBtn = document.getElementById("btn-sync-gamewave");
        if (syncBtn) {
            syncBtn.textContent = "⏳ Sincronizando...";
            syncBtn.disabled = true;
        }

        try {
            const resp = await fetch('https://gamewave.digital/ports/catalog.json');
            if (!resp.ok) throw new Error("No se pudo conectar con GameWave");
            const data = await resp.json();
            const apps = data.apps || [];
            
            const prevCount = (typeof GAMEWAVE_GAMES !== 'undefined') ? GAMEWAVE_GAMES.length : 0;
            const diff = apps.length - prevCount;

            localStorage.setItem("gamewave_last_sync_timestamp", Date.now().toString());

            if (userTriggered) {
                if (window.soundEngine) window.soundEngine.playCoin();
                if (diff > 0) {
                    alert(`🌊 ¡Sincronización completada!\nSe detectaron ${diff} nuevos ports disponibles en GameWave Digital.`);
                } else {
                    alert(`🌊 Tu biblioteca está 100% sincronizada con GameWave Digital (${apps.length} ports registrados).`);
                }
            }
        } catch (e) {
            console.warn("[Auto-Sync] Aviso:", e.message);
            if (userTriggered) {
                alert("Nota: Para sincronización completa sin restricciones CORS, puedes ejecutar 'sync_gamewave.cmd'.");
            }
        } finally {
            if (syncBtn) {
                syncBtn.innerHTML = "🔄 Sincronizar Ports";
                syncBtn.disabled = false;
            }
        }
    }

    loadGames() {
        const customGames = window.retroDB ? window.retroDB.getCustomGames() : [];
        const gwGames = (typeof GAMEWAVE_GAMES !== 'undefined') ? GAMEWAVE_GAMES : [];
        this.allGames = [...customGames, ...DEFAULT_GAMES, ...gwGames];
    }

    setupSystemTabs() {
        const tabsContainer = document.getElementById("system-tabs");
        if (!tabsContainer) return;

        tabsContainer.addEventListener("click", (e) => {
            const tab = e.target.closest(".nav-pill");
            if (!tab) return;

            document.querySelectorAll(".nav-pill").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            this.currentFilter = tab.dataset.system;
            this.visibleCount = 60; // Reiniciar contador al cambiar pestaña
            if (window.soundEngine) window.soundEngine.playSelect();
            this.renderGames();
        });
    }

    setupSearchAndSort() {
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                this.currentSearch = e.target.value.trim().toLowerCase();
                this.visibleCount = 60; // Reiniciar contador al buscar
                this.renderGames();
            });
        }

        const sortSelect = document.getElementById("sort-select");
        if (sortSelect) {
            sortSelect.addEventListener("change", (e) => {
                this.currentSort = e.target.value;
                if (window.soundEngine) window.soundEngine.playSelect();
                this.renderGames();
            });
        }
    }

    setupActionButtons() {
        // Toggle Sonido
        const btnMute = document.getElementById("btn-toggle-sound");
        if (btnMute) {
            btnMute.addEventListener("click", () => {
                if (window.soundEngine) {
                    const isEnabled = window.soundEngine.toggle();
                    btnMute.innerHTML = isEnabled ? "🔊 Sonido: ON" : "🔇 Sonido: OFF";
                    btnMute.classList.toggle("muted", !isEnabled);
                }
            });
        }

        // Botón Sincronizar GameWave
        const btnSyncGW = document.getElementById("btn-sync-gamewave");
        if (btnSyncGW) {
            btnSyncGW.addEventListener("click", () => {
                this.syncGameWaveInBrowser(true);
            });
        }

        // Botón Cargar ROM rápida
        const btnQuickRom = document.getElementById("btn-quick-rom");
        const quickRomInput = document.getElementById("quick-rom-input");
        if (btnQuickRom && quickRomInput) {
            btnQuickRom.addEventListener("click", () => quickRomInput.click());
            quickRomInput.addEventListener("change", (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.handleQuickRomUpload(e.target.files[0]);
                }
            });
        }

        // Botón Agregar Juego (Modal)
        const btnAddGame = document.getElementById("btn-add-game");
        const modalAdd = document.getElementById("add-game-modal");
        const btnCloseAdd = document.getElementById("btn-close-add-modal");
        const formAdd = document.getElementById("form-add-game");

        if (btnAddGame && modalAdd) {
            btnAddGame.addEventListener("click", () => {
                if (window.soundEngine) window.soundEngine.playSelect();
                modalAdd.classList.add("active");
            });
        }

        if (btnCloseAdd && modalAdd) {
            btnCloseAdd.addEventListener("click", () => {
                if (window.soundEngine) window.soundEngine.playBack();
                modalAdd.classList.remove("active");
            });
        }

        if (formAdd) {
            formAdd.addEventListener("submit", async (e) => {
                e.preventDefault();
                await this.handleAddNewGameForm(formAdd);
                modalAdd.classList.remove("active");
                formAdd.reset();
            });
        }

        // Exportar e Importar Backup
        const btnExport = document.getElementById("btn-export-backup");
        const btnImport = document.getElementById("btn-import-backup");
        const fileImport = document.getElementById("backup-file-input");

        if (btnExport && window.retroDB) {
            btnExport.addEventListener("click", () => {
                if (window.soundEngine) window.soundEngine.playCoin();
                window.retroDB.exportLibraryJSON();
            });
        }

        if (btnImport && fileImport) {
            btnImport.addEventListener("click", () => fileImport.click());
            fileImport.addEventListener("change", async (e) => {
                if (e.target.files && e.target.files[0]) {
                    const text = await e.target.files[0].text();
                    const success = await window.retroDB.importLibraryJSON(text);
                    if (success) {
                        alert("¡Colección importada con éxito!");
                        this.loadGames();
                        this.renderGames();
                        this.updateStats();
                    } else {
                        alert("El archivo de respaldo no es válido.");
                    }
                }
            });
        }
    }

    setupGlobalDragAndDrop() {
        const dropOverlay = document.getElementById("global-drag-overlay");

        window.addEventListener("dragover", (e) => {
            e.preventDefault();
            if (dropOverlay) dropOverlay.classList.add("active");
        });

        window.addEventListener("dragleave", (e) => {
            if (e.relatedTarget === null && dropOverlay) {
                dropOverlay.classList.remove("active");
            }
        });

        window.addEventListener("drop", (e) => {
            e.preventDefault();
            if (dropOverlay) dropOverlay.classList.remove("active");

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                this.handleQuickRomUpload(file);
            }
        });
    }

    detectSystemFromFilename(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        switch (ext) {
            case 'gba': return { system: 'gba', systemName: 'Game Boy Advance', core: 'gba' };
            case 'gb': case 'gbc': return { system: 'gba', systemName: 'Game Boy / Color', core: 'gb' };
            case 'sfc': case 'smc': return { system: 'snes', systemName: 'Super Nintendo', core: 'snes' };
            case 'nes': return { system: 'nes', systemName: 'Nintendo NES', core: 'nes' };
            case 'z64': case 'n64': case 'v64': return { system: 'n64', systemName: 'Nintendo 64', core: 'n64' };
            case 'nds': return { system: 'nds', systemName: 'Nintendo DS', core: 'nds' };
            case 'iso': case 'chd': case 'bin': case 'cue': case 'pbp': return { system: 'psx', systemName: 'PlayStation 1', core: 'psx' };
            case 'md': case 'gen': case 'smd': return { system: 'sega', systemName: 'Sega Genesis', core: 'segaMD' };
            default: return { system: 'gba', systemName: 'Juego Retro', core: 'gba' };
        }
    }

    async handleQuickRomUpload(file) {
        if (window.soundEngine) window.soundEngine.playCoin();

        const detected = this.detectSystemFromFilename(file.name);
        const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ").replace(/\(.*\)/g, "").trim();

        const quickGame = {
            id: "temp-" + Date.now(),
            title: cleanTitle,
            system: detected.system,
            systemName: detected.systemName,
            core: detected.core,
            genre: "Cargado desde PC",
            year: new Date().getFullYear(),
            players: "1 Jugador",
            rating: 5.0,
            cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
            description: `Archivo ROM local cargado directamente (${file.name}).`,
            isCustom: true
        };

        // Preguntar si desea guardarlo en la biblioteca permanentemente
        const shouldSave = confirm(`¿Deseas guardar "${cleanTitle}" en tu biblioteca permanente de ${detected.systemName}?`);
        if (shouldSave && window.retroDB) {
            quickGame.id = "custom-" + Date.now();
            await window.retroDB.saveRomBlob(quickGame.id, file, file.name);
            window.retroDB.saveCustomGame(quickGame);
            this.loadGames();
            this.renderGames();
            this.updateStats();
        }

        // Lanzar inmediatamente en el reproductor
        if (window.playerEngine) {
            window.playerEngine.launchGame(quickGame, file);
        }
    }

    async handleAddNewGameForm(form) {
        const title = form.elements['title'].value.trim();
        const system = form.elements['system'].value;
        const genre = form.elements['genre'].value.trim() || 'Aventura';
        const coverUrl = form.elements['coverUrl'].value.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';
        const romUrl = form.elements['romUrl'].value.trim();
        const romFileInput = form.elements['romFile'];
        const desc = form.elements['description'].value.trim() || 'Juego personalizado agregado por el usuario.';

        const sysConfig = SYSTEMS_CONFIG[system] || { name: system.toUpperCase(), core: system };
        const newId = "custom-" + Date.now();

        const game = {
            id: newId,
            title: title,
            system: system,
            systemName: sysConfig.name,
            core: sysConfig.core || system,
            genre: genre,
            year: new Date().getFullYear(),
            players: "1 Jugador",
            rating: 5.0,
            cover: coverUrl,
            description: desc,
            romUrl: romUrl,
            isCustom: true
        };

        if (romFileInput && romFileInput.files && romFileInput.files[0]) {
            const file = romFileInput.files[0];
            if (window.retroDB) {
                await window.retroDB.saveRomBlob(newId, file, file.name);
            }
        }

        if (window.retroDB) {
            window.retroDB.saveCustomGame(game);
            if (window.soundEngine) window.soundEngine.playCoin();
        }

        this.loadGames();
        this.renderGames();
        this.updateStats();
        alert(`¡"${title}" ha sido añadido con éxito a tu consola!`);
    }

    setupHeroCarousel() {
        const featuredGames = this.allGames.filter(g => g.featured);
        if (featuredGames.length === 0) return;

        const bannerTitle = document.getElementById("hero-title");
        const bannerDesc = document.getElementById("hero-desc");
        const bannerSystem = document.getElementById("hero-badge-system");
        const bannerRating = document.getElementById("hero-badge-rating");
        const bannerBg = document.getElementById("hero-banner-bg");
        const btnHeroPlay = document.getElementById("btn-hero-play");

        const updateHero = () => {
            const game = featuredGames[this.heroIndex];
            if (!game) return;

            if (bannerTitle) bannerTitle.textContent = game.title;
            if (bannerDesc) bannerDesc.textContent = game.description;
            if (bannerSystem) bannerSystem.textContent = game.systemName;
            if (bannerRating) bannerRating.textContent = `★ ${game.rating}`;
            if (bannerBg) {
                const img = game.banner || game.cover;
                bannerBg.style.backgroundImage = `linear-gradient(to right, rgba(10, 11, 20, 0.95) 20%, rgba(10, 11, 20, 0.6) 60%, rgba(10, 11, 20, 0.3)), url('${img}')`;
            }

            if (btnHeroPlay) {
                btnHeroPlay.onclick = () => {
                    if (window.playerEngine) window.playerEngine.launchGame(game);
                };
            }
        };

        updateHero();

        const btnPrev = document.getElementById("hero-prev");
        const btnNext = document.getElementById("hero-next");

        if (btnNext) {
            btnNext.addEventListener("click", () => {
                this.heroIndex = (this.heroIndex + 1) % featuredGames.length;
                if (window.soundEngine) window.soundEngine.playHover();
                updateHero();
            });
        }
        if (btnPrev) {
            btnPrev.addEventListener("click", () => {
                this.heroIndex = (this.heroIndex - 1 + featuredGames.length) % featuredGames.length;
                if (window.soundEngine) window.soundEngine.playHover();
                updateHero();
            });
        }

        // Rotación automática suave cada 9 segundos
        this.heroTimer = setInterval(() => {
            this.heroIndex = (this.heroIndex + 1) % featuredGames.length;
            updateHero();
        }, 9000);
    }

    getFilteredGames() {
        let filtered = [...this.allGames];

        // Filtro por sistema o categoría
        if (this.currentFilter === 'favs') {
            const favs = window.retroDB ? window.retroDB.getFavorites() : [];
            filtered = filtered.filter(g => favs.includes(g.id));
        } else if (this.currentFilter === 'recent') {
            const recents = window.retroDB ? window.retroDB.getRecentGames() : [];
            filtered = filtered.filter(g => recents.includes(g.id));
        } else if (this.currentFilter !== 'all') {
            filtered = filtered.filter(g => g.system === this.currentFilter);
        }

        // Filtro por texto de búsqueda
        if (this.currentSearch) {
            filtered = filtered.filter(g => 
                g.title.toLowerCase().includes(this.currentSearch) ||
                (g.systemName && g.systemName.toLowerCase().includes(this.currentSearch)) ||
                (g.genre && g.genre.toLowerCase().includes(this.currentSearch))
            );
        }

        // Ordenamiento
        filtered.sort((a, b) => {
            if (this.currentSort === 'name-asc') return a.title.localeCompare(b.title);
            if (this.currentSort === 'name-desc') return b.title.localeCompare(a.title);
            if (this.currentSort === 'rating') return (b.rating || 0) - (a.rating || 0);
            if (this.currentSort === 'year-desc') return (b.year || 0) - (a.year || 0);
            if (this.currentSort === 'year-asc') return (a.year || 0) - (b.year || 0);
            // Por defecto: featured primero
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        });

        return filtered;
    }

    renderGames() {
        const grid = document.getElementById("games-grid");
        if (!grid) return;

        const allMatched = this.getFilteredGames();

        if (allMatched.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="icon">🎮</div>
                    <h3>No se encontraron juegos</h3>
                    <p>No hay títulos que coincidan con tu filtro actual o búsqueda.</p>
                    <button class="btn btn-secondary" onclick="document.getElementById('search-input').value=''; window.retroApp.currentSearch=''; window.retroApp.currentFilter='all'; document.querySelector('[data-system=all]').click();">
                        Mostrar Todos
                    </button>
                </div>
            `;
            const statsEl = document.getElementById("stat-showing-count");
            if (statsEl) statsEl.textContent = "0";
            return;
        }

        const statsEl = document.getElementById("stat-showing-count");
        if (statsEl) statsEl.textContent = `${Math.min(this.visibleCount, allMatched.length)} de ${allMatched.length}`;

        grid.innerHTML = "";

        const gamesToShow = allMatched.slice(0, this.visibleCount);

        gamesToShow.forEach(game => {
            const card = document.createElement("div");
            card.className = `game-card system-${game.system}`;
            
            const isFav = window.retroDB ? window.retroDB.isFavorite(game.id) : false;
            const sysConfig = SYSTEMS_CONFIG[game.system] || { badge: (game.system || 'GW').toUpperCase(), color: '#06b6d4' };

            const isLink = game.core === "link" || game.redirectUrl;

            card.innerHTML = `
                <div class="card-cover-wrapper">
                    <img class="card-cover" src="${game.cover}" alt="${game.title}" loading="lazy" onerror="this.src='assets/covers/gamewave-default.svg'" />
                    <div class="card-badge" style="background:${sysConfig.color}">${sysConfig.badge || 'GAMEWAVE'}</div>
                    <button class="card-fav-btn ${isFav ? 'is-fav' : ''}" title="Marcar como Favorito" data-id="${game.id}">
                        ${isFav ? '★' : '☆'}
                    </button>
                    <div class="card-overlay">
                        <button class="btn btn-play-card" data-id="${game.id}">
                            ${isLink ? '🌊 ABRIR EN GAMEWAVE ↗' : '▶ JUGAR AHORA'}
                        </button>
                    </div>
                </div>
                <div class="card-info">
                    <div class="card-title" title="${game.title}">${game.title}</div>
                    <div class="card-meta">
                        <span class="card-genre">${game.genre || 'Port'}</span>
                        <span class="card-year">${isLink ? 'GameWave' : (game.year || '')}</span>
                    </div>
                </div>
            `;

            // Efecto de sonido al pasar el ratón
            card.addEventListener("mouseenter", () => {
                if (window.soundEngine) window.soundEngine.playHover();
            });

            // Botón jugar / abrir enlace
            const btnPlay = card.querySelector(".btn-play-card");
            btnPlay.addEventListener("click", (e) => {
                e.stopPropagation();
                if (window.playerEngine) window.playerEngine.launchGame(game);
            });

            // Clic en la tarjeta completa para jugar / abrir enlace
            card.addEventListener("click", () => {
                if (window.playerEngine) window.playerEngine.launchGame(game);
            });

            // Botón favorito
            const btnFav = card.querySelector(".card-fav-btn");
            btnFav.addEventListener("click", (e) => {
                e.stopPropagation();
                if (window.retroDB) {
                    const newFavState = window.retroDB.toggleFavorite(game.id);
                    btnFav.classList.toggle("is-fav", newFavState);
                    btnFav.innerHTML = newFavState ? '★' : '☆';
                    if (window.soundEngine) window.soundEngine.playCoin();
                    if (this.currentFilter === 'favs') {
                        this.renderGames();
                    }
                    this.updateStats();
                }
            });

            grid.appendChild(card);
        });

        // Botón "Cargar Más Juegos" si hay más en la lista
        if (this.visibleCount < allMatched.length) {
            const loadMoreWrapper = document.createElement("div");
            loadMoreWrapper.className = "load-more-wrapper";
            loadMoreWrapper.style.gridColumn = "1 / -1";
            loadMoreWrapper.style.textAlign = "center";
            loadMoreWrapper.style.padding = "30px 0";

            const btnLoadMore = document.createElement("button");
            btnLoadMore.className = "btn btn-primary";
            btnLoadMore.style.padding = "14px 40px";
            btnLoadMore.style.fontSize = "16px";
            btnLoadMore.textContent = `Mostrar más juegos (+60 de ${allMatched.length - this.visibleCount} restantes)`;
            
            btnLoadMore.addEventListener("click", () => {
                this.visibleCount += 60;
                if (window.soundEngine) window.soundEngine.playSelect();
                this.renderGames();
            });

            loadMoreWrapper.appendChild(btnLoadMore);
            grid.appendChild(loadMoreWrapper);
        }
    }

    updateStats() {
        const totalCountEl = document.getElementById("stat-total-games");
        const favCountEl = document.getElementById("stat-fav-games");
        const systemCountEl = document.getElementById("stat-systems-count");

        if (totalCountEl) totalCountEl.textContent = this.allGames.length;
        if (favCountEl && window.retroDB) favCountEl.textContent = window.retroDB.getFavorites().length;
        if (systemCountEl) systemCountEl.textContent = Object.keys(SYSTEMS_CONFIG).length - 1; // Menos "all"
    }
}

// Iniciar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    window.retroApp = new RetroStationApp();
});
