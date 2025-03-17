import { Figura } from "./figura.js";

export class figuraOverwatch extends Figura {
    constructor(idFigura,urlFigura,tipoFigura){
        super(idFigura,urlFigura);
        this.tipoFigura = tipoFigura;
    }

}