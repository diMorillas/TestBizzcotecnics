document.addEventListener('DOMContentLoaded', () => {

    // DOM básico
    let pageTest = document.getElementById('pageTest');

    // Testing conexión con archivo JavaScript
    console.log('Successfully Connected to JavaScript File');

    // Gestión de eventos en el body
    document.body.addEventListener('click', () => {
        playMusic();
    });

    // Gestión de música
    let music = document.getElementById('bg-music');
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
    let timeRemaining = 30;
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
                testCounter < 3 ? testCounter++ : console.error('Máximos test por jugador alcanzado');
                numberTest.innerHTML = `${testCounter}/3`;
                console.log("Número de test: " + testCounter);

                // Gestión de SPA (se evalúa cada vez que cambia el contador)
                if (testCounter == 3) {
                    numberTest.innerHTML = "3/3";
                    setInterval(()=>{
                        pageTest.style.display = 'none';
                        clearInterval(countdown); // Detener la cuenta regresiva
                        console.log('Cuenta regresiva terminada de manera satisfactoria');
                    },500)
                } else {
                    pageTest.style.display = 'block';
                }
            });
        } else {
            console.error('Botón "nextTest" no encontrado');
        }
    } else {
        console.error('Elemento de número de test no encontrado');
    }

});
