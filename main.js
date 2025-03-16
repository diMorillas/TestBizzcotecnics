import { Jugador } from './Jugador.js';
import { initDragAndDrop } from './drag.js';
import { mostrarModal, iniciarTest, timeRemainingTest } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    let acceptButton = document.getElementById('acceptButton');
    let pageTest = document.getElementById('pageTest');
    let pageForm = document.getElementById('pageForm');
    let pageFinal = document.getElementById('pageFinal');
    let btnForm = document.getElementById('submitForm');
    let playerList = document.getElementById('playerList');
    let numberTest = document.getElementById('testCounter');
    let nextTest = document.getElementById('btnNext');
    let startAgain = document.getElementById('newTest');
    let signTime = document.getElementById('signTime');
    let timer = document.getElementById('timer');
    let music = document.getElementById('bg-music');
    let timeRemaining = 9999;
    let countdown;
    let startTime = Date.now(); // Guardamos el tiempo de inicio
    let arrowTime = true;

    initDragAndDrop();

    // Al hacer clic en el botón de aceptación, iniciamos el test
    acceptButton.addEventListener('click', () => {
        iniciarTest();  // Ocultamos el modal y mostramos la página de test
        timeRemainingTest();  // Iniciamos el temporizador después de iniciar el test
    });

    mostrarModal();  // Muestra el modal cuando se carga la página

    // Función para reproducir la música al hacer click en el cuerpo
    const playMusic = () => {
        if (music) {
            music.play().catch(error => console.error('Error al intentar reproducir la música:', error));
        }
    };
    document.body.addEventListener('click', playMusic);

    // Control del contador de tests
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

                    setTimeout(() => {
                        pageTest.style.display = 'none';
                        clearInterval(countdown);
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
        let nameForm = document.getElementById('nameForm').value.trim();
        let emailForm = document.getElementById('emailForm').value.trim();

        let nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegex.test(nameForm)) {
            alert("El nombre solo puede contener letras y no puede estar vacío.");
            return;
        }
        if (!emailRegex.test(emailForm)) {
            alert("Introduce un email válido con '@'.");
            return;
        }

        let jugadores = getJugadores();
        let idJugador = jugadores.length > 0 ? jugadores[jugadores.length - 1].id + 1 : 1;
        let tiempoTest = Math.floor((Date.now() - startTime) / 1000); // Calcular el tiempo transcurrido en segundos

        let nuevoJugador = new Jugador(idJugador, nameForm, emailForm, tiempoTest); // Pasamos 'time' como argumento

        jugadores.push(nuevoJugador);
        guardarJugadores(jugadores);

        console.log("Jugador añadido:", nuevoJugador);
        console.log("Jugadores actuales:", jugadores);

        // Actualizamos la lista de jugadores en la interfaz
        actualizarListaJugadores();

        pageForm.style.display = 'none';
        pageFinal.style.display = 'block';
    });

    // Función para actualizar la lista de jugadores en el DOM
    function actualizarListaJugadores() {
        playerList.innerHTML = '';

        let jugadores = getJugadores();

        // Orden por tiempo
        if (arrowTime) {
            jugadores.sort((a, b) => a.time - b.time); // Orden ascendente por tiempo
        } else {
            jugadores.sort((a, b) => b.time - a.time); // Orden descendente por tiempo
        }

        jugadores.forEach(jugador => {
            let li = document.createElement('li');
            li.textContent = `${jugador.nombre.toUpperCase()}       ${jugador.time} SEGUNDOS`;
            playerList.appendChild(li);
        });
    }

    // Orden por tiempo
    signTime.addEventListener('click', () => {
        arrowTime = !arrowTime;
        signTime.innerHTML = arrowTime ? '▲' : '▼';
        actualizarListaJugadores();
    });

    actualizarListaJugadores();

    // Volver al test
    startAgain.addEventListener('click', () => {
        location.reload();
    });

    console.log('Succesfully Connected to main.js');
});
