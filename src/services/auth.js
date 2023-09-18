import { User } from "../models/User";

export const authUser = function (login, password, appInstance) {
  const user = new User(login, password);
  if (!user.hasAccess) return false;
  appInstance.setCurrentUser(user); // Установка текущего пользователя
  return true;
};
