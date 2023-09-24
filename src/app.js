import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { State } from "./state";
import { authUser, generateUsers } from "./services/auth";
import { Tasks, closeAllSelect } from "./services/tasksClass";
import { initDragAndDrop } from "./services/dragAndDrop";
import {
  delLiWithContent,
  delOptionWithContent,
  updateElementDisplay,
  toggleElementDisplay,
  logOutBtn,
  adminUserBtn,
} from "./utils";
let fieldHTMLContent;
export const appState = new State();

const loginForm = document.querySelector("#app-login-form");



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
  document.querySelector("#content").innerHTML = fieldHTMLContent;
  if (!(fieldHTMLContent === '<h1>Sorry, you\'ve no access to this resource!</h1>')) {
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
    const inProgressList = document.querySelector('.app-list__in-progress');
    const finishedList = document.querySelector('.app-list__finished');
    const userMenuToggle = document.querySelector('.app-usermenu');
    const userMenu = document.querySelector('.app-menu__popup');
    const welcome = document.querySelector(".welcome");
    const adminButton = document.getElementById("app-User-Management");
    const adminButton2 = document.getElementById("app-User-kanban");
    let myTasks;

    icon.setAttribute('href', './img/notepad.svg');
    head.appendChild(icon);
    myTasks = new Tasks(login);
    document.querySelector('.app-ready-tasks-counter').innerHTML = '0';
    document.querySelector('.app-finished-tasks-counter').innerHTML = '0';
    welcome.textContent = `Welcome ${user}: ${login}!`;
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

  newTaskAsListElement.className = 'draggable';
  newTaskAsListElement.setAttribute('draggable', 'true');

  newTaskAsListElement.addEventListener('dragstart', (e) => {
    newTaskAsListElement.classList.add("dragging");
  });

  newTaskAsListElement.addEventListener('dragend', () => {
    newTaskAsListElement.classList.remove("dragging");
    console.log('Перетаскивание задачи завершено.');
  });

  backlogList.insertBefore(newTaskAsListElement, backlogList.firstElementChild);

  myTasks.writeBacklog(taskInputField.value);
  taskInputField.value = '';
  taskInputField.style.display = 'none';
  btn.focus();
  initDragAndDrop();
}

function startNewBacklogTask(btn, sbmt, taskInputField) {
  btn.style.display = 'none';
  taskInputField.style.display = 'block';
  taskInputField.focus();
  sbmt.style.display = 'block';
}

function addNewReadyTask(sbmt, btn, readyList, myTasks) {
  const selectMarker = document.querySelector('.app-progress-items > .app-select__list > .app-selection-marker');
  const selectedTask = document.querySelector('.app-ready-items > .app-select__list > .select-items > .same-as-selected');

  updateElementDisplay(sbmt, 'none');
  updateElementDisplay(btn, 'block');

  if (!selectedTask) {
    alert('Сначала выберите пункт из списка!');
    return;
  }

  const newReadyTaskText = selectedTask.innerText;
  const newTaskAsListElement = document.createElement('li');
  newTaskAsListElement.className = 'draggable';
  newTaskAsListElement.setAttribute('draggable', 'true');

  newTaskAsListElement.addEventListener('dragstart', (e) => {
    newTaskAsListElement.classList.add("dragging");
  });

  newTaskAsListElement.addEventListener('dragend', () => {
    newTaskAsListElement.classList.remove("dragging");
    console.log('Перетаскивание задачи завершено.');
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
}

function startNewReadyTask(btn, sbmt) {
  updateElementDisplay(btn, 'none');
  updateElementDisplay(document.querySelector('.app-ready-items > .app-select__list > .select-selected'), 'block');
  updateElementDisplay(sbmt, 'block');
  sbmt.focus();
}

function addNewInProgressTask(sbmt, btn, inProgressList, myTasks) {
  const selectMarker = document.querySelector('.app-progress-items > .app-select__list > .app-selection-marker');
  const selectedTask = document.querySelector('.app-progress-items > .app-select__list > .select-items > .same-as-selected');

  updateElementDisplay(sbmt, 'none');
  updateElementDisplay(btn, 'block');

  if (!selectedTask) {
    alert('Сначала выберите пункт из списка!');
    return;
  }

  const newInProgressTaskText = selectedTask.innerText;
  const newTaskAsListElement = document.createElement('li');

  newTaskAsListElement.className = 'draggable';
  newTaskAsListElement.setAttribute('draggable', 'true');

  newTaskAsListElement.addEventListener('dragstart', (e) => {
    newTaskAsListElement.classList.add("dragging");
  });

  newTaskAsListElement.addEventListener('dragend', () => {
    newTaskAsListElement.classList.remove("dragging");
    console.log('Перетаскивание задачи завершено.');
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

  delLiWithContent(document.querySelector('.app-ready-items > .app-select__list > .app-selection-marker'), newInProgressTaskText);
  delOptionWithContent(document.querySelector('.app-progress-items > .app-select__list > .app-selection-marker'), newInProgressTaskText);

  selectedTask.remove();
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

  updateElementDisplay(sbmt, 'none');
  updateElementDisplay(btn, 'block');

  if (!selectedTask) {
    alert('Сначала выберите пункт из списка!');
    return;
  }

  const newFinishedTaskText = selectedTask.innerText;
  const newTaskAsListElement = document.createElement('li');

  newTaskAsListElement.className = 'draggable';
  newTaskAsListElement.setAttribute('draggable', 'true');

  newTaskAsListElement.addEventListener('dragstart', (e) => {
    newTaskAsListElement.classList.add("dragging");
  });

  newTaskAsListElement.addEventListener('dragend', () => {
    newTaskAsListElement.classList.remove("dragging");
    console.log('Перетаскивание задачи завершено.');
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
}

function startNewFinishedTask(btn, sbmt) {
  toggleElementDisplay(btn, 'none');
  toggleElementDisplay(document.querySelector('.app-finished-items > .app-select__list > .select-selected'), 'block');
  toggleElementDisplay(sbmt, 'block');
  sbmt.focus();
}

function recalcThings() {
  const tasksCounter = document.querySelector(".app-ready-tasks-counter");
  tasksCounter.textContent = '0';
}

