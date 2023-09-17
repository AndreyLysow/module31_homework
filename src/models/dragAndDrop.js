import $ from "jquery";

// Функция для инициализации перетаскивания элементов
export function initDragAndDrop() {
  const draggables = document.querySelectorAll(".draggable");
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

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");
      if (draggable && afterElement == null) {
        container.appendChild(draggable);
      } else if (draggable) {
        container.insertBefore(draggable, afterElement);
      }
    });
  });
}


$(document).ready(() => {
    const draggables = $(".draggable");
    const containers = $(".task-list");
  
    // Функция для определения элемента, перед которым нужно вставить перетаскиваемый элемент
    function getDragAfterElement(container, y) {
      const draggableElements = container.find(".draggable:not(.dragging)");
      let closestElement = null;
      let minOffset = Infinity;
  
      draggableElements.each((index, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
  
        if (offset < 0 && Math.abs(offset) < minOffset) {
          closestElement = child;
          minOffset = Math.abs(offset);
        }
      });
  
      return closestElement;
    }
  
    draggables.on("dragstart", (event) => {
      event.target.classList.add("dragging");
    });
  
    draggables.on("dragend", (event) => {
      event.target.classList.remove("dragging");
    });
  
    containers.on("dragover", (event) => {
      event.preventDefault();
      const afterElement = getDragAfterElement($(event.target), event.clientY);
      const draggable = $(".dragging");
  
      if (draggable.length > 0 && afterElement == null) {
        $(event.target).append(draggable);
      } else if (draggable.length > 0) {
        $(afterElement).before(draggable);
      }
    });
  });
  
  
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

  // Функция для удаления элемента li с указанным текстовым содержанием
export function delLiWithContent(searchRoot, textcontent) {
    let elem = document.evaluate(
      '//li[contains(., "' + textcontent + '")]',
      searchRoot,
      null,
      XPathResult.ANY_TYPE,
      null
    );
    let thisElem = elem.iterateNext();
    let parentBtn = thisElem.parentNode.parentNode.parentNode.querySelector(
      "append-button"
    );
  
    thisElem.remove();
  }
  
  // Функция для удаления элемента div с указанным текстовым содержанием
  export function delDivWithContent(searchRoot, textcontent) {
    let elem = document.evaluate(
      '//div[contains(., "' + textcontent + '")]',
      searchRoot,
      null,
      XPathResult.ANY_TYPE,
      null
    );
    let thisElem = elem.iterateNext();
    thisElem.remove();
  }
  
  // Функция для удаления элемента option с указанным текстовым содержанием
  export function delOptionWithContent(searchRoot, textcontent) {
    let elem = document.evaluate(
      '//option[contains(., "' + textcontent + '")]',
      searchRoot,
      null,
      XPathResult.ANY_TYPE,
      null
    );
    let thisElem = elem.iterateNext();
    thisElem.remove();
  }
  

