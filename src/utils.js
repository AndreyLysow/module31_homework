import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { logout, generateUser  } from "./services/auth";
import { User } from "./models/User";


export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};



export const getTasksFromStorage = function (user, listNum) {
  let allTasks = JSON.parse(localStorage.getItem("task") || "[]");
  let returnList = [];

  allTasks.forEach(element => {
    if (element.user == user && element.type == listNum){
      returnList.push(element);
    };
  });
  return returnList;
};

//обновление статуса задачи при ёё переносе по спискам
export const updateInToStorage = function (objIdkey, objIdValue, key, param, value) {
  const storageData = getFromStorage(key);
  if(storageData !== null)
  {
    storageData.forEach(element => {
      if(element[objIdkey] == objIdValue)
      {
        element[param] = value;
        localStorage.setItem(key, JSON.stringify(storageData));
        return;
      };
    });
  }
};


// функция  для удаления элементов <li> (списковых элементов) на веб-странице, которые содержат указанный текстовый контент.
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


/**
 * Обработчик кнопки "Logout":
 * При клике на кнопку "Logout", функция вызывает logout() для выхода из учетной записи.
 * Затем она восстанавливает начальный контент (initialTemplate) и перезагружает страницу.
 */
export function logOutBtn() {
  const logoutForm = document.querySelector("#app-logout-btn");
  if (logoutForm) {
    logoutForm.addEventListener("click", function () {
      logout(); 
      location.reload();
    });
  }
}

export function adminUserBtn() {
  const adminButton = document.getElementById("app-User-Management");
  const adminPageElement = document.getElementById("adminPage");
  const closeAdminPageButton = document.querySelector(".admin-page > .close-admin-page");

  if (closeAdminPageButton) {
    closeAdminPageButton.addEventListener("click", function () {
      adminPageElement.style.display = "none";
    });
  }

  // Назначьте обработчик события на кнопку администратора
  if (adminButton) {
    adminButton.addEventListener("click", function () {
      adminPageElement.style.display = "block";
      showUserList();
      addNewUser();
    });
  }
}

function showUserList() {
  const users = getFromStorage('users');
  const usersListContainer = document.querySelector('.users-list'); // Используем контейнер .users-list

  if (!usersListContainer) {
    console.error('Контейнер .users-list не найден на странице.');
    return;
  }

  usersListContainer.innerHTML = ''; // Очищаем контейнер

  users.forEach((user, index) => {
    const userDiv = document.createElement('div');
    userDiv.className = 'user-list-item';

    const userInfo = document.createElement('p');
    userInfo.innerText = `${index + 1}. Login: ${user.login}, Password: ${user.password}, Role: ${user.role}`;

    const deleteUserButton = document.createElement('button');
    deleteUserButton.className = 'delete-user-button';
    deleteUserButton.innerText = 'delete';

    // Добавляем обработчик события для удаления пользователя
    deleteUserButton.addEventListener('click', function () {
      deleteUser(index); // Вызываем функцию удаления пользователя по индексу
    });
    userDiv.appendChild(userInfo);
    userDiv.appendChild(deleteUserButton);
    usersListContainer.appendChild(userDiv);
  });
}

  
function addNewUser() {
  const addUserForm = document.querySelector('#new-user-form');
  addUserForm.addEventListener("submit", listener);
  
  function listener(e) {
    e.preventDefault();
    const formData = new FormData(addUserForm);
    const userData = { name: formData.get("login"), password: formData.get("password"), role: formData.get("role") };
    generateUser(User, userData);
    addUserForm.childNodes[1].value = '';
    addUserForm.childNodes[3].value = '';
    addUserForm.childNodes[5].options[0].selected = "selected";
    showUserList();
  }
}

function deleteUser(index) {
  const users = getFromStorage('users');
  if (index >= 0 && index < users.length) {
    users.splice(index, 1); // Удаляем пользователя из массива
    localStorage.setItem('users', JSON.stringify(users)); // Обновляем хранилище
    showUserList(); // Обновляем список пользователей на странице
  }
}

export function updateElementDisplay(element, displayValue) {
  if (element) { // Проверяем, существует ли элемент
    element.style.display = displayValue;
  }
}

export function toggleElementDisplay(element, display) {
  if (element.style.display === display) {
    element.style.display = 'none';
  } else {
    element.style.display = display;
  }
}

export function countTasks() {
  const backlogTasksCounter = document.querySelector('.app-ready-tasks-counter');
  const finishedTasksCounter = document.querySelector('.app-finished-tasks-counter');
  const currentBacklogTasks = document.querySelectorAll('.app-list__backlog li').length;
  const currentFinishedTasks = document.querySelectorAll('.app-list__finished li').length;
  backlogTasksCounter.textContent = currentBacklogTasks;
  finishedTasksCounter.textContent = currentFinishedTasks;
}



