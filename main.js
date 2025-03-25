/**
 * @file main.js
 * @date 24 marzo 2025
 * @author 
 *   - Didac Morillas
 *   - Pau Morillas
 * @version 1.0.5
 * @description Módulo principal que inicializa el juego, maneja los eventos del DOM, la gestión de jugadores, tests y comunicación con IndexedDB.
 */

import { actualizarMedia, mostrarMejoresTiempos,Jugador } from './Jugador.js';
import { initDragAndDrop } from './drag.js';
import { addPlayer, removeLastElement, removeFirstElement } from './functions.js';
import { mostrarModal, iniciarTest, timeRemainingTest } from './modal.js';
import { indexedDbManager, operaciones } from './indexedDbManager.js';
import { Test } from "./test.js";
import { figuraHeartStone } from "./figuraHeartStone.js";
import { figuraWow } from "./figuraWow.js";
import { figuraHots } from "./figuraHots.js";
import { figuraOverwatch } from "./figuraOverwatch.js";

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const acceptButton = document.getElementById('acceptButton');
    const pageTest = document.getElementById('pageTest');
    const pageForm = document.getElementById('pageForm');
    const pageSettings = document.getElementById('pageSettings');
    const pageFinal = document.getElementById('pageFinal');
    const btnForm = document.getElementById('submitForm');
    const playerList = document.getElementById('playerList');
    const numberTest = document.getElementById('testCounter');
    const nextTest = document.getElementById('btnNext');
    const startAgain = document.getElementById('newTest');
    const signTime = document.getElementById('signTime');
    const music = document.getElementById('bg-music');
    const avgScore = document.getElementById('mediaPuntuacion');
    const puntosJugador = document.getElementById('puntosJugador');
    const datosDiv = document.getElementById("datosJugador");

    let countdown; // Variable para almacenar el intervalo del temporizador
    let startTime = Date.now(); // Guardamos el tiempo de inicio
    let arrowTime = true;

    /**
     * Map para almacenar las partidas finalizadas.
     * Cada partida se añade con un ID autoincremental.
     * @type {Map<number, Object>}
     */
    let partidas = new Map();

    initDragAndDrop();

    /**
     * Evento click sobre el botón de aceptación que inicia el test.
     * Inicia el test, oculta el modal y muestra la página de test.
     */
    acceptButton.addEventListener('click', () => {
        iniciarTest();  // Oculta el modal y muestra la página de test
        countdown = timeRemainingTest();  // Inicia el temporizador y almacena el ID del intervalo
    });

    // Mostrar el modal cuando se carga la página
    mostrarModal();

    /**
     * Función para reproducir la música de fondo.
     * Actualiza el estado en el LocalStorage para mantener la reproducción activa.
     */
    const playMusic = () => {
        if (music) {
            music.play().catch(error => console.error('Error al intentar reproducir la música:', error));
            localStorage.setItem('isMusicPlaying', 'true'); 
        }
    };

    // Reproducir música si estaba activa al recargar
    if (localStorage.getItem('isMusicPlaying') === 'true' && music) {
        music.play().catch(error => console.error('Error al intentar reproducir la música:', error));
    }

    // Activar música al hacer clic en cualquier parte del body
    document.body.addEventListener('click', playMusic);

    // Control del contador de tests
    let tiempoFinal;  // Almacena el tiempo final cuando termina el test
    if (numberTest) {
        let testCounter = 1;
        numberTest.innerHTML = `${testCounter}/5`;

        /**
         * Evento click en el botón "nextTest" que controla la navegación entre tests.
         * Incrementa el contador y al finalizar guarda los datos de la partida.
         */
        if (nextTest) {
            nextTest.addEventListener('click', () => {
                if (testCounter < 5) {
                    testCounter++;
                    numberTest.innerHTML = `${testCounter}/5`;
                    nextTest.innerHTML = testCounter === 5 ? 'Finalizar' : 'Siguiente';
                                    
                    loadRandomTest();
                } else {
                    // Finalización del test
                    numberTest.innerHTML = "5/5";
                    nextTest.innerHTML = 'Finalizar';
                    tiempoFinal = Date.now(); // Guardamos el tiempo exacto cuando se finaliza el test
                    
                    // Calcular el tiempo transcurrido en segundos
                    const tiempoTest = Math.floor((tiempoFinal - startTime) / 1000);
                    // Usar el tamaño actual del map + 1 como ID autoincremental
                    const partidaId = partidas.size + 1;
                    
                    /**
                     * Objeto con los datos de la partida.
                     * @typedef {Object} DatosPartida
                     * @property {number} tiempoInicio - Timestamp del inicio del test.
                     * @property {number} tiempoFinal - Timestamp al finalizar el test.
                     * @property {number} duracion - Duración del test en segundos.
                     * @property {number} score - Puntuación obtenida.
                     */
                    const datosPartida = {
                        tiempoInicio: startTime,
                        tiempoFinal: tiempoFinal,
                        duracion: tiempoTest,
                        score: parseInt(sessionStorage.getItem('score')) || 0,
                    };
                    
                    // Guardar la partida en el map
                    partidas.set(partidaId, datosPartida);
                    console.log("Partida guardada:", partidas.get(partidaId, datosPartida));
                    
                    setTimeout(() => {
                        document.body.classList.remove('timeout');        
                        pageTest.style.display = 'none';
                        clearInterval(countdown);  // Limpiar el temporizador
                        pageForm.style.display = 'block';
                    }, 500);
                }
            });
        }
    }
    
    /**
     * Recupera la lista de jugadores almacenada en LocalStorage.
     * @returns {Array<Object>} Array de jugadores o vacío si no hay datos.
     */
    function getJugadores() {
        try {
            const data = localStorage.getItem("jugadores");
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error al parsear jugadores desde LocalStorage:", error);
            localStorage.removeItem("jugadores"); // Elimina el dato corrupto
            return [];
        }
    }
    
    /**
     * Guarda el array de jugadores en LocalStorage.
     * @param {Array<Object>} jugadores - Array de jugadores a guardar.
     */
    function guardarJugadores(jugadores) {
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
    }

    let jugadores = getJugadores();

    /**
     * Evento click en el botón de envío del formulario.
     * Valida la entrada del usuario, crea un nuevo jugador, actualiza la lista y la puntuación.
     */
    btnForm.addEventListener('click', () => {
        const nameForm = document.getElementById('nameForm').value.trim();
        const emailForm = document.getElementById('emailForm').value.trim();
        // Regex para validar nombre y email
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegex.test(nameForm)) {
            alert("El nombre solo puede contener letras y no puede estar vacío.");
            return;
        }
        if (!emailRegex.test(emailForm)) {
            alert("Introduce un email válido con '@'.");
            return;
        }

        // Calcular el tiempo transcurrido en segundos
        const tiempoTest = Math.floor((tiempoFinal - startTime) / 1000);
        let currentScore = sessionStorage.getItem('score') || 0;

        const nuevoJugador = new Jugador(nameForm, emailForm, tiempoTest, parseInt(currentScore));

        jugadores.push(nuevoJugador);
        guardarJugadores(jugadores);
        sessionStorage.setItem('score', 0);
        
        // Calcular la media de las puntuaciones
        let puntuaciones = [];
        for (let i in jugadores) {
            puntuaciones.push(jugadores[i].puntuacio);
        }
        console.log(puntuaciones);

        let mediaTotal = puntuaciones.reduce((acc, current) => acc + current, 0) / jugadores.length;
        avgScore.innerHTML = mediaTotal.toFixed(2);

        let jugadorFinal = jugadores.length - 1;
        let puntuacionJugador;
        if (jugadores.length > 0) {
            puntuacionJugador = jugadores[jugadorFinal].puntuacio;
        }
        puntosJugador.innerHTML = puntuacionJugador;

        console.log("Jugadores actuales:", jugadores);

        actualizarListaJugadores(); // Refrescar la lista en el DOM
        actualizarMedia(jugadores); // Actualizar la media de tiempos
        mostrarMejoresTiempos(jugadores);

        pageForm.style.display = 'none';
        pageFinal.style.display = 'block';
    });

    /**
     * Actualiza la lista de jugadores mostrada en el DOM.
     * Ordena la lista de jugadores según el tiempo y actualiza la media.
     */
    function actualizarListaJugadores() {
        playerList.innerHTML = '';

        // Ordenar por tiempo de forma ascendente o descendente
        if (arrowTime) {
            jugadores.sort((a, b) => a.tiempo - b.tiempo);
        } else {
            jugadores.sort((a, b) => b.tiempo - a.tiempo);
        }

        jugadores.forEach(jugador => {
            const li = document.createElement('li');
            li.textContent = `${jugador.nombre} ${jugador.tiempo} segundos`;
            playerList.appendChild(li);
        });

        // Actualizar la media de tiempos
        actualizarMedia(jugadores);
    }

    // Calcular y mostrar la media de las puntuaciones actuales
    let puntuaciones = jugadores.map(jugador => jugador.puntuacio);
    let mediaTotal = puntuaciones.reduce((acc, current) => acc + current, 0) / jugadores.length;
    avgScore.innerHTML = mediaTotal.toFixed(2);

    let jugadorFinal = jugadores.length - 1;
    let puntuacionJugador;
    if (jugadores.length > 0) {
        puntuacionJugador = jugadores[jugadorFinal].puntuacio;
    }
    puntosJugador.innerHTML = puntuacionJugador;
    
    /**
     * Evento click en el botón "addNewPlayer" para añadir un jugador vía prompt.
     * Actualiza la lista y la media de tiempos.
     */
    let btnAddPlayer = document.getElementById('addNewPlayer');
    btnAddPlayer.addEventListener('click', () => {
        jugadores = addPlayer(jugadores); // Reasigna el array con el nuevo jugador
        guardarJugadores(jugadores); // Guarda en LocalStorage
        actualizarListaJugadores(); // Actualiza la lista en el DOM
        mostrarMejoresTiempos(jugadores);
        actualizarMedia(jugadores);
    });

    /**
     * Evento click en el botón "removeLastPlayer" para borrar el último jugador.
     */
    let btnRemoveLastPlayer = document.getElementById('removeLastPlayer');
    btnRemoveLastPlayer.addEventListener('click', () => {
        removeLastElement(jugadores);
        guardarJugadores(jugadores);
        actualizarListaJugadores();
        mostrarMejoresTiempos(jugadores);
    });
    
    /**
     * Evento click en el botón "removeFirstPlayer" para borrar el primer jugador.
     */
    let btnRemoveFirstPlayer = document.getElementById('removeFirstPlayer');
    btnRemoveFirstPlayer.addEventListener('click', () => {
        removeFirstElement(jugadores);
        guardarJugadores(jugadores);
        actualizarListaJugadores();
        mostrarMejoresTiempos(jugadores);
    });

    /**
     * Evento click en el botón "signTime" para cambiar el orden de los jugadores.
     * Alterna entre orden ascendente y descendente.
     */
    signTime.addEventListener('click', () => {
        arrowTime = !arrowTime;
        signTime.innerHTML = arrowTime ? '▲' : '▼';
        actualizarListaJugadores();
    });

    // Inicializar la media de tiempos y la lista de jugadores en el DOM
    actualizarMedia(getJugadores());
    actualizarListaJugadores();

    /**
     * Evento click en el botón "newTest" para reiniciar el test.
     */
    startAgain.addEventListener('click', () => {
        location.reload();
    });

    console.log('Successfully Connected to main.js');
    console.log("Partidas:");
    console.table([...partidas.entries()].map(([id, partida]) => ({ ID: id, ...partida })));

   /**
 * Método que extiende la funcionalidad de Test para crear tests por defecto. (25 tests por defecto)
 * @returns {Array<Test>} Array de tests predeterminados.
 */
   Test.prototype.createDefaultTests = function() {
    return [
        new Test([
            new figuraHeartStone(1, "./assets/images/hs.svg", "hs"),
            new figuraHots(2, "./assets/images/hots.png", "hots"),
            new figuraWow(3, "./assets/images/wow.svg", "Wow"),
            new figuraOverwatch(4, "./assets/images/ow.svg", "ow")
        ], 1, 1),
        new Test([
            new figuraHots(5, "./assets/images/hots.png", "hots"),
            new figuraOverwatch(6, "./assets/images/ow.svg", "ow"),
            new figuraHeartStone(7, "./assets/images/hs.svg", "hs"),
            new figuraWow(8, "./assets/images/wow.svg", "wow")
        ], 2, 1),
        new Test([
            new figuraHots(9, "./assets/images/hots.png", "hots"),
            new figuraHots(10, "./assets/images/hots.png", "hots"),
            new figuraWow(11, "./assets/images/wow.svg", "wow"),
            new figuraWow(12, "./assets/images/wow.svg", "wow")
        ], 3, 1),
        new Test([
            new figuraOverwatch(13, "./assets/images/ow.svg", "ow"),
            new figuraHots(14, "./assets/images/hots.png", "hots"),
            new figuraWow(15, "./assets/images/wow.svg", "wow"),
            new figuraHeartStone(16, "./assets/images/hs.svg", "hs")
        ], 4, 1),
        new Test([
            new figuraHeartStone(17, "./assets/images/hs.svg", "hs"),
            new figuraHeartStone(18, "./assets/images/hs.svg", "hs"),
            new figuraHeartStone(19, "./assets/images/hs.svg", "hs"),
            new figuraHeartStone(20, "./assets/images/hs.svg", "hs")
        ], 5, 1),
        new Test([
            new figuraWow(21, "./assets/images/wow.svg", "wow"),
            new figuraWow(22, "./assets/images/wow.svg", "wow"),
            new figuraHeartStone(23, "./assets/images/hs.svg", "hs"),
            new figuraHots(24, "./assets/images/hots.png", "hots")
        ], 6, 1),
        new Test([
            new figuraHots(25, "./assets/images/hots.png", "hots"),
            new figuraHots(26, "./assets/images/hots.png", "hots"),
            new figuraOverwatch(27, "./assets/images/ow.svg", "ow"),
            new figuraOverwatch(28, "./assets/images/ow.svg", "ow")
        ], 7, 1),
        new Test([
            new figuraWow(29, "./assets/images/wow.svg", "wow"),
            new figuraWow(30, "./assets/images/wow.svg", "wow"),
            new figuraWow(31, "./assets/images/wow.svg", "wow"),
            new figuraWow(32, "./assets/images/wow.svg", "wow")
        ], 8, 1),
        new Test([
            new figuraHeartStone(33, "./assets/images/hs.svg", "hs"),
            new figuraHeartStone(34, "./assets/images/hs.svg", "hs"),
            new figuraWow(35, "./assets/images/wow.svg", "wow"),
            new figuraOverwatch(36, "./assets/images/ow.svg", "ow")
        ], 9, 1),
        new Test([
            new figuraOverwatch(37, "./assets/images/ow.svg", "ow"),
            new figuraOverwatch(38, "./assets/images/ow.svg", "ow"),
            new figuraOverwatch(39, "./assets/images/ow.svg", "ow"),
            new figuraOverwatch(40, "./assets/images/ow.svg", "ow")
        ], 10, 1),
        
        // Tests nuevos (20)
        new Test([
            new figuraHeartStone(41, "./assets/images/hs.svg", "hs"),
            new figuraHots(42, "./assets/images/hots.png", "hots"),
            new figuraOverwatch(43, "./assets/images/ow.svg", "ow"),
            new figuraWow(44, "./assets/images/wow.svg", "wow")
        ], 11, 1),
        new Test([
            new figuraWow(45, "./assets/images/wow.svg", "wow"),
            new figuraHots(46, "./assets/images/hots.png", "hots"),
            new figuraHeartStone(47, "./assets/images/hs.svg", "hs"),
            new figuraOverwatch(48, "./assets/images/ow.svg", "ow")
        ], 12, 1),
        new Test([
            new figuraHeartStone(49, "./assets/images/hs.svg", "hs"),
            new figuraHots(50, "./assets/images/hots.png", "hots"),
            new figuraWow(51, "./assets/images/wow.svg", "wow"),
            new figuraOverwatch(52, "./assets/images/ow.svg", "ow")
        ], 13, 1),
        new Test([
            new figuraHots(53, "./assets/images/hots.png", "hots"),
            new figuraHeartStone(54, "./assets/images/hs.svg", "hs"),
            new figuraWow(55, "./assets/images/wow.svg", "wow"),
            new figuraOverwatch(56, "./assets/images/ow.svg", "ow")
        ], 14, 1),
        new Test([
            new figuraHeartStone(57, "./assets/images/hs.svg", "hs"),
            new figuraOverwatch(58, "./assets/images/ow.svg", "ow"),
            new figuraWow(59, "./assets/images/wow.svg", "wow"),
            new figuraHots(60, "./assets/images/hots.png", "hots")
        ], 15, 1),
        new Test([
            new figuraWow(61, "./assets/images/wow.svg", "wow"),
            new figuraHeartStone(62, "./assets/images/hs.svg", "hs"),
            new figuraOverwatch(63, "./assets/images/ow.svg", "ow"),
            new figuraHots(64, "./assets/images/hots.png", "hots")
        ], 16, 1),
        new Test([
            new figuraOverwatch(65, "./assets/images/ow.svg", "ow"),
            new figuraHeartStone(66, "./assets/images/hs.svg", "hs"),
            new figuraHots(67, "./assets/images/hots.png", "hots"),
            new figuraWow(68, "./assets/images/wow.svg", "wow")
        ], 17, 1),
        new Test([
            new figuraHots(69, "./assets/images/hots.png", "hots"),
            new figuraOverwatch(70, "./assets/images/ow.svg", "ow"),
            new figuraHeartStone(71, "./assets/images/hs.svg", "hs"),
            new figuraWow(72, "./assets/images/wow.svg", "wow")
        ], 18, 1),
        new Test([
            new figuraWow(73, "./assets/images/wow.svg", "wow"),
            new figuraHots(74, "./assets/images/hots.png", "hots"),
            new figuraHeartStone(75, "./assets/images/hs.svg", "hs"),
            new figuraOverwatch(76, "./assets/images/ow.svg", "ow")
        ], 19, 1),
        new Test([
            new figuraHeartStone(77, "./assets/images/hs.svg", "hs"),
            new figuraOverwatch(78, "./assets/images/ow.svg", "ow"),
            new figuraWow(79, "./assets/images/wow.svg", "wow"),
            new figuraHots(80, "./assets/images/hots.png", "hots")
        ], 20, 1),
        new Test([
            new figuraWow(81, "./assets/images/wow.svg", "wow"),
            new figuraHeartStone(82, "./assets/images/hs.svg", "hs"),
            new figuraHots(83, "./assets/images/hots.png", "hots"),
            new figuraOverwatch(84, "./assets/images/ow.svg", "ow")
        ], 21, 1),
        new Test([
            new figuraHots(85, "./assets/images/hots.png", "hots"),
            new figuraHeartStone(86, "./assets/images/hs.svg", "hs"),
            new figuraOverwatch(87, "./assets/images/ow.svg", "ow"),
            new figuraWow(88, "./assets/images/wow.svg", "wow")
        ], 22, 1),
        new Test([
            new figuraHeartStone(89, "./assets/images/hs.svg", "hs"),
            new figuraOverwatch(90, "./assets/images/ow.svg", "ow"),
            new figuraWow(91, "./assets/images/wow.svg", "wow"),
            new figuraHots(92, "./assets/images/hots.png", "hots")
        ], 23, 1),
        new Test([
            new figuraOverwatch(93, "./assets/images/ow.svg", "ow"),
            new figuraHeartStone(94, "./assets/images/hs.svg", "hs"),
            new figuraWow(95, "./assets/images/wow.svg", "wow"),
            new figuraHots(96, "./assets/images/hots.png", "hots")
        ], 24, 1),
        new Test([
            new figuraHots(97, "./assets/images/hots.png", "hots"),
            new figuraHeartStone(98, "./assets/images/hs.svg", "hs"),
            new figuraOverwatch(99, "./assets/images/ow.svg", "ow"),
            new figuraWow(100, "./assets/images/wow.svg", "wow")
        ], 25, 1)
    ];
};


/**
 * Selecciona de forma aleatoria 4 tests de un array de tests sin repeticiones.
 * @param {Array<Test>} tests - Array de tests disponibles.
 * @returns {Array<Test>} Conjunto de tests aleatorios.
 */
const getRandomTests = (tests) => {
    const randomIndexes = [];
    while (randomIndexes.length < 6) {
        const randomIndex = Math.floor(Math.random() * tests.length);
        if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
        }
    }
    return new Set(randomIndexes.map(index => tests[index]));
};


/**
 * Función asíncrona para obtener tests desde IndexedDB.
 * Si no hay tests almacenados, crea tests por defecto.
 * @async
 * @returns {Promise<Set<Test>|null>} Conjunto de tests aleatorios o null en caso de error.
 */
const hasTest = async () => {
    try {
        const tests = await indexedDbManager("getAllTests");
        if (tests && tests.length > 0) {
            return getRandomTests(tests);
        } else {
            const newTests = new Test().createDefaultTests();
            for (let test of newTests) {
                await indexedDbManager("addTest", test);
            }
            const updatedTests = await indexedDbManager("getAllTests");
            return getRandomTests(updatedTests);
        }
    } catch (error) {
        console.error("Error obteniendo los tests:", error);
        return null;
    }
};

// Variable global para almacenar el Set de tests aleatorios
let randomTestsGlobal = null;

/**
 * Carga un test aleatorio en el DOM a partir del conjunto global de tests.
 * Actualiza las imágenes de las figuras y almacena la respuesta correcta.
 */
function loadRandomTest() {
    if (!randomTestsGlobal) {
        console.error("No hay tests cargados");
        return;
    }

    const testArray = Array.from(randomTestsGlobal);
    if (testArray.length === 0) {
        console.error("No hay tests disponibles.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * testArray.length);
    const selectedTest = testArray[randomIndex];
    console.log(`test seleccionado: ${randomIndex}`);

    if (!selectedTest || !selectedTest.figuras || selectedTest.figuras.length < 4) {
        console.error("El test seleccionado no tiene suficientes figuras.");
        return;
    }

    // Limpiar el contenedor (por ejemplo, el contenedor de la cuarta figura)
    const figureFour = document.querySelector('.figureFour');
    if (figureFour) figureFour.innerHTML = "";

    // Seleccionar los elementos del DOM para las figuras
    const figureOne = document.querySelector('.figureOne img') || document.createElement("img");
    const figureTwo = document.querySelector('.figureTwo img') || document.createElement("img");
    const figureThree = document.querySelector('.figureThree img') || document.createElement("img");

    // Asignar las imágenes a los contenedores correspondientes
    figureOne.src = selectedTest.figuras[0].urlFigura;
    figureTwo.src = selectedTest.figuras[1].urlFigura;
    figureThree.src = selectedTest.figuras[2].urlFigura;

    // Si los elementos img no estaban en el DOM, se agregan a sus contenedores
    document.querySelector('.figureOne')?.appendChild(figureOne);
    document.querySelector('.figureTwo')?.appendChild(figureTwo);
    document.querySelector('.figureThree')?.appendChild(figureThree);

    // Almacenar globalmente la respuesta correcta (tipo de la figura faltante)
    window.correctOption = selectedTest.figuras[3].tipoFigura;
}

// Inicializar tests y cargar el primer test
hasTest().then(rt => {
    if (rt) {
        randomTestsGlobal = rt;
        loadRandomTest();
    }
});


});
