import { Figura } from "./figura.js";

export class figuraHearStone extends Figura {
    constructor(idFigura,urlFigura,tipoFigura){
        super(idFigura,urlFigura);
        this.tipoFigura = tipoFigura;
    }

}

