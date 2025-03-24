// Clase Persona base
export class Persona {
    constructor(nombre, email) {
        if (new.target === Persona) {
            throw new Error("No se puede instanciar una clase abstracta");
        }
        this.nombre = nombre;
        this.email = email;
    }

    // Método polimórfico: devuelve detalles generales
    getDetalle() {
        return `Nombre: ${this.nombre}, Email: ${this.email}`;
    }
}

// Clase Jugador que extiende Persona
export class Jugador extends Persona {
    constructor(nombre, email, tiempo, puntuacion) {
        super(nombre, email);
        this.tiempo = tiempo;
        this.puntuacion = puntuacion;
    }

    // Sobrescribe el método getDetalle para dar más detalles sobre el jugador
    getDetalle() {
        return `${super.getDetalle()}, Tiempo: ${this.tiempo} segundos, Puntuación: ${this.puntuacion}`;
    }

    // Método estático para obtener los detalles de un jugador basado en el tiempo
    static getDetalle(tiempo, jugadores) {
        const jugadorEncontrado = jugadores.find(jugador => jugador.tiempo === tiempo);

        if (jugadorEncontrado) {
            return jugadorEncontrado.getDetalle(); // Llama al método getDetalle de la instancia de Jugador
        } else {
            return "No se encontró un jugador con ese tiempo.";
        }
    }

    getPuntuacion() {
        return this.puntuacion;
    }

    setPuntuacion(puntuacion) {
        this.puntuacion = puntuacion;
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
        document.getElementById("media").textContent = "N/A";
        return;
    }

    const tiempos = jugadores.map(jugador => jugador.tiempo);
    const mediaTiempo = media(tiempos);
    document.getElementById("media").textContent = mediaTiempo.toFixed(0) + " segundos";
}

// Función para filtrar los jugadores con mejor puntuación (menor a 10 segundos)
export function mostrarMejoresTiempos(jugadores) {
    const mejoresJugadores = jugadores.filter(jugador => jugador.tiempo < 10);

    const playerBestTimes = document.getElementById('playerBestTimes');
    playerBestTimes.innerHTML = mejoresJugadores.length === 0
        ? "No hay jugadores con tiempos menores a 10 segundos"
        : mejoresJugadores.map(jugador => `<li>${jugador.nombre} - ${jugador.tiempo} segundos</li>`).join('');
}

// Función que se ejecutará cuando el botón sea clickeado
export function mostrarDetallesPorTiempo(jugadores) {
    // Pedimos el tiempo al usuario mediante un prompt
    const tiempo = parseFloat(prompt("Introduce el tiempo del jugador que quieres ver:"));
    
    // Verificamos que el tiempo ingresado es un número
    if (!isNaN(tiempo)) {
        // Llamamos al método estático getDetalle de la clase Jugador
        const detalle = Jugador.getDetalle(tiempo, jugadores);
        
        // Mostramos los detalles en un alert (puedes usar console.log también)
        alert(detalle);
    } else {
        alert("Por favor, introduce un número válido.");
    }
}
