import { Jugador } from './Jugador.js';
//import { ordenarJugadoresPorNombre } from './ordenarJugadores.js';
import { initDragAndDrop } from './drag.js';




document.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
    let pageTest = document.getElementById('pageTest');
    let pageForm = document.getElementById('pageForm');
    let pageFinal = document.getElementById('pageFinal');
    let btnForm = document.getElementById('submitForm');
    let playerList = document.getElementById('playerList'); // Obtener el elemento UL donde se mostrarán los jugadores

    console.log('Succesfully Connected to main.js')

    let music = document.getElementById('bg-musicc');
    const playMusic = () => {
        if (music) {
            music.play().catch(error => console.error('Error al intentar reproducir la música:', error));
        }
    };
    document.body.addEventListener('click', playMusic);

    let timeRemaining = 9999;
    let countdown;
    let startTime = Date.now(); // Guardamos el tiempo de inicio

    const timeRemainingTest = () => {
        let timer = document.getElementById('timer');
        if (!timer) {
            console.error('Elemento de timer no encontrado');
            return;
        }

        countdown = setInterval(() => {
            timeRemaining--;
            console.log(timeRemaining);

            timer.textContent = timeRemaining;

            if (timeRemaining <= 15) {
                timer.style.color = 'red';
                document.body.classList.add('timeout');
            } else {
                timer.style.color = 'white';
                document.body.classList.remove('timeout');
            }

            if (timeRemaining <= 0) {
                clearInterval(countdown);
                console.log('Cuenta regresiva terminada por límite de tiempo');
            }
        }, 1000);
    }
    timeRemainingTest();

    let numberTest = document.getElementById('testCounter');
    if (numberTest) {
        let testCounter = 1;
        numberTest.innerHTML = `${testCounter}/3`;

        let nextTest = document.getElementById('btnNext');
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

    function getJugadores() {
        return JSON.parse(localStorage.getItem("jugadores")) || [];
    }

    function guardarJugadores(jugadores) {
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
    }

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
        // Limpiar la lista actual
        playerList.innerHTML = '';

        // Obtener los jugadores almacenados
        let jugadores = getJugadores();

        // Ordenar jugadores por nombre
        jugadores.sort((a, b) => a.nombre.localeCompare(b.nombre));

        // Recorrer los jugadores y crear un <li> para cada uno
        jugadores.forEach(jugador => {
            let li = document.createElement('li');
            li.textContent = `${jugador.nombre}   |    ${jugador.time} segundos`;
            playerList.appendChild(li);
        });
    }

    actualizarListaJugadores();

    // Volver al test
    let startAgain = document.getElementById('newTest');
    startAgain.addEventListener('click', () => {
        location.reload();
    });

});
