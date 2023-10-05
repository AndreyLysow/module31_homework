import { LocalStorageManager } from "../localStorageManager";

export class Tasks {
  constructor(login, maxTasksCount, localStorageManager) {
    this.userid = login;
    this.maxTasksCount = maxTasksCount;
    this.localStorageManager = localStorageManager;
    // this.taskId = taskId;
    this.taskLists = {
      backlog: [],
      ready: [],
      inProgress: [],
      finished: [],
    };

    this.loadTasksFromStorage();

       // Добавляем обработчик события перед выходом из сессии
       window.addEventListener('beforeunload', () => {
        this.saveTasksToStorage();
        // Добавляем всплывающее окно, чтобы сделать событие синхронным и предупредить пользователя
        alert('Задачи будут сохранены перед выходом.');
      });
  }
  loadTasksFromStorage() {
    const tasks = this.localStorageManager.getTasksFromStorage(this.userid);
    if (tasks) {
      this.taskLists = tasks;
    }
  }



 // Генерация уникального ID для задачи
 generateTaskId() {
  const timestamp = new Date().getTime(); // Получаем текущую временную метку
  const random = Math.random().toString(36).substring(2, 15); // Генерируем случайную строку
  return `${timestamp}-${random}`; // Соединяем временную метку и случайную строку
}


   // Добавление задачи
   addTaskToList(listName, task) {
    if (this.taskLists[listName]) {
      this.taskLists[listName].push(task);
      this.cleanUpTasks(listName);
      this.saveTasksToStorage();
      return true;
    }
    return false;
  }


// Сохранение задач в localStorage
saveTasksToStorage() {

  this.localStorageManager.removeTasksFromStorage(this.userid);
  this.localStorageManager.saveTasksToStorage(this.userid, this.taskLists);
}



loadTasksFromStorage() {
  const tasks = this.localStorageManager.getTasksFromStorage(this.userid);
  if (tasks) {
    this.taskLists = tasks;
  }
}


// removeTaskFromList(listName, taskId) {
//   const index = this.taskLists[listName].findIndex(task => task.id === taskId);
//   if (index !== -1) {
//     this.taskLists[listName].splice(index, 1);
//     this.saveTasksToStorage();
//   }
// }

removeTaskFromList(listName, taskId) {
  this.taskLists[listName] = this.taskLists[listName].filter(task => task.id !== taskId);
  this.saveTasksToStorage();
}


moveTask(taskId, fromState, toState) {
  const taskToMoveIndex = this.taskLists[fromState].findIndex(task => task.id === taskId);
  if (taskToMoveIndex !== -1) {
    const taskToMove = this.taskLists[fromState][taskToMoveIndex];
    taskToMove.state = toState;
    this.taskLists[toState].push(taskToMove);
    this.taskLists[fromState].splice(taskToMoveIndex, 1); // Удаляем задачу из fromState
    this.saveTasksToStorage(); // Сохраняем изменения в локальном хранилище
    this.removeTaskFromStorage(taskId, fromState); // Удаляем задачу из предшествующего поля
  }
}

removeTaskFromStorage(taskId, fromState) {
  this.localStorageManager.removeTask(this.userid, taskId, fromState);
}

 
 

    // Обновление состояния задачи
    updateTaskState(taskId, newState) {
      const taskToUpdate = this.findTaskById(taskId);
      if (taskToUpdate) {
        taskToUpdate.state = newState;
        this.saveTasksToStorage();
      }
    }
  
   
findTaskById(taskId, state) {
  return this.taskLists[state].find(task => task.id === taskId);
}

  getTasksFromList(listName) {
    return this.taskLists[listName] || [];
  }

  cleanUpTasks(listName) {
    if (this.taskLists[listName].length > this.maxTasksCount) {
      this.taskLists[listName] = this.taskLists[listName].slice(-this.maxTasksCount);
    }
  }



  writeBacklog(taskText) {
    const taskId = this.generateTaskId(); // Генерируем уникальный ID для задачи
    const task = { id: taskId, text: taskText }; // Создаем объект задачи
  
    // Создаем массив с задачей для удаления
    const tasksToRemove = [taskId];
  
    // Удаляем задачи из предыдущего состояния (если есть)
    this.localStorageManager.removeTasksFromStorage(this.userid, tasksToRemove);
  
    // Добавляем задачу в "backlog"
    this.addTaskToList('backlog', task);
  
    // Обновляем элементы интерфейса
    let readyItemCandidates = document.querySelector('.app-ready-items > .app-select__list > .app-selection-marker');
    let readyItemCandidateNewOpt = document.createElement('option');
    readyItemCandidateNewOpt.textContent = taskText;
    readyItemCandidates.appendChild(readyItemCandidateNewOpt);
    document.querySelector('.app-container-ready > .append-button').disabled = false;
    redrawSelect('.app-ready-items');
  }
  
  
  
  writeBacklog(taskText) {
    const taskId = this.generateTaskId(); // Генерируем уникальный ID для задачи
    const task = { id: taskId, text: taskText }; // Создаем объект задачи
  
    // Создаем массив с задачей для удаления
    const tasksToRemove = [taskId];
  console.log(tasksToRemove,task)
    // Удаляем задачи из предыдущего состояния (если есть)
    this.localStorageManager.removeTasksFromStorage(this.userid, tasksToRemove);
    this.localStorageManager.removeTasksFromStorage(this.userid, tasksToRemove);
    // Добавляем задачу в "backlog"
    this.addTaskToList('backlog', task);
  
    // Обновляем элементы интерфейса
    let readyItemCandidates = document.querySelector('.app-ready-items > .app-select__list > .app-selection-marker');
    let readyItemCandidateNewOpt = document.createElement('option');
    readyItemCandidateNewOpt.textContent = taskText;
    readyItemCandidates.appendChild(readyItemCandidateNewOpt);
    document.querySelector('.app-container-ready > .append-button').disabled = false;
    redrawSelect('.app-ready-items');
  }
  
  
  
  writeInProgress(taskText, taskId) {
    const task = { id: taskId, text: taskText }; // Создаем объект задачи
  
    // Перед добавлением задачи в "inProgress", удаляем её из предыдущего состояния (если есть)
    this.removeTaskFromStorage(taskId);
  
    // Перемещаем задачу из "backlog" в "ready"
    this.moveTask(taskId, 'inProgress', 'finished');
    // this.addTaskToList('inProgress', task);
  
    // Обновляем элементы интерфейса
    let inProgressItemCandidates = document.querySelector('.app-finished-items > .app-select__list > .app-selection-marker');
    let inProgressItemCandidateNewOpt = document.createElement('option');
    inProgressItemCandidateNewOpt.textContent = taskText;
    inProgressItemCandidates.appendChild(inProgressItemCandidateNewOpt);
    document.querySelector('.app-container-finished > .append-button').disabled = false;
    redrawSelect('.app-progress-items');
    redrawSelect('.app-finished-items');
  }
  

  // Метод для удаления задачи из списка "backlog"
  removeFromBacklog(taskId) {
    this.removeTaskFromList('backlog', taskId);
  }

  // Метод для удаления задачи из списка "ready"
  removeFromReady(taskId) {
    this.removeTaskFromList('ready', taskId);
  }

  // Метод для удаления задачи из списка "inProgress"
  removeFromInProgress(taskId) {
    this.removeTaskFromList('inProgress', taskId);
  }

  // Метод для удаления задачи из списка "finished"
  removeFromFinished(taskId) {
    this.removeTaskFromList('finished', taskId);
  }
}


function redrawSelect(select) {
  const x = document.querySelector(select).getElementsByClassName('app-select__list');
  const elemsToDel = document.querySelector(select).querySelectorAll('.select-selected, .select-hide');

  elemsToDel.forEach(el => el.remove());

  for (let i = 0; i < x.length; i++) {
    const selElmnt = x[i].getElementsByTagName("select")[0];
    const a = document.createElement('div');
    a.classList.add('select-selected');
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);

    const b = document.createElement('div');
    b.classList.add('select-items', 'select-hide');
    for (let j = 0; j < selElmnt.length; j++) {
      const c = document.createElement('div');
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener('click', function (e) {
        const s = this.parentNode.parentNode.querySelector('.app-selection-marker');
        const h = this.parentNode.previousSibling;
        for (let i = 0; i < s.options.length; i++) {
          if (s.options[i].innerHTML === this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            const y = this.parentNode.getElementsByClassName('same-as-selected');
            Array.from(y).forEach(el => el.removeAttribute('class'));
            this.classList.add('same-as-selected');
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);

    a.addEventListener('click', function (e) {
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle('select-hide');
      this.classList.toggle('select-arrow-active');
    });
  }
}

export function closeAllSelect(elmnt) {
  const x = document.getElementsByClassName('select-items');
  const y = document.getElementsByClassName('select-selected');

  Array.from(y).forEach(el => el.classList.remove('select-arrow-active'));

  for (let i = 0; i < x.length; i++) {
    if (x[i].parentNode !== elmnt.nextSibling) {
      x[i].classList.add('select-hide');
    }
  }
}