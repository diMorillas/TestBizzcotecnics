import { Test } from "./test.js";
import { Figura } from "./figura.js";
import { figuraAlianza } from "./figuraAlianza.js";
import { figuraHorda } from "./figuraHorda.js";
import { figuraHots } from "./figuraHots.js";
import { figuraOverwatch } from "./figuraOverwatch.js";

const DB_NAME = "testsDB";
const DB_VERSION = 1;
const STORE_NAME = "tests";

let db = null;

// Función para abrir la base de datos
const openDB = async () => {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "idTest" });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            reject("Error abriendo la base de datos: " + event.target.errorCode);
        };
    });
};

// Definimos un objeto con las operaciones permitidas
export const operaciones = {
    addTest: (store, data) => store.add(data),
    updateTest: (store, data) => store.put(data),
    deleteTest: (store, data) => store.delete(data),
    getTest: (store, data) => store.get(data),
    getAllTests: (store) => store.getAll(),
};

export const indexedDbManager = async (operation, data = null) => {
    try {
        console.log("he entrado en la función");
        const db = await openDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            
            if (!operaciones[operation]) {
                reject("Operación no válida");
                return;
            }

            // Pasamos 'operaciones' explícitamente a la función dinámica
            const fn = new Function("store", "data", "operaciones", `
                return operaciones['${operation}'](store, data);
            `);
            
            const request = fn(store, data, operaciones);  // Pasamos 'operaciones' aquí

            request.onsuccess = () => {
                resolve(request.result || "Operación completada");
            };
            request.onerror = () => {
                reject("Error en la operación: " + request.error);
            };
        });
    } catch (error) {
        console.error("Error en indexedDbManager:", error);
        return "Error en la operación";
    }
};

