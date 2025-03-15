
export function initDragAndDrop() {
    const options = document.querySelectorAll('.optionSelected');
    const figureFour = document.querySelector('.figureFour');
  
    figureFour.addEventListener('dragover', (e) => {
      e.preventDefault(); // Permite que el drop sea posible
    });
  
    figureFour.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedElement = document.querySelector('.dragging'); // Elemento arrastrado
  
      if (draggedElement) {
                figureFour.appendChild(draggedElement);
        draggedElement.classList.remove('dragging'); // Limpiar la clase de arrastre
      }
    });
  
    options.forEach(option => {
      option.addEventListener('dragstart', (e) => {
        e.target.classList.add('dragging'); // Añadir clase para el elemento arrastrado
      });
  
      option.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging'); // Eliminar la clase cuando termine el arrastre
      });
    });
  }
  