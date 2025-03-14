document.addEventListener('DOMContentLoaded', () => {

    // Testing conexión con archivo JavaScript
    console.log('Successfully Connected');

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
    document.body.addEventListener('click', playMusic);



});
