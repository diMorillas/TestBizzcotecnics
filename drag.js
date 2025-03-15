// drag.js
export function initDragAndDrop() {
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
      }
    });
  
    options.forEach(option => {
      option.addEventListener('dragstart', (e) => {
        e.target.classList.add('dragging');
      });
  
      option.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
      });
    });
  }
  