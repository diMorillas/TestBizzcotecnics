import { actualizarMedia, mostrarMejoresTiempos, mostrarDetallesPorTiempo, Jugador } from './Jugador.js';
import { initDragAndDrop } from './drag.js';
import { addPlayer, removeLastElement, removeFirstElement } from './functions.js';
import { mostrarModal, iniciarTest, timeRemainingTest } from './modal.js';
import { indexedDbManager, operaciones } from './indexedDbManager.js';
import { Test } from "./test.js";
import { Figura } from "./figura.js";
import { figuraHeartStone } from "./figuraHeartStone.js";
import { figuraWow } from "./figuraWow.js";
import { figuraHots } from "./figuraHots.js";
import { figuraOverwatch } from "./figuraOverwatch.js";

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const acceptButton = document.getElementById('acceptButton');
    const pageTest = document.getElementById('pageTest');
    const pageForm = document.getElementById('pageForm');
    const pageFinal = document.getElementById('pageFinal');
    const btnForm = document.getElementById('submitForm');
    const playerList = document.getElementById('playerList');
    const numberTest = document.getElementById('testCounter');
    const nextTest = document.getElementById('btnNext');
    const startAgain = document.getElementById('newTest');
    const signTime = document.getElementById('signTime');
    const music = document.getElementById('bg-music');

    let countdown;
    let startTime = Date.now();
    let arrowTime = true;
    let jugadores = getJugadores();

    initDragAndDrop();

    // Modal y música
    mostrarModal();
    const playMusic = () => {
        if (music) {
            music.play().catch(error => console.error('Error al intentar reproducir la música:', error));
            localStorage.setItem('isMusicPlaying', 'true');
        }
    };
    
    if (localStorage.getItem('isMusicPlaying') === 'true' && music) {
        music.play().catch(error => console.error('Error al intentar reproducir la música:', error));
    }

    document.body.addEventListener('click', playMusic);

    // Iniciar el test
    acceptButton.addEventListener('click', () => {
        iniciarTest();
        countdown = timeRemainingTest();
    });

    // Contador de tests
    let tiempoFinal;
    if (numberTest) {
        let testCounter = 1;
        numberTest.innerHTML = `${testCounter}/3`;

        if (nextTest) {
            nextTest.addEventListener('click', () => {
                if (testCounter < 3) {
                    testCounter++;
                    numberTest.innerHTML = `${testCounter}/3`;
                    nextTest.innerHTML = testCounter === 3 ? 'Finalizar' : 'Siguiente';
                } else {
                    numberTest.innerHTML = "3/3";
                    nextTest.innerHTML = 'Finalizar';
                    tiempoFinal = Date.now();

                    setTimeout(() => {
                        pageTest.style.display = 'none';
                        clearInterval(countdown);
                        pageForm.style.display = 'block';
                    }, 500);
                }
            });
        }
    }

    // Funciones para manejar jugadores
    function getJugadores() {
        try {
            const data = localStorage.getItem("jugadores");
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error al parsear jugadores desde LocalStorage:", error);
            localStorage.removeItem("jugadores");
            return [];
        }
    }

    function guardarJugadores(jugadores) {
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        console.log("Jugadores guardados en LocalStorage:", jugadores);
    }

    // Añadir nuevo jugador y actualizar la lista
    btnForm.addEventListener('click', () => {
        const nameForm = document.getElementById('nameForm').value.trim();
        const emailForm = document.getElementById('emailForm').value.trim();

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

        const tiempoTest = Math.floor((tiempoFinal - startTime) / 1000);

        const nuevoJugador = new Jugador(nameForm, emailForm, tiempoTest, 0);
        jugadores.push(nuevoJugador);
        guardarJugadores(jugadores);

        console.log("Jugador añadido:", nuevoJugador);
        console.log("Jugadores actuales:", jugadores);

        actualizarListaJugadores();
        actualizarMedia(jugadores);
        mostrarMejoresTiempos(jugadores);

        pageForm.style.display = 'none';
        pageFinal.style.display = 'block';
    });

    // Función para actualizar la lista de jugadores en el DOM
    function actualizarListaJugadores() {
        playerList.innerHTML = '';

        if (arrowTime) {
            jugadores.sort((a, b) => a.tiempo - b.tiempo);
        } else {
            jugadores.sort((a, b) => b.tiempo - a.tiempo);
        }

        jugadores.forEach(jugador => {
            const li = document.createElement('li');
            li.textContent = `${jugador.nombre} - ${jugador.tiempo} segundos`;
            playerList.appendChild(li);
        });

        actualizarMedia(jugadores);
    }

    // Añadir nuevo jugador por prompt
    let btnAddPlayer = document.getElementById('addNewPlayer');
    btnAddPlayer.addEventListener('click', () => {
        jugadores = addPlayer(jugadores);
        guardarJugadores(jugadores);
        actualizarListaJugadores();
        mostrarMejoresTiempos(jugadores);
    });

    // Eliminar el último jugador
    let btnRemoveLastPlayer = document.getElementById('removeLastPlayer');
    btnRemoveLastPlayer.addEventListener('click', () => {
        removeLastElement(jugadores);
        guardarJugadores(jugadores);
        actualizarListaJugadores();
        mostrarMejoresTiempos(jugadores);
    });

    // Eliminar el primer jugador
    let btnRemoveFirstPlayer = document.getElementById('removeFirstPlayer');
    btnRemoveFirstPlayer.addEventListener('click', () => {
        removeFirstElement(jugadores);
        guardarJugadores(jugadores);
        actualizarListaJugadores();
        mostrarMejoresTiempos(jugadores);
    });

    // Ordenar la lista por tiempo
    signTime.addEventListener('click', () => {
        arrowTime = !arrowTime;
        signTime.innerHTML = arrowTime ? '▲' : '▼';
        actualizarListaJugadores();
    });

    // Media de tiempos
    actualizarMedia(getJugadores());
    actualizarListaJugadores();

    // Reiniciar test
    startAgain.addEventListener('click', () => {
        location.reload();
    });

    // IndexedDB para obtener y crear tests
    const createDefaultTests = () => {
        return [
            new Test([new figuraOverwatch(1, "./assets/images/ow.svg", "OverWatch"),
                new figuraHots(2, "./assets/images/hots.png", "Hots"),
                new figuraWow(3, "./assets/images/wow.png", "Wow"),
                new figuraHeartStone(4, "./assets/images/heartstone.png", "Heartstone")], 1, 1),
            new Test([new figuraOverwatch(5, "./assets/images/ow.svg", "OverWatch"),
                new figuraHots(6, "./assets/images/hots.png", "Hots"),
                new figuraWow(7, "./assets/images/wow.png", "Wow"),
                new figuraHeartStone(8, "./assets/images/heartstone.png", "Heartstone")], 2, 1),
            new Test([new figuraOverwatch(9, "./assets/images/ow.svg", "OverWatch"),
                new figuraHots(10, "./assets/images/hots.png", "Hots"),
                new figuraWow(11, "./assets/images/wow.png", "Wow"),
                new figuraHeartStone(12, "./assets/images/heartstone.png", "Heartstone")], 3, 1),
            new Test([new figuraOverwatch(13, "./assets/images/ow.svg", "OverWatch"),
                new figuraHots(14, "./assets/images/hots.png", "Hots"),
                new figuraWow(15, "./assets/images/wow.png", "Wow"),
                new figuraHeartStone(16, "./assets/images/heartstone.png", "Heartstone")], 4, 1)
        ];
    };

    const getRandomTests = (tests) => {
        const randomIndexes = [];
        while (randomIndexes.length < 4) {
            const randomIndex = Math.floor(Math.random() * tests.length);
            if (!randomIndexes.includes(randomIndex)) {
                randomIndexes.push(randomIndex);
            }
        }
        return new Set(randomIndexes.map(index => tests[index]));
    };

    const hasTest = async () => {
        try {
            const tests = await indexedDbManager("getAllTests");
            if (tests && tests.length > 0) {
                return getRandomTests(tests);
            } else {
                const newTests = createDefaultTests();
                for (let test of newTests) {
                    await indexedDbManager("addTest", test);
                }
            }
        } catch (error) {
            console.error("Error obteniendo los tests:", error);
            return null;
        }
    };

    hasTest().then(randomTests => {
        if (randomTests) {
            console.log(randomTests);
        }
    });

    // Llamada al evento del botón para mostrar detalles por tiempo
    document.getElementById("playerData").addEventListener("click", () => {
        mostrarDetallesPorTiempo(jugadores); // Pasa la lista de jugadores
    });
});
