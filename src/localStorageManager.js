export class LocalStorageManager {
  // Конструктор класса (если нужен)

  // Метод для получения задач из localStorage
  getTasksFromStorage(userid) {
    const data = localStorage.getItem(userid);
    return JSON.parse(data) || {
      backlog: [],
      ready: [],
      inProgress: [],
      finished: [],
    };
  }

  // Метод для сохранения задач в localStorage
  saveTasksToStorage(userid, taskLists) {
    // Здесь вы можете добавить проверку на существование userid и taskLists
    if (userid && taskLists) {
      localStorage.setItem(userid, JSON.stringify(taskLists));
    }
  }

  // Метод для удаления задач пользователя из localStorage
  removeTasksFromStorage(userid) {
    if (userid) {
      localStorage.removeItem(userid);
    }
  }
}
