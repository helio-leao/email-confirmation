import express from "express";
import Users from "../storage/Users";
import UserVerifications from "../storage/UserVerifications";
import sendVerificationEmail from "../services/verificationService";

const router = express.Router();

router.post("/signup", (req, res) => {
  const newUser = {
    id: crypto.randomUUID(),
    email: req.body.email,
    password: req.body.password,
    verified: false,
  };

  Users.add(newUser);

  try {
    sendVerificationEmail(newUser);
    res.json({
      ok: true,
      message: "Verification email sent",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Could not send verification email",
    });
  }
});

router.get("/verify/:userId/:uniqueString", (req, res) => {
  const userVerification = UserVerifications.find(req.params.userId);

  if (!userVerification) {
    res.status(404).json({
      ok: false,
      message: "Not found",
    });
    return;
  }

  const { userId, uniqueString, expiresAt } = userVerification;

  if (expiresAt < Date.now()) {
    res.status(401).json({
      ok: false,
      message: "Unique string expired",
    });
    UserVerifications.remove(userId);
    return;
  }

  if (uniqueString !== req.params.uniqueString) {
    res.status(401).json({
      ok: false,
      message: "Unique string invalid",
    });
    return;
  }

  Users.updateVerifiedUser(userId);
  UserVerifications.remove(userId);
  res.json({
    ok: true,
    message: "User verified",
  });
});

// for testing
router.get("/", (_req, res) => {
  res.json(Users.getAll());
});

export default router;
