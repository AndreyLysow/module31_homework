export class State {
  constructor() {
    this.currentUser = null;
  }

  set currentUser(user) {
    this._currentUser = user;
  }

  get currentUser() {
    return this._currentUser;
  }

  async fetchUser() {
    try {
      // Замените 'ваш_URL_для_получения_пользователя' на корректный URL-адрес для получения пользователя
      const response = await fetch('ваш_URL_для_получения_пользователя');

      if (response.status === 200) { // Проверка успешного ответа (статус 200 OK)
        const user = await response.json();
        this.currentUser = user;
        console.log('Пользователь успешно загружен:', user);
      } else if (response.status === 404) { // Пользователь не найден (статус 404 Not Found)
        console.error('Пользователь не найден');
      } else { // Обработка других статусов ответа
        console.error('Произошла ошибка при получении пользователя. Статус:', response.status);
      }
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
  }
}


