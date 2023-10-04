import { countTasks } from "../utils";

export function initDragAndDrop() {
  const containers = document.querySelectorAll(".task-list");

  // Функция для обработки события dragover
  function handleDragOver(e) {
    e.preventDefault();
    const container = e.currentTarget; // Получаем текущий контейнер
    const draggingElement = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
      container.querySelector("ul").appendChild(draggingElement);
    } else {
      container.querySelector("ul").insertBefore(draggingElement, afterElement);
    }
  }

  // Функция для обработки события dragstart
  function handleDragStart(e) {
    const target = e.target;
    if (target.classList.contains('draggable')) {
      setTimeout(() => {
        target.classList.add('dragging');
      }, 0);
      e.dataTransfer.setData('text/plain', target.textContent);
    }
  }

  // Функция для обработки события dragend
  function handleDragEnd(e) {
    const target = e.target;
    if (target.classList.contains('draggable')) {
      target.classList.remove('dragging');
      countTasks();
    }
  }

  containers.forEach((container) => {
    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("dragstart", handleDragStart);
    container.addEventListener("dragend", handleDragEnd);
  });

  // Функция для определения элемента, перед которым нужно вставить перетаскиваемый элемент
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
}

