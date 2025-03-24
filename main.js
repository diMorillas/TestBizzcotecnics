import { actualizarMedia, mostrarMejoresTiempos, Jugador } from './Jugador.js';
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

    let countdown; // Variable para almacenar el intervalo del temporizador
    let startTime = Date.now(); // Guardamos el tiempo de inicio
    let arrowTime = true;

    // Map para almacenar las partidas finalizadas
    let partidas = new Map(); // Cada vez que finaliza una partida con el botón "finalizar", se añade con un ID autoincremental.

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
                                    
                    loadRandomTest();
                } else {
                    // Finalización del test
                    numberTest.innerHTML = "3/3";
                    nextTest.innerHTML = 'Finalizar';
                    tiempoFinal = Date.now(); // Guardamos el tiempo exacto cuando se finaliza el test
                    
                    // Calcular el tiempo transcurrido en segundos
                    const tiempoTest = Math.floor((tiempoFinal - startTime) / 1000);
                    // Usar el tamaño actual del map + 1 como ID autoincremental
                    const partidaId = partidas.size + 1;
                    
                    // Crear un objeto con los datos de la partida
                    const datosPartida = {
                        tiempoInicio: startTime,
                        tiempoFinal: tiempoFinal,
                        duracion: tiempoTest,
                        score: parseInt(sessionStorage.getItem('score')) || 0,
                        // Puedes agregar más propiedades si es necesario (por ejemplo, jugador, test completados, etc.)
                    };
                    
                    // Guardar la partida en el map
                    partidas.set(partidaId, datosPartida);
                    console.log("Partida guardada:", partidas.get(partidaId,datosPartida));
                    
                    setTimeout(() => {
                        document.body.classList.remove('timeout');        
                        pageTest.style.display = 'none';
                        clearInterval(countdown);  // Limpiar el temporizador
                        //console.log('Cuenta regresiva terminada de manera satisfactoria');
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
        //console.log("Jugadores guardados en LocalStorage:", jugadores);
    }

    // Guardar el nuevo jugador y actualizar la lista
    let jugadores = getJugadores();
    btnForm.addEventListener('click', () => {
        const nameForm = document.getElementById('nameForm').value.trim();
        const emailForm = document.getElementById('emailForm').value.trim();
        // Regex 
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
        
        // Crear un array de puntuaciones
        // let puntuaciones = jugadores.map(jugador => jugador.puntuacio);

        let puntuaciones = [];
        for (let i in jugadores) {
            puntuaciones.push(jugadores[i].puntuacio);
        }
        console.log(puntuaciones);


        // Calcular la media de las puntuaciones
        let mediaTotal = puntuaciones.reduce((acc, current) => acc + current, 0) / jugadores.length;
        avgScore.innerHTML = mediaTotal.toFixed(2);

        let jugadorFinal = jugadores.length - 1;
        let puntuacionJugador;
        if (jugadores.length > 0) {
            puntuacionJugador = jugadores[jugadorFinal].puntuacio;
        }
        puntosJugador.innerHTML = puntuacionJugador;

        //console.log("Jugador añadido:", nuevoJugador);
        console.log("Jugadores actuales:", jugadores);

        actualizarListaJugadores(); // Refrescar la lista
        actualizarMedia(jugadores); // Actualizar la media de tiempos después de añadir un jugador
        mostrarMejoresTiempos(jugadores);

        pageForm.style.display = 'none';
        pageFinal.style.display = 'block';
    });

    // Función para actualizar la lista de jugadores en el DOM
    function actualizarListaJugadores() {
        playerList.innerHTML = '';

        // Orden por tiempo
        if (arrowTime) {
            jugadores.sort((a, b) => a.tiempo - b.tiempo); // Orden ascendente por tiempo
        } else {
            jugadores.sort((a, b) => b.tiempo - a.tiempo); // Orden descendente por tiempo
        }

        jugadores.forEach(jugador => {
            const li = document.createElement('li');
            li.textContent = `${jugador.nombre} ${jugador.tiempo} segundos`;
            playerList.appendChild(li);
        });

        // Actualizar la media de tiempos
        actualizarMedia(jugadores);
    }

    // Crear un array de puntuaciones
    let puntuaciones = jugadores.map(jugador => jugador.puntuacio);

    // Calcular la media de las puntuaciones
    let mediaTotal = puntuaciones.reduce((acc, current) => acc + current, 0) / jugadores.length;
    avgScore.innerHTML = mediaTotal.toFixed(2);

    let jugadorFinal = jugadores.length - 1;
    let puntuacionJugador;
    if (jugadores.length > 0) {
        puntuacionJugador = jugadores[jugadorFinal].puntuacio;
    }
    puntosJugador.innerHTML = puntuacionJugador;
    
    // Añadir nuevo jugador vía Prompts
    let btnAddPlayer = document.getElementById('addNewPlayer');
    btnAddPlayer.addEventListener('click', () => {
        jugadores = addPlayer(jugadores); // Reasignamos el array con el nuevo jugador
        guardarJugadores(jugadores); // Guardamos en LocalStorage
        actualizarListaJugadores(); // Actualizamos la lista en el DOM
        mostrarMejoresTiempos(jugadores);
    });

    // Borrar el último elemento por índice
    let btnRemoveLastPlayer = document.getElementById('removeLastPlayer');
    btnRemoveLastPlayer.addEventListener('click', () => {
        removeLastElement(jugadores);
        guardarJugadores(jugadores);
        actualizarListaJugadores();
        mostrarMejoresTiempos(jugadores);
    });
    
    let btnRemoveFirstPlayer = document.getElementById('removeFirstPlayer');
    btnRemoveFirstPlayer.addEventListener('click', () => {
        removeFirstElement(jugadores);
        guardarJugadores(jugadores);
        actualizarListaJugadores();
        mostrarMejoresTiempos(jugadores);
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
    // Mostrar el Map de partidas en formato tabla
    console.log("Partidas:");
    console.table([...partidas.entries()].map(([id, partida]) => ({ ID: id, ...partida })));



    // const createDefaultTests = () => {
    //     return [
    //         new Test([
    //             new figuraHeartStone(1, "./assets/images/hs.svg", "hs"),
    //             new figuraHots(2, "./assets/images/hots.png", "hots"),
    //             new figuraWow(3, "./assets/images/wow.svg", "Wow"),
    //             new figuraOverwatch(4, "./assets/images/ow.svg", "ow")

    //         ], 1,1),
    //         new Test([
    //             new figuraHots(5, "./assets/images/hots.png", "hots"),
    //             new figuraOverwatch(6, "./assets/images/ow.svg", "ow"),
    //             new figuraHeartStone(7, "./assets/images/hs.svg", "hs"),
    //             new figuraWow(8, "./assets/images/wow.svg", "wow")

    //         ], 2,1),
    //         new Test([
    //             new figuraHots(9, "./assets/images/hots.png", "hots"),
    //             new figuraHots(10, "./assets/images/hots.png", "hots"),
    //             new figuraWow(11, "./assets/images/wow.svg", "wow"),
    //             new figuraWow(12, "./assets/images/wow.svg", "wow")
    //         ], 3,1),
    //         new Test([
    //             new figuraOverwatch(13, "./assets/images/ow.svg", "ow"),
    //             new figuraHots(14, "./assets/images/hots.png", "hots"),
    //             new figuraWow(15, "./assets/images/wow.svg", "wow"),
    //             new figuraHeartStone(16, "./assets/images/hs.svg", "hs")
    //         ], 4,1)
    //     ];
    // };
    
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
            ], 4, 1)
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
                // const newTests = createDefaultTests();
                const newTests = new Test().createDefaultTests();
                for (let test of newTests) {
                    await indexedDbManager("addTest", test);
                }
                // Recuperar los tests después de añadirlos
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
    
    // Función para cargar un test aleatorio
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
    
        if (!selectedTest || !selectedTest.figuras || selectedTest.figuras.length < 4) {
            console.error("El test seleccionado no tiene suficientes figuras.");
            return;
        }
    
        // Limpiar el contenedor (por ejemplo, el cuarto contenedor)
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
    
        // Si los elementos img no estaban en el DOM, agrégales al contenedor
        document.querySelector('.figureOne')?.appendChild(figureOne);
        document.querySelector('.figureTwo')?.appendChild(figureTwo);
        document.querySelector('.figureThree')?.appendChild(figureThree);
    
        // Almacenar globalmente la respuesta correcta (el tipo de la figura faltante)
        window.correctOption = selectedTest.figuras[3].tipoFigura;
        //console.log("Respuesta correcta:", window.correctOption);
    }
    
    // Inicializamos los tests y guardamos el Set globalmente
    hasTest().then(rt => {
        if (rt) {
            randomTestsGlobal = rt;
            loadRandomTest(); // Cargar el primer test
        }
    });


    //Prototype Figura
});
