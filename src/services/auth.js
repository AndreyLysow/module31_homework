<<<<<<< HEAD
import { appState } from "../app.old";
=======
import { appState } from "../app";
>>>>>>> origin/main
import { User } from "../models/User";

export const authUser = function (login, password) {
  const user = new User(login, password);
  if (!user.hasAccess) return false;
  appState.currentUser = user;
  return true;
};
