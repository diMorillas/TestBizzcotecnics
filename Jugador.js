/**
 * @file Jugador.js
 * @date 24 marzo 2025
 * @author 
 *   - Didac Morillas
 *   - Pau Morillas
 * @version 1.0.5
 * @description Módulo que define la clase abstracta Persona, la clase Jugador y funciones auxiliares para gestionar jugadores, 
 * incluyendo el cálculo de la media de tiempos y puntuaciones, así como la visualización de los mejores tiempos.
 */

/**
 * Clase abstracta que representa a una persona.
 * No puede ser instanciada directamente.
 */
export class Persona {
    /**
     * Crea una instancia de Persona.
     * @param {string} nombre - El nombre de la persona.
     * @param {string} email - El correo electrónico de la persona.
     * @throws {Error} Si se intenta instanciar directamente la clase abstracta.
     */
    constructor(nombre, email) {
        if (new.target === Persona) {
            throw new Error("No se puede instanciar una clase abstracta");
        }
        this.nombre = nombre;
        this.email = email;
    }

    /**
     * Método abstracto para crear un jugador.
     * @param {number} tiempo - El tiempo asociado al jugador.
     * @param {number} puntuacio - La puntuación del jugador.
     * @throws {Error} Si no se implementa el método en una subclase.
     */
    crearJugador(tiempo, puntuacio) {
        throw new Error("Método abstracto 'crearJugador' debe ser implementado");
    }

    /**
     * Método abstracto para mostrar los datos de la persona.
     * @throws {Error} Si no se implementa en una subclase.
     */
    mostrarDatos() {
        throw new Error("Método abstracto 'mostrarDatos' debe ser implementado");
    }
}

/**
 * Clase que representa a un jugador, extendiendo de Persona.
 */
export class Jugador extends Persona {
    /**
     * Crea una instancia de Jugador.
     * @param {string} nombre - El nombre del jugador.
     * @param {string} email - El correo electrónico del jugador.
     * @param {number} tiempo - El tiempo registrado del jugador.
     * @param {number} puntuacio - La puntuación del jugador.
     */
    constructor(nombre, email, tiempo, puntuacio) {
        super(nombre, email);
        this.tiempo = tiempo;
        this.puntuacio = puntuacio;
    }

    /**
     * Crea y retorna un nuevo Jugador basado en la instancia actual.
     * @param {number} tiempo - El tiempo registrado del jugador.
     * @param {number} puntuacio - La puntuación del jugador.
     * @returns {Jugador} Una nueva instancia de Jugador.
     */
    crearJugador(tiempo, puntuacio) {
        return new Jugador(this.nombre, this.email, tiempo, puntuacio);
    }

    /**
     * Obtiene la puntuación del jugador.
     * @returns {number} La puntuación del jugador.
     */
    getPuntuacio() {
        return this.puntuacio;
    }

    /**
     * Establece la puntuación del jugador.
     * @param {number} puntuacio - La nueva puntuación.
     */
    setPuntuacio(puntuacio) {
        this.puntuacio = puntuacio;
    }

    /**
     * Implementación del método mostrarDatos.
     * Actualiza el contenido del elemento del DOM con id "datosJugador" para mostrar todos los datos del jugador.
     */
    mostrarDatos() {
        const datosDiv = document.getElementById("datosJugador");
        if (!datosDiv) {
            console.error("Elemento 'datosJugador' no encontrado en el DOM");
            return;
        }
        datosDiv.innerHTML = `
            <br>
            <p><strong>Jugador:</strong> ${this.nombre}</p>
            <p><strong>Email:</strong> ${this.email}</p>
            <p><strong>Tiempo:</strong> ${this.tiempo} segundos</p>
            <p><strong>Puntuación:</strong> ${this.puntuacio}</p>
        `;
    }
}

/**
 * Calcula la media de un array de números.
 * @param {Array<number>} array - Array de números.
 * @returns {number} La media calculada. Retorna 0 si el array está vacío.
 */
export function media(array) {
    if (array.length === 0) return 0; // Evita división por 0
    let sum = array.reduce((acc, value) => acc + value, 0);
    return sum / array.length;
}

/**
 * Actualiza la media de tiempos y puntuaciones en el HTML.
 * Obtiene los datos de los jugadores de un Map y actualiza los elementos con id "media" y "mediaPuntuacion".
 *
 * @param {Map<any, Jugador>} jugadores - Un Map de jugadores.
 */
export function actualizarMedia(jugadores) {
    if (!jugadores || jugadores.size === 0) {
        document.getElementById("media").textContent = "N/A";
        return;
    }

    const tiempos = Array.from(jugadores.values()).map(jugador => jugador.tiempo);
    const mediaTiempo = media(tiempos);
    document.getElementById("media").textContent = mediaTiempo.toFixed(0) + " segundos";

    const puntuaciones = Array.from(jugadores.values()).map(jugador => jugador.puntuacio);
    const mediaPuntuacion = media(puntuaciones);
    document.getElementById('mediaPuntuacion').textContent = mediaPuntuacion.toFixed(2);
}

/**
 * Muestra en el HTML una lista de jugadores con tiempos inferiores a 10 segundos.
 *
 * @param {Map<any, Jugador>} jugadores - Un Map de jugadores.
 */
export function mostrarMejoresTiempos(jugadores) {
    const mejoresJugadores = Array.from(jugadores.values()).filter(jugador => jugador.tiempo < 10);

    const playerBestTimes = document.getElementById('playerBestTimes');
    playerBestTimes.innerHTML = mejoresJugadores.length === 0
        ? "No hay jugadores con tiempos menores a 10 segundos"
        : mejoresJugadores.map(jugador => `<li>${jugador.nombre} - ${jugador.tiempo} segundos</li>`).join('');
}

/**
 * Inicializa un elemento en el DOM que permite ingresar el nombre y tiempo del jugador.
 * Al hacer clic en el botón, se solicitan los datos mediante prompts, se crea un jugador y se muestran sus datos.
 */
document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("mostrarDatos");
    
    if (boton) {
        boton.addEventListener("click", () => {
            const nombre = prompt("Introduce el nombre del jugador:");
            const email = prompt("Introduce el correo del jugador:");
            const tiempo = parseFloat(prompt("Introduce el tiempo del jugador en segundos:"));
            const puntuacio = parseInt(prompt("Introduce la puntuación del jugador:"), 10);

            if (nombre && email && !isNaN(tiempo) && !isNaN(puntuacio)) {
                const jugador = new Jugador(nombre, email, tiempo, puntuacio);
                jugador.mostrarDatos();
            } else {
                console.log("Error: Datos inválidos.");
            }
        });
    } else {
        console.error("No se encontró un botón con id 'mostrarDatos'");
    }
});
