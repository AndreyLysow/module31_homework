export class LocalStorageManager {
    constructor() {}
  
    getTasksFromStorage(userid) {
      const data = localStorage.getItem(userid);
      return JSON.parse(data) || { backlog: [], ready: [], inProgress: [], finished: [] };
    }
  
    saveTasksToStorage(userid, tasks) {
      localStorage.setItem(userid, JSON.stringify(tasks));
    }
  
    removeTaskFromStorage(userid, taskId) {
      const tasks = this.getTasksFromStorage(userid);
  
      if (tasks) {
        for (const listName in tasks) {
          if (tasks.hasOwnProperty(listName)) {
            tasks[listName] = tasks[listName].filter((task) => task.id !== taskId);
          }
        }
  
        this.saveTasksToStorage(userid, tasks);
      }
    }
  }