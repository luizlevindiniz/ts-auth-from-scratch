import User from "../models/User";
import Login from "../models/Login";
import UserHash from "../models/UserHash";

function instanceOfUser(object: any): object is User {
  const checkName = "name" in object && object.name;
  const checkUsername = "username" in object && object.username;
  const checkPassword = "password" in object && object.password;

  if (checkName && checkUsername && checkPassword) return true;
  return false;
}

function instanceOfLogin(object: any): object is Login {
  const checkUsername = "username" in object && object.username;
  const checkPassword = "password" in object && object.password;
  if (checkUsername && checkPassword) return true;
  return false;
}

function findUserByUsername(
  users: UserHash[],
  username: string
): UserHash | null {
  const userToFind = users.find((user) => user.username === username);
  if (!userToFind) return null;
  return userToFind;
}

export { instanceOfLogin, instanceOfUser, findUserByUsername };
