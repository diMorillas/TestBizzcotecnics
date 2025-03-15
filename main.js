import { Jugador } from './Jugador.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM básico
    let pageTest = document.getElementById('pageTest');
    let pageForm = document.getElementById('pageForm');
    let pageFinal = document.getElementById('pageFinal');
    let btnForm = document.getElementById('submitForm');

    // Testing conexión con archivo JavaScript
    console.log('Successfully Connected to JavaScript File');

    // Gestión de eventos en el body
    document.body.addEventListener('click', () => {
        playMusic();
    });

    // Gestión de música
    let music = document.getElementById('bg-musicc');
    const playMusic = () => {
        if (music) {
            music.play().catch(error => {
                console.error('Error al intentar reproducir la música:', error);
            });
        } else {
            console.error('Elemento de música no encontrado');
        }
    };

    // Cuenta regresiva
    let timeRemaining = 9999; // Segundos 
    let countdown; // Declarar countdown fuera de la función

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

    // Gestión de número de test
    let numberTest = document.getElementById('testCounter');
    if (numberTest) {
        let testCounter = 1;
        numberTest.innerHTML = `${testCounter}/3`;

        // Gestión Test Dinámico Botón
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
                        clearInterval(countdown); // Detener la cuenta regresiva
                        console.log('Cuenta regresiva terminada de manera satisfactoria');
                        pageForm.style.display = 'block';
                    }, 500);
                }
            });
        } else {
            console.error('Botón "nextTest" no encontrado');
        }
    } else {
        console.error('Elemento de número de test no encontrado');
    }

    // Funciones para almacenar y recuperar jugadores en LocalStorage
    function getJugadores() {
        return JSON.parse(localStorage.getItem("jugadores")) || [];
    }

    function guardarJugadores(jugadores) {
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
    }

    // Gestión de Botón en el Formulario
    btnForm.addEventListener('click', () => {
        let nameForm = document.getElementById('nameForm').value.trim();
        let emailForm = document.getElementById('emailForm').value.trim();

        let nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validar nombre
        if (!nameRegex.test(nameForm)) {
            alert("El nombre solo puede contener letras y no puede estar vacío.");
            return;
        }

        // Validar email
        if (!emailRegex.test(emailForm)) {
            alert("Introduce un email válido con '@'.");
            return;
        }

        // Obtener jugadores actuales
        let jugadores = getJugadores();

        // Generar ID autoincremental
        let idJugador = jugadores.length > 0 ? jugadores[jugadores.length - 1].id + 1 : 1;

        // Crear el nuevo jugador utilizando la clase Jugador
        let nuevoJugador = new Jugador(idJugador, nameForm, emailForm);

        // Añadir al array de jugadores
        jugadores.push(nuevoJugador);

        // Guardar en LocalStorage
        guardarJugadores(jugadores);

        // Log para verificar
        console.log("Jugador añadido:", nuevoJugador);
        console.log("Jugadores actuales:", jugadores);

        // Gestión de página final
        pageForm.style.display = 'none';
        pageFinal.style.display = 'block';
    });

    // Lista de jugadores
    let jugadores = getJugadores(); 

    // Ordenar jugadores por nombre (por ejemplo)
    jugadores.sort((a, b) => a.nombre.localeCompare(b.nombre));
    
    jugadores.forEach(element => {
        console.log('eyyy');
        console.log(element); 
    });

});
