/**
 * @fileoverview
 * Clase que representa una figura del tipo "Hots".
 * Hereda de la clase base `Figura` y añade un campo para el tipo de figura.
 * 
 * @author Didac Morillas, Pau Morillas
 * @version 1.0.5
 * @date 2025-03-24
 */

import { Figura } from "./figura.js";

/**
 * Clase que representa una figura del tipo "Hots".
 * Hereda de la clase base `Figura` y añade un campo para el tipo de figura.
 * 
 * @extends Figura
 * @class
 */
export class figuraHots extends Figura {
    /**
     * Crea una instancia de `figuraHots`.
     * 
     * @param {string} idFigura - El identificador único de la figura.
     * @param {string} urlFigura - La URL que apunta a la imagen de la figura.
     * @param {string} tipoFigura - El tipo de la figura, en este caso "Hots".
     */
    constructor(idFigura, urlFigura, tipoFigura) {
        super(idFigura, urlFigura);
        this.tipoFigura = tipoFigura;
    }
}
