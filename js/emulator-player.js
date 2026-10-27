// Gestor del reproductor de emulación y juegos Web 3D
// Soporta EmulatorJS para PS1, NES, SNES, GBA, N64, NDS, SEGA y contenedores iframe para HTML5

class EmulatorPlayer {
    constructor() {
        this.container = document.getElementById("emulator-modal");
        this.frameWrapper = document.getElementById("emulator-screen-wrapper");
        this.activeGame = null;
        this.activeBlobUrl = null;
        this.crtFilterActive = false;
        this.initControls();
        this.initGamepadListener();
    }

    initControls() {
        // Botón cerrar reproductor
        const btnClose = document.getElementById("btn-close-emulator");
        if (btnClose) {
            btnClose.addEventListener("click", () => this.close());
        }

        // Botón pantalla completa
        const btnFullscreen = document.getElementById("btn-toggle-fullscreen");
        if (btnFullscreen) {
            btnFullscreen.addEventListener("click", () => this.toggleFullscreen());
        }

        // Botón filtro CRT / Retro
        const btnCrt = document.getElementById("btn-toggle-crt");
        if (btnCrt) {
            btnCrt.addEventListener("click", () => this.toggleCrtFilter());
        }

        // Tecla ESC para salir
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.isOpen()) {
                // Solo si no está en pantalla completa
                if (!document.fullscreenElement) {
                    this.close();
                }
            }
        });
    }

    initGamepadListener() {
        const updateGamepadStatus = () => {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            const connected = Array.from(gamepads).some(gp => gp && gp.connected);
            const badge = document.getElementById("gamepad-indicator");
            if (badge) {
                if (connected) {
                    badge.classList.add("connected");
                    badge.innerHTML = "🎮 Mando Conectado";
                } else {
                    badge.classList.remove("connected");
                    badge.innerHTML = "🎮 Conecta un mando (Opcional)";
                }
            }
        };

        window.addEventListener("gamepadconnected", () => {
            if (window.soundEngine) window.soundEngine.playCoin();
            updateGamepadStatus();
        });
        window.addEventListener("gamepaddisconnected", () => updateGamepadStatus());
        setInterval(updateGamepadStatus, 3000);
    }

    isOpen() {
        return this.container && this.container.classList.contains("active");
    }

    async launchGame(game, customFileBlob = null) {
        this.activeGame = game;
        if (window.soundEngine) window.soundEngine.playLaunch();

        // Registrar en recientes
        if (window.retroDB && game.id) {
            window.retroDB.addRecentGame(game.id);
        }

        // Actualizar título y metadatos en la barra del reproductor
        document.getElementById("player-game-title").textContent = game.title;
        document.getElementById("player-game-sys").textContent = (game.systemName || game.system).toUpperCase();
        document.getElementById("player-controls-guide").textContent = game.controlsGuide || "Usa el teclado o conecta un joystick por USB/Bluetooth.";

        // Mostrar el modal
        this.container.classList.add("active");
        document.body.style.overflow = "hidden";

        // Limpiar pantalla previa
        this.frameWrapper.innerHTML = "";

        // Si es un juego web o enlace directo (The Simpsons Hit & Run, Super Mario 64 WebGL, etc.), abrir directamente en la página de alojamiento
        if (game.system === "web" || game.core === "link" || game.redirectUrl) {
            const targetUrl = game.playUrl || game.redirectUrl || game.projectUrl || game.romUrl;
            if (targetUrl) {
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
                return;
            }
        }

        // Si es un juego de consola retro (EmulatorJS)
        await this.launchRetroGame(game, customFileBlob);
    }

    launchWebGame(game) {
        const iframe = document.createElement("iframe");
        iframe.src = game.playUrl || game.romUrl;
        iframe.allow = "autoplay; fullscreen; pointer-lock; gamepad; cross-origin-isolated";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.setAttribute("allowfullscreen", "true");
        this.frameWrapper.appendChild(iframe);
    }

    async launchRetroGame(game, customFileBlob = null) {
        let finalRomUrl = game.romUrl;

        // Si se pasó un Blob local directamente
        if (customFileBlob) {
            if (this.activeBlobUrl) URL.revokeObjectURL(this.activeBlobUrl);
            this.activeBlobUrl = URL.createObjectURL(customFileBlob);
            finalRomUrl = this.activeBlobUrl;
        } else if (game.isCustom && window.retroDB) {
            // Cargar desde IndexedDB si es juego añadido por el usuario
            const storedBlob = await window.retroDB.getRomBlob(game.id);
            if (storedBlob) {
                if (this.activeBlobUrl) URL.revokeObjectURL(this.activeBlobUrl);
                this.activeBlobUrl = URL.createObjectURL(storedBlob);
                finalRomUrl = this.activeBlobUrl;
            }
        }

        // Construir contenedor del emulador
        const emuDiv = document.createElement("div");
        emuDiv.id = "ejs-player-viewport";
        emuDiv.style.width = "100%";
        emuDiv.style.height = "100%";
        this.frameWrapper.appendChild(emuDiv);

        // Core correspondiente
        const coreMap = {
            "psx": "psx",
            "snes": "snes",
            "nes": "nes",
            "gba": "gba",
            "gb": "gb",
            "gbc": "gb",
            "n64": "n64",
            "nds": "nds",
            "sega": "segaMD",
            "segaMD": "segaMD"
        };
        const core = coreMap[game.core] || coreMap[game.system] || "gba";

        // Parámetros de configuración de EmulatorJS
        window.EJS_player = '#ejs-player-viewport';
        window.EJS_core = core;
        window.EJS_gameName = game.title;
        window.EJS_color = '#6366f1';
        window.EJS_startOnLoaded = true;
        window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
        window.EJS_gameUrl = finalRomUrl;

        // Si no tiene ROM asignada aún (ejemplo, usuario abrió tarjeta sin ROM cargada)
        if (!finalRomUrl) {
            this.showDropRomNotice(game);
            return;
        }

        // Cargar el script de arranque de EmulatorJS
        const script = document.createElement("script");
        script.id = "ejs-loader-script";
        script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
        script.onerror = () => {
            this.frameWrapper.innerHTML = `
                <div class="emulator-error-fallback">
                    <h3>⚠️ Error al cargar el núcleo de emulación</h3>
                    <p>Verifica tu conexión a Internet para descargar el núcleo de ${game.systemName || game.system}.</p>
                    <button class="btn btn-primary" onclick="window.playerEngine.launchGame(window.playerEngine.activeGame)">Reintentar</button>
                </div>
            `;
        };
        this.frameWrapper.appendChild(script);
    }

    showDropRomNotice(game) {
        this.frameWrapper.innerHTML = `
            <div class="rom-prompt-zone" id="prompt-drop-zone">
                <div class="icon">📂</div>
                <h2>Carga la ROM de ${game.title}</h2>
                <p>Arrastra y suelta tu archivo de juego (.${game.system === 'psx' ? 'chd/.bin/.iso' : game.system === 'snes' ? 'smc/.sfc' : game.system === 'gba' ? 'gba' : game.system === 'n64' ? 'z64' : 'rom'}) aquí o selecciónalo:</p>
                <input type="file" id="prompt-rom-input" style="display:none;" />
                <button class="btn btn-primary" onclick="document.getElementById('prompt-rom-input').click()">
                    Seleccionar Archivo ROM desde mi PC
                </button>
            </div>
        `;

        const input = document.getElementById("prompt-rom-input");
        const dropZone = document.getElementById("prompt-drop-zone");

        input.addEventListener("change", (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                this.launchRetroGame(game, file);
            }
        });

        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.classList.add("drag-hover");
        });

        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("drag-hover");
        });

        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("drag-hover");
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                this.launchRetroGame(game, file);
            }
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.container.requestFullscreen().catch(err => {
                console.error("No se pudo iniciar pantalla completa:", err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    toggleCrtFilter() {
        this.crtFilterActive = !this.crtFilterActive;
        const screenWrapper = document.getElementById("emulator-screen-wrapper");
        const btnCrt = document.getElementById("btn-toggle-crt");

        if (this.crtFilterActive) {
            screenWrapper.classList.add("crt-active");
            if (btnCrt) btnCrt.classList.add("active");
        } else {
            screenWrapper.classList.remove("crt-active");
            if (btnCrt) btnCrt.classList.remove("active");
        }
        if (window.soundEngine) window.soundEngine.playSelect();
    }

    close() {
        if (!this.isOpen()) return;

        if (window.soundEngine) window.soundEngine.playBack();

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }

        // Detener emulador y liberar memoria
        this.frameWrapper.innerHTML = "";
        if (this.activeBlobUrl) {
            URL.revokeObjectURL(this.activeBlobUrl);
            this.activeBlobUrl = null;
        }

        // Remover script anterior para permitir recreación limpia
        const oldScript = document.getElementById("ejs-loader-script");
        if (oldScript) oldScript.remove();

        this.container.classList.remove("active");
        document.body.style.overflow = "auto";
        this.activeGame = null;
    }
}

window.playerEngine = new EmulatorPlayer();
