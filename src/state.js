export class State {
  constructor() {
    this._currentUser = null;
  }

  get currentUser() {
    return this._currentUser;
  }

  set currentUser(user) {
    this._currentUser = user;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }
}