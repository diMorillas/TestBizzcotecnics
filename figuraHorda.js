import { Figura } from "./figura.js";

export class figuraHorda extends Figura {
    constructor(idFigura,urlFigura,tipoFigura){
        super(idFigura,urlFigura);
        this.tipoFigura = tipoFigura;
    }

}