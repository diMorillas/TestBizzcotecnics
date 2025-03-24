/**
 * @file test.js
 * @date 24 marzo 2025
 * @author 
 *   - Didac Morillas
 *   - Pau Morillas
 * @version 1.0.5
 * @description Módulo que define la clase Test para gestionar un test, que contiene figuras, un identificador y una puntuación.
 */

/**
 * Clase que representa un Test.
 */
export class Test {
    /**
     * Crea una instancia de Test.
     * @param {Array<any>} figuras - Array de figuras que forman parte del test.
     * @param {number|string} idTest - Identificador único del test.
     * @param {number} puntuacion - Puntuación asociada al test.
     */
    constructor(figuras, idTest, puntuacion) {
        this.figuras = figuras;
        this.idTest = idTest;
        this.puntuacion = puntuacion;
    }
}
