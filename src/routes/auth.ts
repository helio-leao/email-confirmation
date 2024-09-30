import express from "express";
import Users from "../storage/Users";
import UserVerifications from "../storage/UserVerifications";
import sendVerificationEmail from "../services/verificationEmailService";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const newUser = {
    id: crypto.randomUUID(),
    email: req.body.email,
    password: req.body.password,
    verified: false,
  };
  const newUserVerification = {
    userId: newUser.id,
    uniqueString: crypto.randomUUID(),
    expiresAt: Date.now() + 21600000, // 6 hours ahead
  };

  Users.add(newUser);
  UserVerifications.add(newUserVerification);

  try {
    await sendVerificationEmail(
      newUser.id,
      newUser.email,
      newUserVerification.uniqueString
    );
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

export default router;
