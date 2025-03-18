import { Jugador } from "./Jugador.js";

export function addPlayer(array) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
    
    let nombre = prompt('Nombre del jugador');
    if (!nameRegex.test(nombre)) {
        alert("El nombre solo puede contener letras y no puede estar vacío, saliendo del sistema.");
        return;
    }

    let email = prompt('Email del jugador');
    
    if (!emailRegex.test(email)) {  // Corregido: Usar 'email' en la validación
        alert("Introduce un email válido con '@', saliendo del sistema.");
        return array;  // Devolver el array sin cambios
    }



    let tiempo = Number(prompt('Tiempo en hacer el test'));
    let puntuacio = Number(prompt('Puntuacion sobre 10'));

    let newPlayer = new Jugador(nombre, email, tiempo, puntuacio);
    array.push(newPlayer);

    return array;
}
