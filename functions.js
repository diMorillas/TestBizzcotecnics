import { Jugador } from "./Jugador.js";


export function addPlayer(array) {
    let nombre = prompt('Nombre del jugador');
    let email = prompt('Email del jugador');
    let tiempo = prompt('Tiempo en hacer el test');
    let puntuacio = prompt('Puntuacion sobre 10');

    let newPlayer = new Jugador(nombre, email, parseInt(tiempo), parseInt(puntuacio));
    array.push(newPlayer);

    return array;
}
