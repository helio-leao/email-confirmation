import express from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server runing on port ${process.env.PORT}...`)
);
