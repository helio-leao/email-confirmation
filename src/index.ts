import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import User from "./types/User";

const app = express();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});
transporter.verify((error, success) => {
  if (success) {
    return console.log("Ready for messages");
  }
  console.error(error);
});

const users: User[] = [];

app.get("/users", (req: Request, res: Response) => {
  res.json(users);
});

app.post("/users/signup", (req: Request, res: Response) => {
  users.push({
    id: crypto.randomUUID(),
    user: req.body.user,
    pass: req.body.pass, //TODO: encript with crypto??
    verified: false,
  });

  //TODO: send verification email
});

app.listen(3000, () => console.log("Server runing"));
