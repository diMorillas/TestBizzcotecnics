import { Figura } from "./figura.js";

export class figuraWow extends Figura {
    constructor(idFigura,urlFigura,tipoFigura){
        super(idFigura,urlFigura);
        this.tipoFigura = tipoFigura;
    }

}