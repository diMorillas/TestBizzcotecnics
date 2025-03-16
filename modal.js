// Función para mostrar el modal
export function mostrarModal() {
    modal.style.display = 'flex'; // Muestra el modal
}

// Función que ejecutará después de aceptar el modal
export function iniciarTest() {
    modal.style.display = 'none'; // Oculta el modal
    pageTest.style.display = 'block'; // Muestra el div del test
    pageTest.style.opacity = '0'; // Establece la opacidad inicial
    pageTest.style.transition = 'none'; // Desactiva la transición al principio

    // Esperamos 500ms para evitar la transición inicial
    setTimeout(() => {
        pageTest.style.transition = 'opacity 2s'; // Aplica la transición suave de opacidad
        pageTest.style.opacity = '1'; // Cambia la opacidad a 1
    }, 500);

    // Llamar a la función del temporizador después de iniciar el test
    timeRemainingTest(); // Aquí invocamos la función del temporizador
}

// Función para manejar el temporizador
export function timeRemainingTest() {
    let timeRemaining = 9999;  // Define el tiempo inicial, por ejemplo, 9999 segundos
    let countdown;  // Declaramos la variable countdown

    // Asegúrate de que el elemento 'timer' exista en el DOM
    let timer = document.getElementById('timer');
    if (!timer) {
        console.error('Elemento de timer no encontrado');
        return;
    }

    countdown = setInterval(() => {
        timeRemaining--;  // Decrementamos el tiempo
        console.log(timeRemaining);

        timer.textContent = timeRemaining;  // Actualizamos el texto en el elemento

        // Cambiar el color si el tiempo es menor o igual a 15 segundos
        if (timeRemaining <= 15) {
            timer.style.color = 'red';
            document.body.classList.add('timeout');
        } else {
            timer.style.color = 'white';
            document.body.classList.remove('timeout');
        }

        // Si el tiempo llega a cero, parar el contador y recargar la página
        if (timeRemaining <= 0) {
            clearInterval(countdown);
            console.log('Cuenta regresiva terminada por límite de tiempo');
            alert('No superado');
            location.reload();
        }
    }, 1000);  // Actualiza cada segundo
}
