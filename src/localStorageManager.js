export class LocalStorageManager {
  constructor() {}

  getTasksFromStorage(userid) {
    const data = localStorage.getItem(userid);
    return JSON.parse(data) || { backlog: [], ready: [], inProgress: [], finished: [] };
  }

  saveTasksToStorage(userid, tasks) {
    localStorage.setItem(userid, JSON.stringify(tasks));
  }

  addTask(userid, listName, task) {
    const tasks = this.getTasksFromStorage(userid);
    tasks[listName].push(task);
    this.saveTasksToStorage(userid, tasks);
  }

  removeTask(userid, taskId) {
    const tasks = this.getTasksFromStorage(userid);

    for (const listName in tasks) {
      if (tasks.hasOwnProperty(listName)) {
        tasks[listName] = tasks[listName].filter((task) => task.id !== taskId);
      }
    }

    this.saveTasksToStorage(userid, tasks);
  }

  moveTask(userid, taskId, sourceList, targetList) {
    const tasks = this.getTasksFromStorage(userid);

    const taskToMove = tasks[sourceList].find((task) => task.id === taskId);

    if (taskToMove) {
      // Remove the task from the source list
      tasks[sourceList] = tasks[sourceList].filter((task) => task.id !== taskId);

      // Add the task to the target list
      tasks[targetList].push(taskToMove);

      this.saveTasksToStorage(userid, tasks);
    }
  }
}