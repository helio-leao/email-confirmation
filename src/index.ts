import express, { Request, Response } from "express";

const app = express();

type User = {
  id: String;
  username: String;
  password: String;
  verified: Boolean;
};

type UserVerification = {
  userId: String;
  uniqueString: String;
  createdAt: Date;
  spiresAt: Date;
};

const users: User[] = [];

app.get("/", (req: Request, res: Response) => {
  res.json(users);
});

app.listen(3000, () => console.log("server runing"));
