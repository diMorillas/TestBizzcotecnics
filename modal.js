// modal.js

// Función para mostrar el modal
export function mostrarModal() {
    const modal = document.getElementById('modal');
    if (!modal) {
        console.error('Elemento modal no encontrado');
        return;
    }
    modal.style.display = 'flex'; // Muestra el modal
    console.log('Successfully Connected to modal.js');
}

// Función que ejecutará después de aceptar el modal
export function iniciarTest() {
    const modal = document.getElementById('modal');
    const pageTest = document.getElementById('pageTest');
    if (!modal || !pageTest) {
        console.error('No se encontraron elementos necesarios (modal o pageTest)');
        return;
    }
    modal.style.display = 'none'; // Oculta el modal
    pageTest.style.display = 'block'; // Muestra el div del test
    pageTest.style.opacity = '0'; // Establece la opacidad inicial
    pageTest.style.transition = 'none'; // Desactiva la transición al principio

    // Esperamos 500ms para evitar la transición inicial
    setTimeout(() => {
        pageTest.style.transition = 'opacity 2s'; // Aplica la transición suave de opacidad
        pageTest.style.opacity = '1'; // Cambia la opacidad a 1
    }, 500);
    // Nota: La función timeRemainingTest() se invocará desde main.js para poder almacenar el ID del intervalo.
}

// Función para manejar el temporizador
/**
 * @param {*} timeRemaining iniciado en 35 por defecto
 * @returns countdown. Retornamos el ID del intérvalo para limpiarlo externamente.
 */
export function timeRemainingTest(timeRemaining = 35) {
    let countdown;  // Declaramos la variable countdown

    // Aseguramos que el elemento 'timer' exista en el DOM
    let timer = document.getElementById('timer');
    if (!timer) {
        console.error('Elemento de timer no encontrado');
        return;
    }

    /**
     * Iniciamos el intérvalo
     */

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

        // Si el tiempo llega a cero, detener el contador y recargar la página
        if (timeRemaining <= 0) {
            clearInterval(countdown);
            console.log('Cuenta regresiva terminada por límite de tiempo');
            alert('No superado');
            location.reload();
        }
    }, 1000);  // Actualiza cada segundo

    return countdown; // Retornamos el ID del intervalo para poder limpiarlo externamente
}
