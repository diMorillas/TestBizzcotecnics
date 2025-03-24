/**
 * @file modal.js
 * @date 24 marzo 2025
 * @author 
 *   - Didac Morillas
 *   - Pau Morillas
 * @version 1.0.5
 * @description Módulo que gestiona la visualización del modal, la transición al test y el temporizador del test.
 */

/**
 * Muestra el modal estableciendo su estilo display a 'flex'.
 * Si no se encuentra el elemento, se muestra un error en consola.
 */
export function mostrarModal() {
    const modal = document.getElementById('modal');
    if (!modal) {
        console.error('Elemento modal no encontrado');
        return;
    }
    modal.style.display = 'flex'; // Muestra el modal
    console.log('Successfully Connected to modal.js');
}

/**
 * Inicia el test ocultando el modal y mostrando la página del test.
 * Aplica una transición suave a la opacidad del contenedor del test.
 */
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
    // Nota: La función timeRemainingTest() se invoca desde main.js para poder almacenar el ID del intervalo.
}

/**
 * Inicia y gestiona el temporizador para el test.
 *
 * @param {number} [timeRemaining=35] - Tiempo inicial en segundos.
 * @returns {number} El ID del intervalo, para poder detenerlo externamente.
 */
export function timeRemainingTest(timeRemaining = 35) {
    let countdown;  // Variable para almacenar el ID del intervalo

    // Aseguramos que el elemento 'timer' exista en el DOM
    let timer = document.getElementById('timer');
    if (!timer) {
        console.error('Elemento de timer no encontrado');
        return;
    }

    // Iniciamos el intervalo que decrementa el tiempo y actualiza el DOM
    countdown = setInterval(() => {
        timeRemaining--;  // Decrementa el tiempo

        // Se actualiza el contador del modal, si existe el elemento 'counterModal'
        if (typeof counterModal !== 'undefined' && counterModal !== null) {
            counterModal.innerHTML = timeRemaining;
        }

        timer.textContent = timeRemaining;  // Actualiza el texto en el elemento timer

        // Cambia el color del timer y añade/quita la clase 'timeout' al body según el tiempo restante
        if (timeRemaining <= 15) {
            timer.style.color = 'red';
            document.body.classList.add('timeout');
        } else {
            timer.style.color = 'white';
            document.body.classList.remove('timeout');
        }

        // Si el tiempo llega a cero, detiene el intervalo, muestra un mensaje y recarga la página
        if (timeRemaining <= 0) {
            clearInterval(countdown);
            console.log('Cuenta regresiva terminada por límite de tiempo');
            alert('No superado');
            location.reload();
        }
    }, 1000);  // Actualiza cada segundo

    return countdown; // Retorna el ID del intervalo
}
