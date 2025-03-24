/**
 * @file Partida.js
 * @date 24 marzo 2025
 * @author 
 *   - Didac Morillas
 *   - Pau Morillas
 * @version 1.0.5
 * @description Módulo que define la clase Partida para gestionar una partida, incluyendo la gestión de jugadores asociados a la partida.
 */

import { Jugador } from './Jugador.js';

/**
 * Clase que representa una partida.
 */
export class Partida {
    /**
     * Crea una instancia de Partida.
     * @param {number|string} idPartida - Identificador único de la partida.
     */
    constructor(idPartida) {
        this.idPartida = idPartida;
        /**
         * Map que almacena los jugadores asociados a la partida.
         * La clave es el email del jugador y el valor es la instancia de Jugador.
         * @type {Map<string, Jugador>}
         */
        this.jugadoresPartida = new Map();
        /**
         * Propiedad para almacenar los tests asociados a la partida.
         * @type {any|null}
         */
        this.testsPartida = null;
    }

    /**
     * Agrega un jugador a la partida.
     * @param {Jugador} jugador - Instancia de Jugador a agregar.
     * @throws {Error} Si el parámetro no es una instancia de Jugador.
     */
    agregarJugador(jugador) {
        if (!(jugador instanceof Jugador)) {
            throw new Error("Solo se pueden agregar instancias de Jugador");
        }
        this.jugadoresPartida.set(jugador.email, jugador);
    }

    /**
     * Obtiene un jugador de la partida a partir de su email.
     * @param {string} email - Email del jugador a obtener.
     * @returns {Jugador|undefined} La instancia de Jugador asociada al email o undefined si no existe.
     */
    obtenerJugador(email) {
        return this.jugadoresPartida.get(email);
    }

    /**
     * Elimina un jugador de la partida a partir de su email.
     * @param {string} email - Email del jugador a eliminar.
     */
    eliminarJugador(email) {
        this.jugadoresPartida.delete(email);
    }
}
