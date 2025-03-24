/**
 * @fileoverview
 * Clase base que representa una figura. 
 * La clase contiene dos propiedades: el identificador único de la figura 
 * y la URL de la imagen asociada a la figura.
 * 
 * @author Didac Morillas, Pau Morillas
 * @version 1.0.5
 * @date 2025-03-24
 */

/**
 * Clase base que representa una figura.
 * 
 * @class
 */
export class Figura {
    /**
     * Crea una instancia de `Figura`.
     * 
     * @param {string} idFigura - El identificador único de la figura.
     * @param {string} urlFigura - La URL que apunta a la imagen de la figura.
     */
    constructor(idFigura, urlFigura) {
        this.idFigura = idFigura;
        this.urlFigura = urlFigura;
    }
}
