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

            timeRemaining <= 15 ? timer.style.color = 'red' : timer.style.color = ' white';
    
            if (timeRemaining <= 0) {
                clearInterval(countdown);
                console.log('Cuenta regresiva terminada de manera satisfactoria');
            }
        }, 1000);
    }
    timeRemainingTest();




});
