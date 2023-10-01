import { State } from "../state";
import { User } from "../models/User";
import { getFromStorage } from "../utils";
const appState = new State();

export const authUser = function (login, password) {
  const user = new User(login, password);
  if (!user.hasAccess) return false;
  if (!user.role && user.hasAccess) {
    user.role = "user";
  }
  return user.role;
};

export const generateUsers = function (User) {
  const existingUsers = getFromStorage('users');
  if (!existingUsers || existingUsers.length === 0) {
    // Если хранилище пустое, добавляем базовых пользователей
    const adminUser = { name: "admin", password: "qwerty123", role: "admin" };
    generateUser(User, adminUser);
    const testUser = { name: "test", password: "123" };
    generateUser(User, testUser);
  }
};

export const generateUser = function (User, userData) {
  const user = new User(userData.name, userData.password, userData.role || "user");
  User.save(user);
};



export const logout = function() {
  appState.currentUser = null;
}