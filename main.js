// main.js

import { actualizarMedia, mostrarMejoresTiempos, Jugador } from './Jugador.js';
import { initDragAndDrop } from './drag.js';
import { mostrarModal, iniciarTest, timeRemainingTest } from './modal.js';
import { indexedDbManager } from './indexedDbManager.js';
import { Test } from "./test.js";
import { Figura } from "./figura.js";
import { figuraAlianza } from "./figuraAlianza.js";
import { figuraHorda } from "./figuraHorda.js";
import { figuraHots } from "./figuraHots.js";
import { figuraOverwatch } from "./figuraOverwatch.js";


document.addEventListener('DOMContentLoaded', () => {

    const getRandomTests = (tests) => {
        const randomIndexes = [];
        while (randomIndexes.length < 4) {
            const randomIndex = Math.floor(Math.random() * tests.length);
            if (!randomIndexes.includes(randomIndex)) {
                randomIndexes.push(randomIndex);
            }
        }
        
        // Creamos un Set para asegurar que los tests sean únicos
        return new Set(randomIndexes.map(index => tests[index]));
    };
    
    /**
     * 
     * @returns un Set con los tests aleatorios
     */
    const hasTest = async () => {
        try {
            const tests = await indexedDbManager("getAllTests");
            
            // Comprobamos si hay tests
            if (tests && tests.length > 0) {
                // Aquí obtienes tests aleatorios en un Set
                const randomTests = getRandomTests(tests);
                console.log("Tests seleccionados para la partida:", randomTests);
                return randomTests;  // Regresamos un Set con los tests aleatorios seleccionados
            } else {
                console.log("No hay tests disponibles.");
                return null;  // Retornamos null si no hay tests
            }
        } catch (error) {
            console.error("Error obteniendo los tests:", error);
            return null;  // Retornamos null si hay un error en la operación
        }
    };
    
    // Ejemplo de ejecución
    hasTest().then(randomTests => {
        if (randomTests) {
            // Aquí puedes trabajar con el Set de tests
            console.log([...randomTests]); // Convertir Set a Array para ver los valores
        }
    });
    


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
    const music = document.getElementById('bg-musicc');
    const bestTimes = document.getElementById('playerBestTimes');
    
    let countdown; // Variable para almacenar el intervalo del temporizador
    let startTime = Date.now(); // Guardamos el tiempo de inicio
    let arrowTime = true;

    initDragAndDrop();

    // Al hacer clic en el botón de aceptación, iniciamos el test
    acceptButton.addEventListener('click', () => {
        iniciarTest();  // Oculta el modal y muestra la página de test
        countdown = timeRemainingTest();  // Inicia el temporizador y almacena el ID del intervalo
    });

    mostrarModal();  // Muestra el modal cuando se carga la página

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

    document.body.addEventListener('click', playMusic);

    // Control del contador de tests
    let tiempoFinal;  // Esta variable almacenará el tiempo final cuando termine el test
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
                    tiempoFinal = Date.now(); // Guardamos el tiempo exacto cuando se finaliza el test

                    setTimeout(() => {
                        pageTest.style.display = 'none';
                        clearInterval(countdown);  // Limpiar el temporizador
                        console.log('Cuenta regresiva terminada de manera satisfactoria');
                        pageForm.style.display = 'block';
                    }, 500);
                }
            });
        }
    }

    // Obtener jugadores del LocalStorage
    function getJugadores() {
        return JSON.parse(localStorage.getItem("jugadores")) || [];
    }

    // Guardar jugadores en el LocalStorage
    function guardarJugadores(jugadores) {
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
    }

    // Guardar el nuevo jugador y actualizar la lista
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

        const jugadores = getJugadores();
        const idJugador = jugadores.length > 0 ? jugadores[jugadores.length - 1].id + 1 : 1;

        // Calcular el tiempo transcurrido en segundos
        const tiempoTest = Math.floor((tiempoFinal - startTime) / 1000);  // Usamos el tiempo final al finalizar el test

        const nuevoJugador = new Jugador(idJugador, nameForm, emailForm, tiempoTest);

        jugadores.push(nuevoJugador);
        guardarJugadores(jugadores);

        console.log("Jugador añadido:", nuevoJugador);
        console.log("Jugadores actuales:", jugadores);

        actualizarListaJugadores(); // Refrescar la lista
        actualizarMedia(jugadores); // Actualizar la media de tiempos después de añadir un jugador
        mostrarMejoresTiempos(jugadores);

        pageForm.style.display = 'none';
        pageFinal.style.display = 'block';
    });

    // Función para actualizar la lista de jugadores en el DOM
    function actualizarListaJugadores() {
        const jugadores = getJugadores();
        playerList.innerHTML = '';

        // Orden por tiempo
        if (arrowTime) {
            jugadores.sort((a, b) => a.time - b.time); // Orden ascendente por tiempo
        } else {
            jugadores.sort((a, b) => b.time - a.time); // Orden descendente por tiempo
        }

        jugadores.forEach(jugador => {
            const li = document.createElement('li');
            li.textContent = `${jugador.nombre.toLowerCase()}       ${jugador.time} segundos`;
            playerList.appendChild(li);
        });

        // Actualizar la media de tiempos
        actualizarMedia(jugadores);
    }

    // Orden por tiempo
    signTime.addEventListener('click', () => {
        arrowTime = !arrowTime;
        signTime.innerHTML = arrowTime ? '▲' : '▼';
        actualizarListaJugadores();
    });

    //Media tiempo
    actualizarMedia(getJugadores());

    actualizarListaJugadores();

    // Volver al test
    startAgain.addEventListener('click', () => {
        location.reload();
    });

    console.log('Successfully Connected to main.js');
});
