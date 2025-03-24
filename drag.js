/**
 * @fileoverview
 * Funciones de manejo de eventos para la funcionalidad de arrastrar y soltar (drag and drop).
 * Este archivo contiene la inicialización y la lógica de la funcionalidad drag and drop
 * en la interfaz de usuario, permitiendo a los elementos ser arrastrados y soltados en un área específica.
 * 
 * @author Didac Morillas, Pau Morillas
 * @version 1.0.5
 * @date 2025-03-24
 */

/**
 * Inicializa la funcionalidad de arrastrar y soltar (drag and drop) en la página web.
 * 
 * @function
 * @description Esta función configura los manejadores de eventos para el arrastre y la liberación de elementos 
 * en el contenedor correspondiente. Permite arrastrar opciones y soltarlas sobre un área específica 
 * mientras gestiona la puntuación del usuario según si la opción seleccionada es correcta o no.
 * 
 * @example
 * initDragAndDrop();
 */
export function initDragAndDrop() {
  console.log('Succesfully Connected to drag.js');
  
  // Selección de los elementos de la interfaz de usuario
  const options = document.querySelectorAll('.optionSelected');
  const figureFour = document.querySelector('.figureFour');
  
  // Manejador de eventos para permitir el arrastre sobre el área de destino
  figureFour.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  
  // Manejador de eventos para el evento 'drop'
  figureFour.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggedElement = document.querySelector('.dragging');
  
    if (draggedElement) {
      const existingImage = figureFour.querySelector('.optionSelected');
  
      if (existingImage) {
        figureFour.removeChild(existingImage);
      }
  
      // Clonamos el elemento para no moverlo
      const clonedElement = draggedElement.cloneNode(true);
      figureFour.appendChild(clonedElement);
      clonedElement.classList.remove('dragging');
      clonedElement.style.width = '160px';
  
      // Obtención del valor del atributo "value" del contenedor
      const optionValue = draggedElement.closest('div').getAttribute('value');
      clonedElement.setAttribute('data-option', optionValue);
      console.log(optionValue);
  
      // Comprobación de si el valor seleccionado es correcto
      if (optionValue === window.correctOption) {
        console.log("es correcto");

        // Actualización de la puntuación del usuario
        const currentScore = sessionStorage.getItem('score') || 0;
        const newScore = parseInt(currentScore) + 1;
        sessionStorage.setItem('score', newScore);
        console.log("Puntuación guardada:", newScore);
      } else {
        console.log("respuesta incorrecta");
        console.log("optionValue:", optionValue, "correctOption:", window.correctOption);
      }
    }
  });
  
  // Configuración de eventos para las opciones arrastrables
  options.forEach(option => {
    option.addEventListener('dragstart', (e) => {
      e.target.classList.add('dragging');
    });
  
    option.addEventListener('dragend', (e) => {
      e.target.classList.remove('dragging');
    });
  });
}
