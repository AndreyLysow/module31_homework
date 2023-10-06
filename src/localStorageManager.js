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
    // Получаем все ключи из localStorage
    const keys = Object.keys(localStorage);

    // Фильтруем ключи, чтобы оставить только те, которые начинаются с userid
    const userKeys = keys.filter(key => key.startsWith(userid));

    // Удаляем задачи пользователя из localStorage
    userKeys.forEach(key => localStorage.removeItem(key));
  }
}

}
