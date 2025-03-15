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
        figureFour.appendChild(draggedElement);
        draggedElement.classList.remove('dragging'); 
  
        draggedElement.style.width = '160px'; 
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
  