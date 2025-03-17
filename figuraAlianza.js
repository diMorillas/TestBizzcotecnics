import { Figura } from "./figura.js";

export class figuraAlianza extends Figura {
    constructor(idFigura,urlFigura,tipoFigura){
        super(idFigura,urlFigura);
        this.tipoFigura = tipoFigura;
    }

}