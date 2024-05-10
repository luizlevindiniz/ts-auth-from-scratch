import { Router } from "express";
import UserHash from "../models/UserHash";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import {
  instanceOfLogin,
  instanceOfUser,
  findUserByUsername,
} from "../utils/functions";

const authRouter = Router();
const storedUsers: UserHash[] = [];
const SECRET = "123";

authRouter.get("", (req, res) => {
  return res.status(200).json({ users: storedUsers });
});

authRouter.post("/signup", async (req, res) => {
  try {
    if (!instanceOfUser(req.body))
      return res.status(400).json({ error: "Invalid body!" });
    const { name, username, password } = req.body;

    if (findUserByUsername(storedUsers, username))
      return res.status(400).json({ error: "User already exist!" });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser: UserHash = {
      name: name,
      username: username,
      passwordHash: passwordHash,
      id: v4(),
    };

    storedUsers.push(newUser);

    return res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    if (!instanceOfLogin(req.body))
      return res.status(400).json({ error: "Invalid body!" });
    const { username, password } = req.body;

    const foundUser = findUserByUsername(storedUsers, username);
    if (!foundUser)
      return res.status(400).json({ error: "User does not exist!" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.passwordHash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    const userForToken = {
      username: foundUser.username,
      name: foundUser.name,
      id: foundUser.id,
    };

    const token = jwt.sign(userForToken, SECRET);
    return res
      .status(200)
      .send({ token, username: foundUser.username, name: foundUser.name });
  } catch (err) {
    console.log(err);
  }
});

export { authRouter };
