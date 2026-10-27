// Almacenamiento local mediante IndexedDB (para ROMs binarias grandes) y LocalStorage (para metadatos)

class RetroDatabase {
    constructor() {
        this.dbName = "RetroStationDB";
        this.dbVersion = 1;
        this.db = null;
        this.readyPromise = this.initDB();
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Almacén para ROMs y archivos pesados
                if (!db.objectStoreNames.contains("roms")) {
                    db.createObjectStore("roms", { keyPath: "id" });
                }
                // Almacén para estados guardados / saves
                if (!db.objectStoreNames.contains("saves")) {
                    db.createObjectStore("saves", { keyPath: "id" });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error("IndexedDB Error:", event.target.error);
                resolve(null); // Continuar con LocalStorage degradado
            };
        });
    }

    // Guardar archivo ROM en IndexedDB
    async saveRomBlob(gameId, fileBlob, filename) {
        await this.readyPromise;
        if (!this.db) return false;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["roms"], "readwrite");
            const store = transaction.objectStore("roms");
            const request = store.put({
                id: gameId,
                filename: filename,
                blob: fileBlob,
                size: fileBlob.size,
                savedAt: new Date().toISOString()
            });

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    // Obtener archivo ROM desde IndexedDB
    async getRomBlob(gameId) {
        await this.readyPromise;
        if (!this.db) return null;

        return new Promise((resolve) => {
            const transaction = this.db.transaction(["roms"], "readonly");
            const store = transaction.objectStore("roms");
            const request = store.get(gameId);

            request.onsuccess = () => {
                resolve(request.result ? request.result.blob : null);
            };
            request.onerror = () => resolve(null);
        });
    }

    // Eliminar ROM de IndexedDB
    async deleteRomBlob(gameId) {
        await this.readyPromise;
        if (!this.db) return;

        return new Promise((resolve) => {
            const transaction = this.db.transaction(["roms"], "readwrite");
            const store = transaction.objectStore("roms");
            const request = store.delete(gameId);
            request.onsuccess = () => resolve(true);
            request.onerror = () => resolve(false);
        });
    }

    // --- METADATOS Y FAVORITOS EN LOCALSTORAGE ---

    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem("retro_favorites") || "[]");
        } catch (e) {
            return [];
        }
    }

    toggleFavorite(gameId) {
        const favs = this.getFavorites();
        const index = favs.indexOf(gameId);
        let isFav = false;
        if (index > -1) {
            favs.splice(index, 1);
        } else {
            favs.push(gameId);
            isFav = true;
        }
        localStorage.setItem("retro_favorites", JSON.stringify(favs));
        return isFav;
    }

    isFavorite(gameId) {
        return this.getFavorites().includes(gameId);
    }

    getCustomGames() {
        try {
            return JSON.parse(localStorage.getItem("retro_custom_games") || "[]");
        } catch (e) {
            return [];
        }
    }

    saveCustomGame(gameMeta) {
        const list = this.getCustomGames();
        const existingIdx = list.findIndex(g => g.id === gameMeta.id);
        if (existingIdx > -1) {
            list[existingIdx] = gameMeta;
        } else {
            list.unshift(gameMeta);
        }
        localStorage.setItem("retro_custom_games", JSON.stringify(list));
    }

    deleteCustomGame(gameId) {
        let list = this.getCustomGames();
        list = list.filter(g => g.id !== gameId);
        localStorage.setItem("retro_custom_games", JSON.stringify(list));
        this.deleteRomBlob(gameId);
    }

    getRecentGames() {
        try {
            return JSON.parse(localStorage.getItem("retro_recent_games") || "[]");
        } catch (e) {
            return [];
        }
    }

    addRecentGame(gameId) {
        let recent = this.getRecentGames().filter(id => id !== gameId);
        recent.unshift(gameId);
        if (recent.length > 12) recent.pop();
        localStorage.setItem("retro_recent_games", JSON.stringify(recent));
    }

    // Exportar configuración completa a JSON
    exportLibraryJSON() {
        const data = {
            version: 1,
            exportDate: new Date().toISOString(),
            favorites: this.getFavorites(),
            customGames: this.getCustomGames(),
            recentGames: this.getRecentGames()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `retrostation_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Importar configuración desde JSON
    async importLibraryJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.favorites) localStorage.setItem("retro_favorites", JSON.stringify(data.favorites));
            if (data.customGames) localStorage.setItem("retro_custom_games", JSON.stringify(data.customGames));
            if (data.recentGames) localStorage.setItem("retro_recent_games", JSON.stringify(data.recentGames));
            return true;
        } catch (e) {
            console.error("Error al importar backup:", e);
            return false;
        }
    }
}

window.retroDB = new RetroDatabase();
