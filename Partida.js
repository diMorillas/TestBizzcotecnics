import { IndexedDBManager } from './indexedDbManager.js'; 

export class Partida {
    constructor(idPartida, puntuacioPartida, jugadorPartida, testsPartida) {
        this.idPartida = idPartida;
        this.puntuacioPartida = puntuacioPartida;
        this.jugadorPartida = jugadorPartida; // objetos jugador
        this.testsPartida = testsPartida; // array de tests
    }

    // Getters
    async getIdPartida() {
        const db = await IndexedDBManager.getDB('gameDB');
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['partidas'], 'readonly');
            const store = transaction.objectStore('partidas');
            const request = store.get(this.idPartida);

            request.onsuccess = (event) => {
                resolve(event.target.result ? event.target.result.idPartida : null);
            };

            request.onerror = (event) => {
                reject(`Error retrieving data: ${event.target.errorCode}`);
            };
        });
    }

    async getPuntuacioPartida() {
        const db = await IndexedDBManager.getDB('gameDB');
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['partidas'], 'readonly');
            const store = transaction.objectStore('partidas');
            const request = store.get(this.idPartida);

            request.onsuccess = (event) => {
                resolve(event.target.result ? event.target.result.puntuacioPartida : null);
            };

            request.onerror = (event) => {
                reject(`Error retrieving data: ${event.target.errorCode}`);
            };
        });
    }

    async getJugadorsPartida() {
        const db = await IndexedDBManager.getDB('gameDB');
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['partidas'], 'readonly');
            const store = transaction.objectStore('partidas');
            const request = store.get(this.idPartida);

            request.onsuccess = (event) => {
                resolve(event.target.result ? event.target.result.jugadorPartida : null);
            };

            request.onerror = (event) => {
                reject(`Error retrieving data: ${event.target.errorCode}`);
            };
        });
    }

    async getTestsPartida() {
        const db = await IndexedDBManager.getDB('gameDB');
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['partidas'], 'readonly');
            const store = transaction.objectStore('partidas');
            const request = store.get(this.idPartida);

            request.onsuccess = (event) => {
                resolve(event.target.result ? event.target.result.testsPartida : null);
            };

            request.onerror = (event) => {
                reject(`Error retrieving data: ${event.target.errorCode}`);
            };
        });
    }

    // Setters
    async setIdPartida(idPartida) {
        this.idPartida = idPartida;
        await this.saveToDB();
    }

    async setPuntuacioPartida(puntuacioPartida) {
        this.puntuacioPartida = puntuacioPartida;
        await this.saveToDB();
    }

    async setJugadorsPartida(jugadorPartida) {
        this.jugadorPartida = jugadorPartida;
        await this.saveToDB();
    }

    async setTestsPartida(testsPartida) {
        this.testsPartida = testsPartida;
        await this.saveToDB();
    }

    // Método para guardar los datos de la partida en IndexedDB
    async saveToDB() {
        const db = await IndexedDBManager.getDB('gameDB');
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['partidas'], 'readwrite');
            const store = transaction.objectStore('partidas');
            const request = store.put({
                idPartida: this.idPartida,
                puntuacioPartida: this.puntuacioPartida,
                jugadorPartida: this.jugadorPartida,
                testsPartida: this.testsPartida,
            });

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject(`Error saving data: ${event.target.errorCode}`);
            };
        });
    }
}
