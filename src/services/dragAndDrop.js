
  // Функция для инициализации перетаскивания элементов
  
  export function initDragAndDrop() {
    const containers = document.querySelectorAll(".task-list");
  
    // Функция для определения элемента, перед которым нужно вставить перетаскиваемый элемент
    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
      let closestElement = null;
      let minOffset = Infinity;
  
      draggableElements.forEach((child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
  
        if (offset < 0 && Math.abs(offset) < minOffset) {
          closestElement = child;
          minOffset = Math.abs(offset);
        }
      });
  
      return closestElement;
    }
  
    containers.forEach((container) => {
  
      container.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
  
      container.addEventListener("drop", (e) => {
        e.preventDefault();
        console.log(e);
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");
        
        if (container === e.target) {
          container.querySelector("ul").append(draggable);
        } else if(e.target.draggable) {
          e.target.after(draggable);
        }
      });
    });
    
  }
  