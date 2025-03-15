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
  
        const optionValue = draggedElement.dataset.optionValue; 
        clonedElement.setAttribute('data-option', optionValue); 
      }
    });
  
    options.forEach(option => {
      switch (option.closest('div').classList[0]) {
        case 'optionOne':
          option.dataset.optionValue = 'a';
          break;
        case 'optionTwo':
          option.dataset.optionValue = 'b';
          break;
        case 'optionThree':
          option.dataset.optionValue = 'c';
          break;
        case 'optionFour':
          option.dataset.optionValue = 'd';
          break;
      }
  
      option.addEventListener('dragstart', (e) => {
        e.target.classList.add('dragging');
      });
  
      option.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
      });
    });
  }
  