document.addEventListener('DOMContentLoaded', () => {

    //DOM básico
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
        music.play()
    };

    // Cuenta regresiva
    const timeRemainingTest = () => {
        let timer = document.getElementById('timer');
        let timeRemaining = 30;

        const countdown = setInterval(() => {
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
                console.log('Cuenta regresiva terminada for limite de tiempo');
            }
        }, 1000);
    }
    timeRemainingTest();

    // Gestión de número de test
    let numberTest = document.getElementById('testCounter');
    let testCounter = 1;

    numberTest.innerHTML = `${testCounter}/3`;

    // Gestión Test Dinámico Botón
    let nextTest = document.getElementById('btnNext');

    nextTest.addEventListener('click', () => {
        testCounter < 3 ? testCounter++ : console.error('Máximos test por jugador alcanzado');
        numberTest.innerHTML = `${testCounter}/3`;
        console.log(testCounter);

        // Gestión de SPA (se evalúa cada vez que cambia el contador)
        if (testCounter == 3) {
            alert('Has completado el test.');
            pageTest.style.display = 'none';
            clearInterval(countdown);
            console.log('Cuenta regresiva terminada de manera satisfactoria');
        } else {
            pageTest.style.display = 'block';
        }
    });

});
