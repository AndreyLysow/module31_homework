import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import $ from "jquery";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";
import { Tasks, closeAllSelect } from "./models/Tasks";
import { initDragAndDrop } from "./models/dragAndDrop";
import { delLiWithContent, delDivWithContent, delOptionWithContent } from "./models/dragAndDrop";

class App {
  constructor() {
    this.appState = new State();
    this.myTasks = new Tasks(this.appState.user.login);
    this.taskInputField = null;
    this.backlogList = null;
    this.backlogAddBtn = null;
    this.backlogSbmt = null;
    this.initializeApp();
  }


  async initializeApp() {
    this.appState = new State();
    await this.appState.fetchUser();
    if (this.appState.user && this.appState.user.login) {
      this.myTasks = new Tasks(this.appState.user.login);
      generateTestUser(User); // Создайте тестового пользователя
    } else {
      console.error("Ошибка при получении данных пользователя.");
    }
    this.setupLoginForm();
    this.initDragAndDrop();
    this.taskInputField = document.querySelector('.app-task-title_input');
    this.backlogList = document.querySelector('.app-list__backlog');
    this.setupEventHandlers();
  }
  
  setupLoginForm() {
    const loginForm = document.querySelector("#app-login-form");
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const login = formData.get("login");
      const password = formData.get("password");

      const fieldHTMLContent = authUser(login, password)
        ? taskFieldTemplate
        : noAccessTemplate;

      document.querySelector("#content").innerHTML = fieldHTMLContent;

      if (fieldHTMLContent !== '<h1>Sorry, you\'ve no access to this resource!</h1>') {
        // Вызывайте здесь необходимые действия для инициализации интерфейса
        this.initDragAndDrop();
        this.taskInputField = document.querySelector('.app-task-title_input');
        this.backlogList = document.querySelector('.app-list__backlog');
        this.setupEventHandlers();
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
          // Здесь выполните действия для перемещения задачи, например, обновление статуса задачи в данных и визуальном отображении
          this.moveTask(taskData, list);
        }
      });
    });

    // Настройка обработчиков событий для перетаскивания задачи внутри списка (порядок)
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
      { selector: '.app-container-backlog > .append-button', handler: this.startNewBacklogTask.bind(this) },
      { selector: '.app-container-ready > .append-button', handler: this.startNewReadyTask.bind(this) },
      { selector: '.app-container-progress > .append-button', handler: this.startNewInProgressTask.bind(this) },
      { selector: '.app-container-finished > .append-button', handler: this.startNewFinishedTask.bind(this) },
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
    // Создаем новый элемент списка задач
    const newTaskAsListElement = document.createElement('li');
    newTaskAsListElement.textContent = text;
    newTaskAsListElement.setAttribute('draggable', 'true');

    // Добавляем обработчик события для перетаскивания задачи
    newTaskAsListElement.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ status: list.id, text: text }));
    });

    // Добавляем обработчик события для завершения перетаскивания задачи
    newTaskAsListElement.addEventListener('dragend', () => {
      console.log('Перетаскивание задачи завершено.');
    });

    // Получаем первый дочерний элемент списка, если он существует
    const firstChild = list.firstElementChild;

    // Вставляем новую задачу перед первым дочерним элементом списка или в конец списка
    if (firstChild) {
      list.insertBefore(newTaskAsListElement, firstChild);
      console.log('list:', list);
    } else {
      list.appendChild(newTaskAsListElement);
      console.log('newTaskAsListElement:', newTaskAsListElement);
    }

    // Вызываем метод для записи задачи в класс Tasks
    if (list.id === 'backlog') {
      this.myTasks.writeBacklog(text);
    } else if (list.id === 'ready') {
      this.myTasks.writeReady(text);
    } else if (list.id === 'in-progress') {
      this.myTasks.writeInProgress(text);
    } else if (list.id === 'finished') {
      this.myTasks.writeFinished(text);
    }

    // Вызываем метод для инициализации перетаскивания и бросания задач
    initDragAndDrop();
  }
}

const app = new App();
app.init();




