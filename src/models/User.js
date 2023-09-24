import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage } from "../utils";

export class User extends BaseModel {
  constructor(login, password, role) {
    super();
    this.login = login;
    this.password = password;
    this.role = role;
    this.storageKey = "users";
  }
  
  get hasAccess() {
    const users = getFromStorage(this.storageKey);
    if (users.length === 0) return false;
    for (const user of users) {
      if (user.login === this.login && user.password === this.password) {
        this.role = user.role;
        this.id = user.id;
        return true;
      }
    }
    return false;
  }

  static save(user) {
    try {
      addToStorage(user, user.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}

