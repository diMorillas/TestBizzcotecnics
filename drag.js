// drag.js
export function initDragAndDrop() {
  console.log('Succesfully Connected to drag.js');
  const options = document.querySelectorAll('.optionSelected');
  const figureFour = document.querySelector('.figureFour');
  
  figureFour.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  
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
  
      // Aquí obtenemos el valor del atributo "value" del contenedor (div)
      const optionValue = draggedElement.closest('div').getAttribute('value');  // Asegúrate de obtener el contenedor
      clonedElement.setAttribute('data-option', optionValue);
      console.log(optionValue);
  
      // Comprobamos si el valor coincide con la respuesta correcta
      if (optionValue === window.correctOption) {
        console.log("es correcto");

        // Aquí puedes actualizar la puntuación
        const currentScore = sessionStorage.getItem('score') || 0;  // Si no existe, inicializamos a 0
        const newScore = parseInt(currentScore) + 1;  // Aumentamos la puntuación
        sessionStorage.setItem('score', newScore);  // Guardamos la nueva puntuación
        console.log("Puntuación guardada:", newScore);
      } else {
        console.log("respuesta incorrecta");
        console.log("optionValue:", optionValue, "correctOption:", window.correctOption);
      }
    }
  });
  
  options.forEach(option => {
    // No es necesario asignar dataset, ya que usamos el atributo "value" en el HTML.
    option.addEventListener('dragstart', (e) => {
      e.target.classList.add('dragging');
    });
  
    option.addEventListener('dragend', (e) => {
      e.target.classList.remove('dragging');
    });
  });
}
