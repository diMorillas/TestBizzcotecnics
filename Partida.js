import { Jugador } from './Jugador.js';

export class Partida {
    constructor(idPartida) {
        this.idPartida = idPartida;
        this.jugadoresPartida = new Map(); 
        this.testsPartida = null; 
    }

    agregarJugador(jugador) {
        if (!(jugador instanceof Jugador)) {
            throw new Error("Solo se pueden agregar instancias de Jugador");
        }
        this.jugadoresPartida.set(jugador.email, jugador); 
    }

    obtenerJugador(email) {
        return this.jugadoresPartida.get(email);
    }

    eliminarJugador(email) {
        this.jugadoresPartida.delete(email);
    }
}
