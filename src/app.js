import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { authUser, generateUsers } from "./services/auth";
import { Tasks, closeAllSelect } from "./services/taskManager";
import { initDragAndDrop } from "./services/dragAndDrop";
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
  
    loadAllTasksFromStorage(myTasks);
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
 
    });
    readyAddBtn.addEventListener('click', function () {
      startNewReadyTask(readyAddBtn, readySbmt);
    });
    readySbmt.addEventListener('click', function () {
      addNewReadyTask(readySbmt, readyAddBtn, readyList, myTasks);
     
    });
    inProgressAddBtn.addEventListener('click', function () {
      startNewInProgressTask(inProgressAddBtn, inProgressSbmt);
    });
    inProgressSbmt.addEventListener('click', function () {
      addNewInProgressTask(inProgressSbmt, inProgressAddBtn, inProgressList, myTasks);
    
    });
    finishedAddBtn.addEventListener('click', function () {
      startNewFinishedTask(finishedAddBtn, finishedSbmt);
    });
    finishedSbmt.addEventListener('click', function () {
      addNewFinishedTask(finishedSbmt, finishedAddBtn, finishedList, myTasks);
    
    });
    document.addEventListener('click', closeAllSelect);
  }

  adminUserBtn();
  logOutBtn();
});


function addNewBacklogTask(sbmt, btn, backlogList, taskInputField, myTasks) {
  sbmt.style.display = 'none';
  btn.style.display = 'block';

  const newTaskAsListElement = document.createElement('li');
  newTaskAsListElement.textContent = taskInputField.value;
  const newTaskText = taskInputField.value;

  // Создаем новый элемент задачи с помощью функции createTaskElement
  const newTaskElement = createTaskElement(newTaskText, myTasks);

  backlogList.insertBefore(newTaskElement, backlogList.firstElementChild);

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

  // Создаем новый элемент задачи с помощью функции createTaskElement
  const newTaskElement = createTaskElement(newReadyTaskText);

  // Вставляем новый элемент задачи в список завершенных задач (finishedList)
  readyList.insertBefore(newTaskElement, readyList.lastElementChild);

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
  
// Создаем новый элемент задачи с помощью функции createTaskElement
const newTaskElement = createTaskElement(newInProgressTaskText);

// Вставляем новый элемент задачи в список завершенных задач
inProgressList.insertBefore(newTaskElement, inProgressList.lastElementChild);

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
  

// Создаем новый элемент задачи с помощью функции createTaskElement
const newTaskElement = createTaskElement(newFinishedTaskText);

// Вставляем новый элемент задачи в список завершенных задач
finishedList.insertBefore(newTaskElement, finishedList.lastElementChild);

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
  // myTasks.saveTasksToStorage();
}


function startNewFinishedTask(btn, sbmt) {
  toggleElementDisplay(btn, 'none');
  toggleElementDisplay(document.querySelector('.app-finished-items > .app-select__list > .select-selected'), 'block');
  toggleElementDisplay(sbmt, 'block');
  sbmt.focus(); 
}



function loadAllTasksFromStorage(myTasks) {
  const taskFields = ['backlog', 'ready', 'inProgress', 'finished'];
  let fromList = "";
  let toList = "";


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


function createTaskElement(taskText) {
  const newTaskAsListElement = document.createElement('li');
  newTaskAsListElement.classList.add('draggable', 'task'); 
  newTaskAsListElement.setAttribute('draggable', 'true');
  newTaskAsListElement.textContent = taskText;

  function handleDragStartTask(e) {
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.target.classList.add("dragging");
  }

  function handleDragEndTask(e) {
    if (e.target) {
      e.target.classList.remove("dragging");
      console.log('Перетаскивание задачи завершено.');
      countTasks();
      const fromList = e.target.parentNode?.classList?.[0]?.replace("app-list__", "");
      const toList = e.target.closest('.app-list')?.classList?.[0]?.replace("app-list__", "");
      const taskId = e.target.id;
  
      // Здесь вызывается метод перемещения задачи
      if (fromList && toList && taskId) {
        myTasks.moveTask(taskId, fromList, toList);
      }
    }
  }
  

  newTaskAsListElement.addEventListener('dragstart', handleDragStartTask);
  newTaskAsListElement.addEventListener('dragend', handleDragEndTask);
  countTasks();
  return newTaskAsListElement;
}


