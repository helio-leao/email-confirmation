import express from "express";
import Users from "../storage/Users";

const router = express.Router();

// for testing only
router.get("/", (_req, res) => {
  res.json(Users.getAll());
});

export default router;
