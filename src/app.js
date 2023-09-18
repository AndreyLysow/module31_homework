import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import $ from "jquery";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { State } from "./State";
import { authUser } from './services/auth';
import { Tasks } from "./models/Tasks";
import { initDragAndDrop } from "./models/dragAndDrop";
import {
  generateTestUser,
  getFromStorage,
  addToStorage,
} from "./utils.js";

class App {
  constructor() {
    this.appState = new State();
    this.myTasks = new Tasks(this.appState.currentUser ? this.appState.currentUser.login : null);
    this.taskInputField = null;
    this.backlogList = null;
    this.backlogAddBtn = null;
    this.backlogSbmt = null;
    this.initializeApp();
  }

  setCurrentUser(user) {
    this.appState.currentUser = user;
  }

  async initializeApp() {
    await this.appState.fetchUser();
    this.setupLoginForm();
    if (this.appState.currentUser && this.appState.currentUser.login) {
      this.myTasks = new Tasks(this.appState.currentUser.login);
      generateTestUser(User);
      this.initDragAndDrop();
      this.taskInputField = document.querySelector('.app-task-title_input');
      this.backlogList = document.querySelector('.app-list__backlog');
      this.backlogAddBtn = document.querySelector('.app-container-backlog .append-button');
      this.backlogSbmt = document.querySelector('.app-container-backlog .submit-button');
      this.setupEventHandlers();
    }
  }

  setupLoginForm() {
    const loginForm = document.querySelector("#app-login-form");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const login = formData.get("login");
      const password = formData.get("password");

      const fieldHTMLContent = await authUser(login, password, this.appState)
        ? taskFieldTemplate
        : noAccessTemplate;

      document.querySelector("#content").innerHTML = fieldHTMLContent;

      if (fieldHTMLContent !== '<h1>Sorry, you\'ve no access to this resource!</h1>') {
        // Вызывайте здесь необходимые действия для инициализации интерфейса
        this.initDragAndDrop();
        this.taskInputField = document.querySelector('.app-task-title_input');
        this.backlogList = document.querySelector('.app-list__backlog');
        this.backlogAddBtn = document.querySelector('.app-container-backlog .append-button');
        this.backlogSbmt = document.querySelector('.app-container-backlog .submit-button');
        this.setupEventHandlers();
      }
    });
  }

  initDragAndDrop() {
    const lists = document.querySelectorAll('.app-list');
    lists.forEach(list => {
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggedTask = document.querySelector('.dragging');
        if (draggedTask) {
          list.classList.add('drag-target');
        }
      });

      list.addEventListener('dragleave', () => {
        list.classList.remove('drag-target');
      });

      list.addEventListener('drop', (e) => {
        e.preventDefault();
        list.classList.remove('drag-target');
        const draggedTask = document.querySelector('.dragging');
        if (draggedTask) {
          const taskData = JSON.parse(draggedTask.dataset.task);
          this.moveTask(taskData, list);
        }
      });
    });

    lists.forEach(list => {
      list.querySelectorAll('li').forEach(task => {
        task.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({ status: list.id, text: task.textContent }));
          task.classList.add('dragging');
        });

        task.addEventListener('dragend', () => {
          task.classList.remove('dragging');
        });
      });
    });
  }

  setupEventHandlers() {
    const buttons = [
      { selector: '.app-container-backlog > .append-button', handler: () => this.startNewBacklogTask() },
      { selector: '.app-container-ready > .append-button', handler: () => this.startNewReadyTask() },
      { selector: '.app-container-progress > .append-button', handler: () => this.startNewInProgressTask() },
      { selector: '.app-container-finished > .append-button', handler: () => this.startNewFinishedTask() },
    ];

    buttons.forEach(({ selector, handler }) => {
      const button = document.querySelector(selector);
      button.addEventListener('click', handler);
    });

    this.taskInputField.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.addNewBacklogTask();
      }
    });
  }

  startNewBacklogTask() {
    this.taskInputField.style.display = 'block';
    this.backlogSbmt.style.display = 'block';
    this.taskInputField.focus();

    this.backlogAddBtn.addEventListener('click', () => {
      this.addNewBacklogTask();
    });
  }

  addNewBacklogTask() {
    const text = this.taskInputField.value;
    this.createTask(text, this.backlogList);
    this.taskInputField.value = '';
    this.taskInputField.style.display = 'none';
    this.backlogAddBtn.style.display = 'block';
    this.backlogSbmt.style.display = 'none';
    this.backlogAddBtn.focus();
  }

  createTask(text, list) {
    if (!list || !(list instanceof Node)) {
      console.error('Invalid list:', list);
      return;
    }

    const newTaskAsListElement = document.createElement('li');
    newTaskAsListElement.textContent = text;
    newTaskAsListElement.setAttribute('draggable', 'true');

    newTaskAsListElement.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ status: list.id, text: text }));
    });

    newTaskAsListElement.addEventListener('dragend', () => {
      console.log('Drag and drop completed.');
    });

    const firstChild = list.firstElementChild;

    if (firstChild) {
      list.insertBefore(newTaskAsListElement, firstChild);
    } else {
      list.appendChild(newTaskAsListElement);
    }

    if (list.id === 'backlog') {
      this.myTasks.writeBacklog(text);
    } else if (list.id === 'ready') {
      this.myTasks.writeReady(text);
    } else if (list.id === 'in-progress') {
      this.myTasks.writeInProgress(text);
    } else if (list.id === 'finished') {
      this.myTasks.writeFinished(text);
    }

    initDragAndDrop();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const app = new App();
  app.initializeApp();
});


export default appInstance;