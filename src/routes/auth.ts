import express from "express";
import Users from "../storage/Users";
import UserVerifications from "../storage/UserVerifications";
import sendVerificationEmail from "../services/emailService";

const router = express.Router();

router.post("/signup", (req, res) => {
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
    sendVerificationEmail({
      to: newUser.email,
      subject: "Verify Your Email",
      html: `
        <p>Verify your email address to complete de signup and login into your account</p>
        <p>This link <b>expires in 6 hours</b></p>
        <p>
          Press <a href=${
            process.env.BASE_URL +
            "/auth/verify/" +
            newUser.id +
            "/" +
            newUserVerification.uniqueString
          }>here</a> to proceed
        </p>
      `,
    });
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
