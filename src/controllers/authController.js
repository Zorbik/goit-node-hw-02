import fs from "fs/promises";

import {
  loginUser,
  logoutUser,
  registrateUser,
  subscriptionUser,
  avatarChanger,
} from "../services/authService.js";

export async function registrateUserController(req, res) {
  const { email, password } = req.body;
  const user = await registrateUser(email, password);
  res.status(201).json({ user, status: "201 Created" });
}

export async function loginUserController(req, res) {
  const { email, password } = req.body;
  const { token, respUser } = await loginUser(email, password);
  res.status(200).json({ status: "200 OK", token, user: respUser });
}

export async function logoutUserController(req, res) {
  const user = req.user;
  await logoutUser(user);
  res.status(204).json();
}

export async function currentUserController(req, res) {
  const { email, subscription } = req.user;
  const user = { email, subscription };
  res.status(200).json({ user });
}

export async function subscriptionController(req, res) {
  const data = await subscriptionUser(req.user.email, req.body);
  res
    .status(200)
    .json({ user: { email: data.email, subscription: data.subscription } });
}

export async function avatarChangerController(req, res) {
  const [fileName, extension] = req.file.originalname.split(".");
  const path = `./tmp/${fileName}.${extension}`;

  await fs.writeFile(path, req.file.buffer);

  await avatarChanger(req.user, path, extension);

  res.status(200).json({ status: "success" });
}
