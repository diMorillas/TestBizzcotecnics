document.addEventListener('DOMContentLoaded', () => {

    // Testing conexión con archivo JavaScript
    console.log('Successfully Connected to JavaScript File');

    //Gestión de eventos en el body
    document.body.addEventListener('click', ()=>{
        playMusic();
    });

    // Gestión de música
    let music = document.getElementById('bg-music');
    const playMusic = () => {
        music.play()
            .then(() => {
                console.log('Música inicializada correctamente');
            })
            .catch((error) => {
                console.error('Error al inicializar música:', error);
            });
    };

    // Cuenta regresiva
    const timeRemainingTest =()=>{
        let timer = document.getElementById('timer');
        let timeRemaining = 120;  
    
        const countdown = setInterval(() => {
            timeRemaining--; 
    
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
                console.log('Cuenta regresiva terminada de manera satisfactoria');
            }
        }, 1000);
    }
    timeRemainingTest();

    // Gestión de número de test
    let numberTest = document.getElementById('testCounter');
    let testCounter = 1;

    numberTest.innerHTML = `${testCounter}/3`;





});
