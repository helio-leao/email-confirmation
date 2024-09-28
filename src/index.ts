import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("works");
});

app.listen(3000, () => console.log("server runing"));
