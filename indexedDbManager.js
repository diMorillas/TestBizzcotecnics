import { Test } from "./test";
import { Figura } from "./figura";
import { figuraAlianza } from "./figuraAlianza";
import { figuraHorda } from "./figuraHorda";
import { figuraHots } from "./figuraHots";
import { figuraOverwatch } from "./figuraOverwatch";


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
const operaciones = {
    addTest: (store, data) => store.add(data),
    updateTest: (store, data) => store.put(data),
    deleteTest: (store, data) => store.delete(data),
    getTest: (store, data) => store.get(data),
    getAllTests: (store) => store.getAll(),
};

// Función de acceso dinámico con `new Function()`
export const indexedDbManager = async (operation, data = null) => {
    try {
        db = await openDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            
            if (!operaciones[operation]) {
                reject("Operación no válida");
                return;
            }

            // Creamos la función dinámicamente con `new Function()`
            const fn = new Function("store", "data", `return operaciones['${operation}'](store, data);`);
            const request = fn(store, data);

            request.onsuccess = () => resolve(request.result || "Operación completada");
            request.onerror = () => reject("Error en la operación: " + request.error);
        });
    } catch (error) {
        console.error(error);
        return "Error en la operación";
    }
};
