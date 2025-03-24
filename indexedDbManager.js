/**
 * @fileoverview
 * Módulo para gestionar operaciones sobre una base de datos IndexedDB que almacena información sobre tests.
 * Este archivo contiene funciones para abrir la base de datos, gestionar las operaciones CRUD y facilitar la interacción con el almacén `tests`.
 * 
 * @author Didac Morillas, Pau Morillas
 * @version 1.0.5
 * @date 2025-03-24
 */

import { Test } from "./test.js";
import { Figura } from "./figura.js";
import { figuraHeartStone } from "./figuraHeartStone.js";
import { figuraWow } from "./figuraWow.js";
import { figuraHots } from "./figuraHots.js";
import { figuraOverwatch } from "./figuraOverwatch.js";

// Definición de los parámetros para la base de datos
const DB_NAME = "testsDB"; // Nombre de la base de datos
const DB_VERSION = 1; // Versión de la base de datos
const STORE_NAME = "tests"; // Nombre del almacén de datos

let db = null;

/**
 * Abre la base de datos IndexedDB o la crea si no existe.
 * Si la base de datos no contiene el almacén `tests`, se crea uno con el campo `idTest` como clave primaria.
 * 
 * @returns {Promise<IDBDatabase>} Promesa que se resuelve con la instancia de la base de datos.
 */
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

/**
 * Objeto que define las operaciones CRUD permitidas sobre la base de datos.
 * 
 * @type {Object}
 * @property {Function} addTest - Añade un nuevo test al almacén.
 * @property {Function} updateTest - Actualiza un test existente en el almacén.
 * @property {Function} deleteTest - Elimina un test del almacén.
 * @property {Function} getTest - Obtiene un test específico del almacén.
 * @property {Function} getAllTests - Obtiene todos los tests del almacén.
 */
export const operaciones = {
    /**
     * Añade un test al almacén de datos.
     * 
     * @param {IDBObjectStore} store - El objeto almacén de la base de datos.
     * @param {Object} data - Los datos del test a añadir.
     * 
     * @returns {IDBRequest} La solicitud de IndexedDB.
     */
    addTest: (store, data) => store.add(data),

    /**
     * Actualiza un test existente en el almacén de datos.
     * 
     * @param {IDBObjectStore} store - El objeto almacén de la base de datos.
     * @param {Object} data - Los datos del test a actualizar.
     * 
     * @returns {IDBRequest} La solicitud de IndexedDB.
     */
    updateTest: (store, data) => store.put(data),

    /**
     * Elimina un test del almacén de datos.
     * 
     * @param {IDBObjectStore} store - El objeto almacén de la base de datos.
     * @param {Object} data - Los datos del test a eliminar.
     * 
     * @returns {IDBRequest} La solicitud de IndexedDB.
     */
    deleteTest: (store, data) => store.delete(data),

    /**
     * Obtiene un test específico del almacén de datos.
     * 
     * @param {IDBObjectStore} store - El objeto almacén de la base de datos.
     * @param {string|number} data - El identificador del test a obtener.
     * 
     * @returns {IDBRequest} La solicitud de IndexedDB.
     */
    getTest: (store, data) => store.get(data),

    /**
     * Obtiene todos los tests del almacén de datos.
     * 
     * @param {IDBObjectStore} store - El objeto almacén de la base de datos.
     * 
     * @returns {IDBRequest} La solicitud de IndexedDB.
     */
    getAllTests: (store) => store.getAll(),
};

/**
 * Función principal para gestionar las operaciones sobre la base de datos IndexedDB.
 * Realiza la operación especificada (addTest, updateTest, deleteTest, etc.) sobre los datos proporcionados.
 * 
 * @param {string} operation - El nombre de la operación a realizar. Puede ser "addTest", "updateTest", "deleteTest", etc.
 * @param {Object|null} [data=null] - Los datos a utilizar en la operación. Puede ser nulo para algunas operaciones.
 * 
 * @returns {Promise<any>} Promesa que se resuelve con el resultado de la operación o un mensaje de error.
 * 
 * @throws {Error} Lanza un error si la operación no es válida o si ocurre un error durante la transacción.
 */
export async function indexedDbManager(operation, data = null) {
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

            // Función dinámica que ejecuta la operación correspondiente
            const fn = new Function("store", "data", "operaciones", `
                return operaciones['${operation}'](store, data);
            `);
            
            const request = fn(store, data, operaciones);  // Ejecuta la operación

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
