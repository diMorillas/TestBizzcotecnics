import { Jugador } from './Jugador.js';

export class Partida {
    constructor(idPartida, puntuacioPartida) {
        this.idPartida = idPartida;
        this.puntuacioPartida = puntuacioPartida;
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
