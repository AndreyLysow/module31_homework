import { appState } from "../app";
import { User } from "../models/User";

export const authUser = function (login, password) {
  const user = new User(login, password);
  if (!user.hasAccess) return false;
  if (!user.role && user.hasAccess) {
    user.role = "user";
  }
  appState.currentUser = user;
  return user.role;
};

export const generateUsers = function(User) {
  localStorage.clear();
  const adminUser = {name: "admin", password: "qwerty123", role: "admin"};
  generarteUser(User, adminUser);
  const testUser = {name: "test", password: "123"};
  generarteUser(User, testUser);
};

const generarteUser = function (User, userData) {
  const user = new User(userData.name, userData.password, userData.role || "user");
  User.save(user);
};



export const logout = function() {
  appState.currentUser = null;
}