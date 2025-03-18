import { actualizarMedia, mostrarMejoresTiempos, Jugador } from './Jugador.js';
import { initDragAndDrop } from './drag.js';
import { addPlayer } from './functions.js';
import { mostrarModal, iniciarTest, timeRemainingTest } from './modal.js';

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
    const settings = document.getElementById('ajustes');

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
        try {
            const data = localStorage.getItem("jugadores");
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error al parsear jugadores desde LocalStorage:", error);
            localStorage.removeItem("jugadores"); // Elimina el dato corrupto
            return [];
        }
    }
    

    // Guardar jugadores en el LocalStorage
    function guardarJugadores(jugadores) {
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        console.log("Jugadores guardados en LocalStorage:", jugadores); // Log para verificar el almacenamiento
    }

    // Guardar el nuevo jugador y actualizar la lista
    let jugadores = getJugadores();
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


        // Calcular el tiempo transcurrido en segundos
        const tiempoTest = Math.floor((tiempoFinal - startTime) / 1000);  // Usamos el tiempo final al finalizar el test

        const nuevoJugador = new Jugador(nameForm, emailForm, tiempoTest, 0);

        jugadores.push(nuevoJugador);
        guardarJugadores(jugadores);

        console.log("Jugador añadido:", nuevoJugador); // Log para verificar el jugador añadido
        console.log("Jugadores actuales:", jugadores); // Log para verificar la lista de jugadores

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
            jugadores.sort((a, b) => a.tiempo - b.tiempo); // Orden ascendente por tiempo
        } else {
            jugadores.sort((a, b) => b.tiempo - a.tiempo); // Orden descendente por tiempo
        }

        console.log("Jugadores ordenados:", jugadores); // Log para verificar el orden de los jugadores

        jugadores.forEach(jugador => {
            const li = document.createElement('li');
            li.textContent = `${jugador.nombre}       ${jugador.tiempo} segundos`;
            playerList.appendChild(li);
        });

        // Actualizar la media de tiempos
        actualizarMedia(jugadores);
    }

    let btnAddPlayer = document.getElementById('addNewPlayer');
    btnAddPlayer.addEventListener('click', () => {
        jugadores = addPlayer(jugadores); // Reasignamos el array con el nuevo jugador
        guardarJugadores(jugadores); // Guardamos en LocalStorage
        actualizarListaJugadores(); // Actualizamos la lista en el DOM
    });
    

    // Orden por tiempo
    signTime.addEventListener('click', () => {
        arrowTime = !arrowTime;
        signTime.innerHTML = arrowTime ? '▲' : '▼';
        actualizarListaJugadores();
    });

    // Media tiempo
    actualizarMedia(getJugadores());

    actualizarListaJugadores();

    // Volver al test
    startAgain.addEventListener('click', () => {
        location.reload();
    });

    console.log('Successfully Connected to main.js');
});
