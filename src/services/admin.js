export const renderAdminMenuItems = function () {
    const navBarNav = document.querySelector(".navbar-nav");
    const adminMenu = ['Users', 'All Tasks'];
    const menuIds = ['users-page', 'tasks-page'];
    let i = 0;
    adminMenu.forEach(element => {
      const li = document.createElement("li");
      const navLink = document.createElement("a");
      li.className = "nav-item admin-menu-item";
      navLink.className = "nav-link";
      navLink.id = menuIds[i];
      i++;
      navLink.href = "#";
      navLink.innerText = element;
      navBarNav.appendChild(li).appendChild(navLink);
    });
  };
  
  export const removeAdminMenuItems = function () {
    if (appState.currentUser.role === "admin") {
      const navBarNav = document.querySelector(".navbar-nav");
      const adminMenuItems = document.querySelectorAll(".admin-menu-item");
      if (adminMenuItems.length > 0) {
        adminMenuItems.forEach(item => navBarNav.removeChild(item));
      }
    }
  };
  
  export const menuEventsHandler = function () {
    const templatesByMenuIds = {
      "navbar-brand": taskFieldTemplate,
      home: taskFieldTemplate,
      "users-page": adminPageUsersTemplate,
      "tasks-page": adminPageUsersTasksTemplate
    };
    const headerNav = document.querySelector("nav ul");
    let menuItems = document.querySelectorAll("nav a");
    addMenuEventListener();
    removeMenuEventListener();
    let config = { childList: true };
    const callback = function (mutationList) {
      menuItems = document.querySelectorAll("nav a");
      addMenuEventListener();
      removeMenuEventListener();
    };
    let observer = new MutationObserver(callback);
    observer.observe(headerNav, config);
  
    function addMenuEventListener() {
      for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener("click", menuEventListener);
      }
    }
  
    function menuEventListener(e) {
      e.preventDefault();
      menuItems.forEach(item => {
        if (!e.target.classList.contains("navbar-brand")) {
          item.classList.remove("active");
        } else {
          item.classList.remove("active");
          item.id === "home" ? item.classList.add("active") : '';
        }
      });
      e.target.classList.add("active");
      fieldHTMLContent.innerHTML = templatesByMenuIds[e.target.id];
      if (e.target.id === "users-page") {
        showUserList();
        addNewUser();
      }
    }
  
    function removeMenuEventListener() {
      for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].removeEventListener("click", menuEventListener, true);
      }
    }
  };
  
  const addNewUser = function () {
    const addUserForm = document.querySelector('#new-user-form');
    addUserForm.addEventListener("submit", listener);
    function listener(e) {
      e.preventDefault();
      const formData = new FormData(addUserForm);
      const userData = { name: formData.get("login"), password: formData.get("password"), role: formData.get("role") };
      generarteUser(User, userData);
      addUserForm.childNodes[1].value = '';
      addUserForm.childNodes[3].value = '';
      addUserForm.childNodes[5].options[0].selected = "selected";
      showUserList();
    }
  };
  
  export const generarteUser = function (User, userData) {
    const user = new User(userData.name, userData.password, userData.role || "user");
    User.save(user);
  };
  
  const showUserList = function () {
    const usersList = document.querySelector('.users-list');
    const users = getFromStorage('users');
    usersList.innerHTML = '';
    let user;
    for (let i = 0; i < users.length; i++) {
      user = document.createElement('p');
      user.className = 'user-list-item';
      user.innerText = `${i + 1}. Login: ${users[i].login}, Password: ${users[i].password}, Role: ${users[i].role}`;
      usersList.appendChild(user);
    }
  };