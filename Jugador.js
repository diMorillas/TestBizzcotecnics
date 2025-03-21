export class Persona {
    constructor(nombre, email) {
        if (new.target === Persona) {
            throw new Error("No se puede instanciar una clase abstracta");
        }
        this.nombre = nombre;
        this.email = email;
    }

    crearJugador(tiempo, puntuacio) {
        throw new Error("Método abstracto 'crearJugador' debe ser implementado");
    }
}

export class Jugador extends Persona {
    constructor(nombre, email, tiempo, puntuacio) {
        super(nombre, email);
        this.tiempo = tiempo;
        this.puntuacio = puntuacio;
    }

    crearJugador(tiempo, puntuacio) {
        return new Jugador(this.nombre, this.email, tiempo, puntuacio);
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
    if (!jugadores || jugadores.size === 0) { // Cambiar .length por .size
        document.getElementById("media").textContent = "N/A";
        return;
    }

    const tiempos = Array.from(jugadores.values()).map(jugador => jugador.tiempo);
    const mediaTiempo = media(tiempos);
    document.getElementById("media").textContent = mediaTiempo.toFixed(0) + " segundos";
}

// Función para filtrar los jugadores con mejor puntuación (menor a 10 segundos)
export function mostrarMejoresTiempos(jugadores) {
    const mejoresJugadores = Array.from(jugadores.values()).filter(jugador => jugador.tiempo < 10);

    const playerBestTimes = document.getElementById('playerBestTimes');
    playerBestTimes.innerHTML = mejoresJugadores.length === 0
        ? "No hay jugadores con tiempos menores a 10 segundos"
        : mejoresJugadores.map(jugador => `<li>${jugador.nombre} - ${jugador.tiempo} segundos</li>`).join('');
}