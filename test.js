export class Test {
    constructor(figuras, idTest, puntuacion) {
        if (new.target === Test) {
            throw new TypeError("No se puede instanciar la clase abstracta Test directamente");
        }
        this.figuras = figuras;
        this.idTest = idTest;
        this.puntuacion = puntuacion;
    }
}

