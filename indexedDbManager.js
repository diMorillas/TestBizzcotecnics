

export class IndexedDBManager {
    static openDB(dbName, version) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(`Error opening DB: ${event.target.errorCode}`);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Crear un objeto store si no existe
                if (!db.objectStoreNames.contains("partidas")) {
                    db.createObjectStore("partidas", { keyPath: "idPartida" });
                }
            };
        });
    }

    static getDB(dbName, version = 1) {
        return IndexedDBHelper.openDB(dbName, version);
    }
}
// IndexedDBHelper.js

export class IndexedDBHelper {
    static openDB(dbName, version) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(`Error opening DB: ${event.target.errorCode}`);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Crear un objeto store si no existe
                if (!db.objectStoreNames.contains("partidas")) {
                    db.createObjectStore("partidas", { keyPath: "idPartida" });
                }
            };
        });
    }

    static getDB(dbName, version = 1) {
        return IndexedDBHelper.openDB(dbName, version);
    }
}
