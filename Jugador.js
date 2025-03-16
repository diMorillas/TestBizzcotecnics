export class Jugador {
    constructor(id, nombre, email, time) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.time = time; 
    }
}

// Función para calcular la media del tiempo de todos los jugadores
export function media(array) {
    if (array.length === 0) return 0; // Evita división por 0
    let sum = array.reduce((acc, value) => acc + value, 0);
    return sum / array.length;
}

// Función para actualizar la media en el HTML
export function actualizarMedia(jugadores) {
    if (!jugadores || jugadores.length === 0) {
        document.getElementById("media").textContent = "N/A"; // Si no hay jugadores, mostrar N/A
        return;
    }
    
    const tiempos = jugadores.map(jugador => jugador.time); // Extraer tiempos
    const mediaTiempo = media(tiempos); // Calcular media
    document.getElementById("media").textContent = mediaTiempo.toFixed(2) + " segundos"; // Mostrar con 2 decimales
}
