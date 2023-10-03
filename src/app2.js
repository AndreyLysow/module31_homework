import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { authUser, generateUsers } from "./services/auth";
import { Tasks, closeAllSelect } from "./services/taskManager";

import {
  delLiWithContent,
  delOptionWithContent,
  updateElementDisplay,
  toggleElementDisplay,
  logOutBtn,
  adminUserBtn,
  countTasks,
} from "./utils";
import { LocalStorageManager } from "./localStorageManager";
let fieldHTMLContent;


  const loginForm = document.querySelector("#app-login-form");
  const contentContainer = document.querySelector("#content");


generateUsers(User);

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
 
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");
 
  const user = authUser(login, password); // Вызываем функцию authUser

  if (user === false) {
    fieldHTMLContent = noAccessTemplate;
    }
  if (user) {
    if (user === "admin" || user === "user") {
      fieldHTMLContent = taskFieldTemplate;
    };
  }
  
   // Устанавливаем HTML-содержимое в контейнер #content
   contentContainer.innerHTML = fieldHTMLContent;
  
  if (authUser(login, password)) {
    document.title = 'Awesome Kanban board';
    const head = document.getElementsByTagName("head")[0];
    const icon = document.createElement("link");
    const backlogAddBtn = document.querySelector('.app-container-backlog > .append-button');
    const backlogSbmt = document.querySelector('.app-container-backlog > button.submit-button');
    const readyAddBtn = document.querySelector('.app-container-ready > .append-button');
    const readySbmt = document.querySelector('.app-container-ready > button.submit-button');
    const inProgressAddBtn = document.querySelector('.app-container-progress > .append-button');
    const inProgressSbmt = document.querySelector('.app-container-progress > button.submit-button');
    const finishedAddBtn = document.querySelector('.app-container-finished > .append-button');
    const finishedSbmt = document.querySelector('.app-container-finished > button.submit-button');
    const taskInputField = document.querySelector('.app-task-title_input');
    const backlogList = document.querySelector('.app-list__backlog');
    const readyList = document.querySelector('.app-list__ready');
    const inProgressList = document.querySelector('.app-list__inProgress');
    const finishedList = document.querySelector('.app-list__finished');
    const userMenuToggle = document.querySelector('.app-usermenu');
    const userMenu = document.querySelector('.app-menu__popup');
    const welcome = document.querySelector(".welcome");
    const adminButton = document.getElementById("app-User-Management");
    const adminButton2 = document.getElementById("app-User-kanban");
    let myTasks;

    icon.setAttribute('rel', 'icon');
    icon.setAttribute('href', './img/notepad.svg');
    document.head.appendChild(icon);
   
   
    const maxTasksCount = 100;
    const localStorageManager = new LocalStorageManager();
    myTasks = new Tasks(login, maxTasksCount, localStorageManager);
  
    // loadAllTasksFromStorage(myTasks);
    initDragAndDrop();

    (document.querySelector('.app-ready-tasks-counter')).innerHTML=0;
    (document.querySelector('.app-finished-tasks-counter')).innerHTML=0;
    welcome.textContent = `Welcome ${user}: ${login}!`;
     countTasks();
    // Проверяем, заполнено ли localStorage
    const localStorageKeys = Object.keys(localStorage);

    if (localStorageKeys.length === 0) {
      console.log('localStorage пуст.');
      // alert('localStorage пуст.');
    } else {
      console.log('Содержимое localStorage:');

      for (const key of localStorageKeys) {
        const value = localStorage.getItem(key);
        console.log("содержание сториджа")
        console.log(`Ключ: ${key}, Значение: ${value}`);
        // alert (`Ключ: ${key}, Значение: ${value}`);
      }
    }
   


    userMenuToggle.addEventListener('click', function () {
      if (userMenu.style.visibility != 'visible') {
        userMenu.style.visibility = 'visible';
        userMenu.style.opacity = 1;
        document.querySelector('.app-user_arrow').style.transform = 'rotate(180deg)';
      } else {
        document.querySelector('.app-user_arrow').style.transform = 'rotate(0deg)';
        userMenu.style.visibility = 'hidden';
        userMenu.style.opacity = 0;
      }
    });
    if (user === "user") {
      adminButton.style.display = "none";
      adminButton2.style.display = "none";
    }
    backlogAddBtn.addEventListener('click', function () {
      startNewBacklogTask(backlogAddBtn, backlogSbmt, taskInputField);
    });
    taskInputField.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        e.preventDefault();
        backlogSbmt.click();
      }
    });
    backlogSbmt.addEventListener('click', function () {
      addNewBacklogTask(backlogSbmt, backlogAddBtn, backlogList, taskInputField, myTasks);
            // Сохранить задачи
      myTasks.saveTasksToStorage();
    });
    readyAddBtn.addEventListener('click', function () {
      startNewReadyTask(readyAddBtn, readySbmt);
    });
    readySbmt.addEventListener('click', function () {
      addNewReadyTask(readySbmt, readyAddBtn, readyList, myTasks);
            // Сохранить задачи
      myTasks.saveTasksToStorage();
    });
    inProgressAddBtn.addEventListener('click', function () {
      startNewInProgressTask(inProgressAddBtn, inProgressSbmt);
    });
    inProgressSbmt.addEventListener('click', function () {
      addNewInProgressTask(inProgressSbmt, inProgressAddBtn, inProgressList, myTasks);
      // Сохранить задачи
      myTasks.saveTasksToStorage();
    });
    finishedAddBtn.addEventListener('click', function () {
      startNewFinishedTask(finishedAddBtn, finishedSbmt);
    });
    finishedSbmt.addEventListener('click', function () {
      addNewFinishedTask(finishedSbmt, finishedAddBtn, finishedList, myTasks);
      // Сохранить задачи
    myTasks.saveTasksToStorage();
    });
    document.addEventListener('click', closeAllSelect);


  }



// Добавляем обработчик удаления тасков
const taskElementsDel = document.querySelectorAll(".task");
taskElementsDel.forEach(taskElement => {
  taskElement.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    // Извлекаем значение id
    const taskId = taskElement.id;

    // Запрашиваем подтверждение удаления с помощью prompt
    const confirmation = window.prompt("Вы действительно хотите удалить задачу? Введите 'да' для подтверждения.");

    // Если пользователь ввел 'да', продолжаем удаление
    if (confirmation && confirmation.toLowerCase() === 'да') {
      // Удаляем таск из DOM
      taskElement.remove();

      // Получаем строку JSON из локального хранилища для пользователя
      
      const storedData = localStorage.getItem(login);

      if (storedData) {
        // Преобразуем строку JSON в объект
        const userData = JSON.parse(storedData);

        // Пройдемся по спискам (backlog, ready, inProgress, finished)
        for (const listName in userData) {
          if (userData.hasOwnProperty(listName)) {
            const list = userData[listName];
            // Ищем задачу с соответствующим id и удаляем ее из списка
            const taskIndex = list.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
              list.splice(taskIndex, 1); // Удаляем задачу из списка
            }
          }
        }

        // Сохраняем обновленные данные обратно в хранилище
        localStorage.setItem(login, JSON.stringify(userData));
        console.log("Задача с id", taskId, "удалена из хранилища");
      }
    }
  });
});


// Добавляем обработчик события для удаления локального хранилища
const deleteUsercontentLocalStorage = document.getElementById('deleteUsercontentLocalStorage');
deleteUsercontentLocalStorage.addEventListener('click', function () {
  try {
   
    console.log(login); // Добавьте эту строку для отладки

    // Удаляем данные из локального хранилища
    localStorage.removeItem(login);

    console.log(login, "данные удалены");
  } catch (error) {
    console.error("Произошла ошибка при удалении данных:", error);
  }
});




  adminUserBtn();
  logOutBtn();
});


function addNewBacklogTask(sbmt, btn, backlogList, taskInputField, myTasks) {
  

  sbmt.style.display = 'none';
  btn.style.display = 'block';

  const taskId = myTasks.generateTaskId(); // Генерируем уникальный ID для задачи

  const newTaskAsListElement = document.createElement('li');
  newTaskAsListElement.textContent = taskInputField.value;
  newTaskAsListElement.id = taskId;
  newTaskAsListElement.setAttribute('data-task-id', taskId);
  newTaskAsListElement.classList.add('draggable', 'task');
  newTaskAsListElement.setAttribute('draggable', 'true');

  newTaskAsListElement.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.target.classList.add('dragging');
  });

  newTaskAsListElement.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    console.log('Перетаскивание задачи завершено.');
    countTasks();
    myTasks.saveTasksToStorage();
  });

  backlogList.insertBefore(newTaskAsListElement, backlogList.firstElementChild);

  myTasks.writeBacklog(taskInputField.value);
  taskInputField.value = '';
  taskInputField.style.display = 'none';
  btn.focus();
}

function startNewBacklogTask(btn, sbmt, taskInputField) {
  if (btn && taskInputField) {
    btn.style.display = 'none';
    taskInputField.style.display = 'block';
    taskInputField.focus();
    sbmt.style.display = 'block';
  }

}


function addNewReadyTask(sbmt, btn, readyList, myTasks) {
  const selectMarker = document.querySelector('.app-progress-items > .app-select__list > .app-selection-marker');
  const selectedTask = document.querySelector('.app-ready-items > .app-select__list > .select-items > .same-as-selected');

  updateElementDisplay(sbmt, 'none');
  updateElementDisplay(btn, 'block');

  if (!selectMarker || !selectedTask) {
    alert('Сначала выберите пункт из списка!');
    return;
  }

  const newReadyTaskText = selectedTask.innerText;
  const newTaskAsListElement = document.createElement('li');
  newTaskAsListElement.classList.add('draggable', 'task'); 
  newTaskAsListElement.setAttribute('draggable', 'true');

  newTaskAsListElement.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.target.classList.add("dragging");
  });

  newTaskAsListElement.addEventListener('dragend', (e) => {
    e.target.classList.remove("dragging");
    console.log('Перетаскивание задачи завершено.');
    countTasks();
    myTasks.saveTasksToStorage();
  });

  newTaskAsListElement.appendChild(document.createTextNode(newReadyTaskText));
  readyList.insertBefore(newTaskAsListElement, readyList.lastElementChild);

  myTasks.writeReady(newReadyTaskText);
 
  const nextSibling = selectedTask.nextSibling;
  const prevSibling = selectedTask.previousSibling;

  if (nextSibling) {
    nextSibling.classList.add('same-as-selected');
  } else if (prevSibling) {
    prevSibling.classList.add('same-as-selected');
  } else {
    btn.disabled = true;
  }

  selectedTask.remove();
  delLiWithContent(selectMarker, newReadyTaskText);
  delOptionWithContent(selectMarker, newReadyTaskText);
  countTasks();
  myTasks.saveTasksToStorage();
}

function startNewReadyTask(btn, sbmt) {
  const selectElement = document.querySelector('.app-ready-items > .app-select__list > .select-selected');
  if (selectElement) {
    updateElementDisplay(btn, 'none');
    updateElementDisplay(selectElement, 'block');
    updateElementDisplay(sbmt, 'block');
    sbmt.focus();
  } else {
    // Обработка случая, когда элемент не найден
    console.error('Элемент не найден.');
  }
}


function addNewInProgressTask(sbmt, btn, inProgressList, myTasks) {
  const selectMarker = document.querySelector('.app-progress-items > .app-select__list > .app-selection-marker');
  const selectedTask = document.querySelector('.app-progress-items > .app-select__list > .select-items > .same-as-selected');

  updateElementDisplay(sbmt, 'none');
  updateElementDisplay(btn, 'block');

  if (!selectMarker || !selectedTask) {
    alert('Сначала выберите пункт из списка!');
    return;
  }


  const newInProgressTaskText = selectedTask.innerText;
  const newTaskAsListElement = document.createElement('li');

  newTaskAsListElement.classList.add('draggable', 'task'); 
  newTaskAsListElement.setAttribute('draggable', 'true');

  newTaskAsListElement.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.target.classList.add("dragging");
  });

  newTaskAsListElement.addEventListener('dragend', (e) => {
    e.target.classList.remove("dragging");
    console.log('Перетаскивание задачи завершено.');
    countTasks();
    myTasks.saveTasksToStorage();
  });

  newTaskAsListElement.appendChild(document.createTextNode(newInProgressTaskText));
  inProgressList.insertBefore(newTaskAsListElement, inProgressList.lastElementChild);

  myTasks.writeInProgress(newInProgressTaskText);

  const nextSibling = selectedTask.nextSibling;
  const prevSibling = selectedTask.previousSibling;

  if (nextSibling) {
    nextSibling.classList.add('same-as-selected');
  } else if (prevSibling) {
    prevSibling.classList.add('same-as-selected');
  } else {
    btn.disabled = true;
  }

  // delLiWithContent(document.querySelector('.app-ready-items > .app-select__list > .app-selection-marker'), newInProgressTaskText);
  // delOptionWithContent(document.querySelector('.app-progress-items > .app-select__list > .app-selection-marker'), newInProgressTaskText);

  delLiWithContent(selectMarker, newInProgressTaskText);
  delOptionWithContent(selectMarker, newInProgressTaskText);

  selectedTask.remove();
  countTasks();
  myTasks.saveTasksToStorage();
}

function startNewInProgressTask(btn, sbmt) {
  updateElementDisplay(btn, 'none');
  updateElementDisplay(document.querySelector('.app-progress-items > .app-select__list > .select-selected'), 'block');
  updateElementDisplay(sbmt, 'block');
  sbmt.focus();
}


function addNewFinishedTask(sbmt, btn, finishedList, myTasks) {
  const selectMarker = document.querySelector('.app-finished-items > .app-select__list > .app-selection-marker');
  const selectedTask = document.querySelector('.app-finished-items > .app-select__list > .select-items > .same-as-selected');

  if (!finishedList) {
    console.error('Элемент .app-list__finished не найден на странице.');
    return;
  }

  updateElementDisplay(sbmt, 'none');
  updateElementDisplay(btn, 'block');

  if (!selectedTask) {
    alert('Сначала выберите пункт из списка!');
    return;
  }

  const newFinishedTaskText = selectedTask.innerText;
  const newTaskAsListElement = document.createElement('li');

  newTaskAsListElement.classList.add('draggable', 'task'); 
  newTaskAsListElement.setAttribute('draggable', 'true');

  newTaskAsListElement.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.target.classList.add("dragging");
  });

  newTaskAsListElement.addEventListener('dragend', (e) => {
    e.target.classList.remove("dragging");
    console.log('Перетаскивание задачи завершено.');
    myTasks.saveTasksToStorage();
    countTasks();
  });

  newTaskAsListElement.appendChild(document.createTextNode(newFinishedTaskText));
  finishedList.insertBefore(newTaskAsListElement, finishedList.lastElementChild);

  myTasks.writeFinished(newFinishedTaskText);

  const nextSibling = selectedTask.nextSibling;
  const prevSibling = selectedTask.previousSibling;

  if (nextSibling) {
    nextSibling.classList.add('same-as-selected');
  } else if (prevSibling) {
    prevSibling.classList.add('same-as-selected');
  } else {
    btn.disabled = true;
  }

  delLiWithContent(selectMarker, newFinishedTaskText);
  delOptionWithContent(selectMarker, newFinishedTaskText);
  selectedTask.remove();
  countTasks();
  myTasks.saveTasksToStorage();
}


function startNewFinishedTask(btn, sbmt) {
  toggleElementDisplay(btn, 'none');
  toggleElementDisplay(document.querySelector('.app-finished-items > .app-select__list > .select-selected'), 'block');
  toggleElementDisplay(sbmt, 'block');
  sbmt.focus(); 

}


function initDragAndDrop() {
  const containers = document.querySelectorAll(".task-list");

  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingElement = document.querySelector(".dragging");
      const afterElement = getDragAfterElement(container, e.clientY);
      if (afterElement == null) {
        container.querySelector("ul").appendChild(draggingElement);
      } else {
        container.querySelector("ul").insertBefore(draggingElement, afterElement);
      }
    });

    container.addEventListener("dragstart", (e) => {
      const target = e.target;
      if (target.classList.contains('draggable')) {
        setTimeout(() => {
          target.classList.add('dragging');
        }, 0);
        e.dataTransfer.setData('text/plain', target.textContent);
      }
    });

    container.addEventListener("dragend", (e) => {
      const target = e.target;
      if (target.classList.contains('draggable')) {
        target.classList.remove('dragging');
        const fromList = target.dataset.from;
        // Выполните дополнительные действия, если необходимо
      }
    });
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





function loadAllTasksFromStorage(myTasks) {
  const taskFields = ['backlog', 'ready', 'inProgress', 'finished'];
  let fromList = "";
  let toList = "";
  // initDragAndDrop(myTasks);


  // Функция для обработки события dragstart
  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.textContent);
    fromList = e.target.parentNode.classList[0].replace("app-list__", "");
    e.target.classList.add('dragging');
  }

  // Функция для обработки события dragend
  function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    console.log('Перетаскивание задачи завершено.');
    toList = e.target.parentNode.classList[0].replace("app-list__", "");
    myTasks.moveTask(e.target.id, fromList, toList);
  }


  taskFields.forEach((field) => {
    const tasks = myTasks.getTasksFromList(field);
    const listElement = document.querySelector(`.app-list__${field}`);

    if (!listElement) {
      console.error(`Элемент .app-list__${field} не найден на странице.`);
      return;
    }
    tasks.forEach((task) => {
      const taskText = task.text;
      const newTaskAsListElement = document.createElement('li');
      newTaskAsListElement.id = task.id;
      newTaskAsListElement.textContent = taskText;
      newTaskAsListElement.classList.add('draggable', 'task');
      newTaskAsListElement.setAttribute('draggable', 'true'); // Добавляем атрибут draggable
      newTaskAsListElement.addEventListener('dragstart', handleDragStart);
      newTaskAsListElement.addEventListener('dragend', handleDragEnd);
      listElement.appendChild(newTaskAsListElement);
    });
  });



  // Добавим один обработчик события dragstart к общему предку (например, к спискам задач)
  document.querySelectorAll('.app-list').forEach((listElement) => {
    listElement.addEventListener('dragstart', handleDragStart);
    listElement.addEventListener('dragend', handleDragEnd);
  });
}