import express from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => console.log(`Server runing on port ${PORT}...`));
