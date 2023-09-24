import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { logout, generateUser  } from "./services/auth";


export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
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
  console.log("выполняется функция");
  const adminButton = document.getElementById("app-User-Management");
  const adminPage = document.querySelector('.admin-page');
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
    adminPage.style.display = "block";
    showUserList();
    addNewUser();
  });
}
}

function showUserList () {
  const usersList = document.querySelector('.users-list');
  const users = getFromStorage('users');
  usersList.innerHTML = '';
  let user;
  for (let i =  0; i < users.length; i++) {
    user = document.createElement('p');
    user.className = 'user-list-item'
    user.innerText = `${i + 1}. Login: ${users[i].login}, Password: ${users[i].password}, Role: ${users[i].role}`
    usersList.appendChild(user);
  }
}

function  addNewUser () {
  const addUserForm = document.querySelector('#new-user-form');
  addUserForm.addEventListener("submit", listener);
  function listener(e) {
    e.preventDefault();
    const formData = new FormData(addUserForm);
    const userData = {name: formData.get("login"), password: formData.get("password"), role: formData.get("role")};
    generateUser(User, userData);
    addUserForm.childNodes[1].value = '';
    addUserForm.childNodes[3].value = '';
    addUserForm.childNodes[5].options[0].selected = "selected";
    showUserList();
  }
}


export function updateElementDisplay(element, display) {
  element.style.display = display;
}

export function toggleElementDisplay(element, display) {
  if (element.style.display === display) {
    element.style.display = 'none';
  } else {
    element.style.display = display;
  }
}


//удаление таска

// // Сначала отменяем стандартное контекстное меню браузера
// document.addEventListener('contextmenu', function (e) {
//   e.preventDefault();
  
//   // Затем создаем собственное контекстное меню
//   const contextMenu = document.createElement('div');
//   contextMenu.className = 'custom-context-menu';
  
//   // Добавляем элементы контекстного меню (например, "Удалить")
//   const deleteOption = document.createElement('div');
//   deleteOption.textContent = 'Удалить';
//   deleteOption.className = 'context-menu-item';
  
//   // Обработчик события для элемента "Удалить"
//   deleteOption.addEventListener('click', function () {
//     // Вызываем вашу функцию удаления или выполняем другие действия
//     console.log('Выполняется удаление...');
    
//     // Закрываем контекстное меню
//     contextMenu.remove();
//   });
  
//   // Добавляем элементы в контекстное меню
//   contextMenu.appendChild(deleteOption);
  
//   // Позиционируем контекстное меню в месте щелчка правой кнопкой мыши
//   contextMenu.style.left = `${e.pageX}px`;
//   contextMenu.style.top = `${e.pageY}px`;
  
//   // Добавляем контекстное меню на страницу
//   document.body.appendChild(contextMenu);
  
//   // Обработчик события для закрытия контекстного меню при клике вне него
//   document.addEventListener('click', function () {
//     contextMenu.remove();
//   });
  
//   // Закрываем контекстное меню при клике правой кнопкой мыши вне него
//   document.addEventListener('contextmenu', function () {
//     contextMenu.remove();
//   });
// });


