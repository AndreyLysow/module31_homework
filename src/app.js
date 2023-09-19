import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import $ from "jquery";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { State } from "./state";
import { authUser } from "./services/auth";
import { initDragAndDrop } from "./models/dragAndDrop";
import { generateTestUser } from "./utils";

class App {
  constructor() {
    this.appState = new State();
    this.taskInputField = null;
    this.backlogList = null;
    this.backlogAddBtn = null;
    this.backlogSbmt = null;
    this.initializeApp();
  }

  async initializeApp() {
    generateTestUser(User); // Создаем тестового пользователя

    // Здесь можно добавить логику для загрузки текущего пользователя, если необходимо

    this.setupLoginForm();
    initDragAndDrop(); // Инициализировать перетаскивание здесь
    this.setupEventHandlers();
  }

  setupLoginForm() {
    const loginForm = document.querySelector("#app-login-form");
  
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const login = formData.get("login");
      const password = formData.get("password");
  
      if (await authUser(login, password)) {
        // Успешная аутентификация
        const fieldHTMLContent = taskFieldTemplate;
        document.querySelector("#content").innerHTML = fieldHTMLContent;
  
        this.taskInputField = document.querySelector('.app-task-title_input');
        this.backlogList = document.querySelector('.app-list__backlog');
        this.backlogAddBtn = document.querySelector('.app-container-backlog .append-button');

        this.initDragAndDrop();
        this.setupEventHandlers();

        // Инициализация интерфейса
        initDragAndDrop(); // Используем функцию без this
      } else {
        // Ошибка аутентификации
        const fieldHTMLContent = noAccessTemplate;
        document.querySelector("#content").innerHTML = fieldHTMLContent;
      }
    });
  }

  initDragAndDrop() {
    // Настройка обработчиков событий для перетаскивания задач
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
  }

  setupEventHandlers() {
    const buttons = [
      { selector: '.app-container-backlog .append-button', handler: this.startNewBacklogTask.bind(this) },
    ];

    // const buttons = [
    //   { selector: '.app-container-backlog > .append-button', handler: this.startNewBacklogTask.bind(this) },
    //   { selector: '.app-container-ready > .append-button', handler: this.startNewReadyTask.bind(this) },
    //   { selector: '.app-container-progress > .append-button', handler: this.startNewInProgressTask.bind(this) },
    //   { selector: '.app-container-finished > .append-button', handler: this.startNewFinishedTask.bind(this) },
    // ];


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
    this.backlogAddBtn.style.display = 'none';
    this.taskInputField.focus();

    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit';
    submitButton.classList.add('submit-button');

    submitButton.addEventListener('click', () => {
      this.addNewBacklogTask();
      this.taskInputField.style.display = 'none';
      submitButton.remove();
      this.backlogAddBtn.style.display = 'block';
    });
    document.querySelector('.app-container-backlog').appendChild(submitButton);
  }

  addNewBacklogTask() {
    const text = this.taskInputField.value;
    this.createTask(text, this.backlogList);
    this.taskInputField.value = '';
  }

  createTask(text, list) {
    if (!list || !(list instanceof Node)) {
      console.error('Invalid list:', list);
      return;
    }

    const newTaskAsListElement = document.createElement('div');
    newTaskAsListElement.textContent = text;
    newTaskAsListElement.className = 'draggable'; 
    newTaskAsListElement.setAttribute('draggable', 'true');

    newTaskAsListElement.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ status: list.id, text: text }));
    });

    newTaskAsListElement.addEventListener('dragend', () => {
      console.log('Перетаскивание задачи завершено.');
    });

    const firstChild = list.firstElementChild;

    if (firstChild) {
      list.insertBefore(newTaskAsListElement, firstChild);
    } else {
      list.appendChild(newTaskAsListElement);
    }

    // Здесь можно добавить логику для сохранения задачи
  }

  moveTask(taskData, list) {
    // Здесь можно добавить логику для перемещения задачи между списками
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
});

