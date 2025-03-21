import { actualizarMedia, mostrarMejoresTiempos, Jugador } from './Jugador.js';
import { initDragAndDrop } from './drag.js';
import { mostrarModal, iniciarTest, timeRemainingTest } from './modal.js';
import { indexedDbManager, operaciones } from './indexedDbManager.js';
import { Test } from "./test.js";
import { Figura } from "./figura.js";
import { figuraAlianza } from "./figuraAlianza.js";
import { figuraWow } from "./figuraWow.js";
import { figuraHots } from "./figuraHots.js";
import { figuraOverwatch } from "./figuraOverwatch.js";

document.addEventListener('DOMContentLoaded', () => {

    const createDefaultTests = () => {
        return [
            new Test([
                new figuraOverwatch(1, "./assets/images/ow.svg", "OverWatch"),
                new figuraHots(2, "./assets/images/hots.png", "Hots"),
                new figuraWow(3, "./assets/images/wow.png", "Wow"),
                new figuraHeartsone(4, "./assets/images/heartstone.png", "Heartstone")
            ], 1),
            new Test([
                new figuraOverwatch(5, "./assets/images/ow.svg", "OverWatch"),
                new figuraHots(6, "./assets/images/hots.png", "Hots"),
                new figuraWow(7, "./assets/images/wow.png", "Wow"),
                new figuraHeartsone(8, "./assets/images/heartstone.png", "Heartstone")
            ], 2),
            new Test([
                new figuraOverwatch(9, "./assets/images/ow.svg", "OverWatch"),
                new figuraHots(10, "./assets/images/hots.png", "Hots"),
                new figuraWow(11, "./assets/images/wow.png", "Wow"),
                new figuraHeartsone(12, "./assets/images/heartstone.png", "Heartstone")
            ], 3),
            new Test([
                new figuraOverwatch(13, "./assets/images/ow.svg", "OverWatch"),
                new figuraHots(14, "./assets/images/hots.png", "Hots"),
                new figuraWow(15, "./assets/images/wow.png", "Wow"),
                new figuraHeartsone(16, "./assets/images/heartstone.png", "Heartstone")
            ], 4)
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
                const randomTests = getRandomTests(tests);
                return randomTests;
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
            // Aquí puedes trabajar con el Set de tests
            console.log(randomTests);
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
    
    let countdown;
    let startTime = Date.now();
    let arrowTime = true;

    initDragAndDrop();

    acceptButton.addEventListener('click', () => {
        iniciarTest();
        countdown = timeRemainingTest();
    });

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

    let tiempoFinal;
    if (numberTest) {
        let testCounter = 1;
        numberTest.innerHTML = `${testCounter}/3`;

        if (nextTest) {
            nextTest.addEventListener('click', async () => {
                if (testCounter < 3) {
                    testCounter++;
                    numberTest.innerHTML = `${testCounter}/3`;
                    nextTest.innerHTML = testCounter === 3 ? 'Finalizar' : 'Siguiente';

                    // Aquí cargamos el siguiente test dinámicamente en el contenedor containerDrag
                    const testContainer = document.querySelector('.containerDrag');
                    const randomTest = Array.from(randomTests)[testCounter - 1];
                    
                    // Limpiamos las figuras del contenedor para la siguiente ronda
                    for (let i = 1; i <= 4; i++) {
                        const figureDiv = testContainer.querySelector(`.figure${i}`);
                        if (figureDiv) {
                            figureDiv.innerHTML = ''; // Limpiar cualquier contenido previo
                        }
                    }

                    // Añadir las opciones al contenedor según el test
                    randomTest.figuras.forEach((figura, index) => {
                        const figureDiv = testContainer.querySelector(`.figure${index + 1}`);
                        const img = document.createElement('img');
                        img.src = figura.url;
                        img.style.width = '100%'; // Ajustar al tamaño del contenedor
                        figureDiv.appendChild(img);
                    });
                } else {
                    numberTest.innerHTML = "3/3";
                    nextTest.innerHTML = 'Finalizar';
                    tiempoFinal = Date.now();

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

    // Funciones para manejar el almacenamiento y el flujo de los jugadores
    // ... (el resto del código sigue igual)

    console.log('Successfully Connected to main.js');
});
