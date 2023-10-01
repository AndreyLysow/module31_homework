export class LocalStorageManager {
  constructor() {}

  getTasksFromStorage(userid) {
    const data = localStorage.getItem(userid);
    return JSON.parse(data) || { backlog: [], ready: [], inProgress: [], finished: [] };
  }

  saveTasksToStorage(userid, tasks) {
    localStorage.setItem(userid, JSON.stringify(tasks));
  }

  removeTasksFromStorage(userid) {
    localStorage.removeItem(userid);

  

  }
}


