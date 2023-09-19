import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage } from "../utils";

export class User extends BaseModel {
  constructor(login, password) {
    super();
    this.login = login;
    this.password = password;
    this.storageKey = "users";
  }

  async hasAccess() {
    try {
      const users = await getFromStorage(this.storageKey);
      if (users.length === 0) return false;
      for (const user of users) {
        if (user.login === this.login && user.password === this.password) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking access:", error);
      return false;
    }
  }

  static async save(user) {
    try {
      await addToStorage(user, user.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}


