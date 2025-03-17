export class Persona {
    constructor(nombre, email) {
        if (new.target === Persona) {
            throw new Error("No se puede instanciar una clase abstracta");
        }
        this.nombre = nombre;
        this.email = email;
    }

    crearJugador(puntuacio) {
        throw new Error("Método abstracto 'crearJugador' debe ser implementado");
    }
}

export class Jugador extends Persona {
    constructor(nombre, email,tiempo,puntuacio) {
        super(nombre, email);
        this.tiempo = tiempo;
        this.puntuacio = puntuacio;
    }

    crearJugador(puntuacio) {
        return new Jugador(this.idPersona, this.nom, this.email, puntuacio);
    }

    getPuntuacio() {
        return this.puntuacio;
    }

    setPuntuacio(puntuacio) {
        this.puntuacio = puntuacio;
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
    
    const tiempos = jugadores.map(jugador => jugador.tiempo); 
    const mediaTiempo = media(tiempos); 
    document.getElementById("media").textContent = mediaTiempo.toFixed(0) + " segundos"; // Mostrar con 0 decimales
}

// Función para filtrar los jugadores con mejor puntuación (menor a 10 segundos)
export function mostrarMejoresTiempos(jugadores) {
    // Filtrar jugadores con puntuación menor a 10 segundos
    const mejoresJugadores = jugadores.filter(jugador => jugador.puntuacio < 10);

    // Obtener el elemento DOM donde mostrar los mejores tiempos
    const playerBestTimes = document.getElementById('playerBestTimes');

    // Si no hay jugadores con puntuación menor a 10 segundos, mostrar mensaje
    if (mejoresJugadores.length === 0) {
        playerBestTimes.textContent = "No hay jugadores con tiempos menores a 10 segundos";
        return;
    }

    // Limpiar la lista antes de mostrar los nuevos jugadores
    playerBestTimes.innerHTML = '';

    // Mostrar los mejores tiempos
    mejoresJugadores.forEach(jugador => {
        const li = document.createElement('li');
        li.textContent = `${jugador.nombre} - ${jugador.tiempo} segundos`;
        playerBestTimes.appendChild(li);
    });
}
