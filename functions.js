/**
 * @fileoverview
 * Módulo para gestionar jugadores en un array. Permite añadir jugadores, 
 * y eliminar el primer o último jugador de la lista.
 * 
 * @author Didac Morillas, Pau Morillas
 * @version 1.0.5
 * @date 2025-03-24
 */

import { Jugador } from "./Jugador.js";

/**
 * Añade un jugador al array de jugadores después de validar su email.
 * 
 * Solicita al usuario los datos del jugador (nombre, email, tiempo y puntuación).
 * Valida el email con una expresión regular y, si es incorrecto, muestra un mensaje de error.
 * Si el email es válido, crea una nueva instancia de la clase `Jugador` y la añade al array.
 * 
 * @param {Array<Jugador>} array - El array de jugadores donde se añadirá el nuevo jugador.
 * @returns {Array<Jugador>} El array de jugadores actualizado.
 */
export function addPlayer(array) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    let nombre = prompt('Nombre del jugador');
    let email = prompt('Email del jugador');
    
    if (!emailRegex.test(email)) {  // Corregido: Usar 'email' en la validación
        alert("Introduce un email válido con '@'.");
        return array;  // Devolver el array sin cambios
    }

    let tiempo = Number(prompt('Tiempo en hacer el test'));
    let puntuacio = Number(prompt('Puntuacion sobre 3'));

    let newPlayer = new Jugador(nombre, email, tiempo, puntuacio);
    array.push(newPlayer);

    return array;
}

/**
 * Elimina el último jugador del array.
 * 
 * Utiliza el método `pop()` para eliminar el último elemento del array y luego
 * devuelve el array actualizado.
 * 
 * @param {Array<Jugador>} array - El array de jugadores del cual se eliminará el último jugador.
 * @returns {Array<Jugador>} El array de jugadores actualizado sin el último jugador.
 */
export function removeLastElement(array) {
    array.pop();
    return array;
}

/**
 * Elimina el primer jugador del array.
 * 
 * Utiliza el método `shift()` para eliminar el primer elemento del array y luego
 * devuelve el array actualizado.
 * 
 * @param {Array<Jugador>} array - El array de jugadores del cual se eliminará el primer jugador.
 * @returns {Array<Jugador>} El array de jugadores actualizado sin el primer jugador.
 */
export function removeFirstElement(array) {
    array.shift();
    return array;
}
