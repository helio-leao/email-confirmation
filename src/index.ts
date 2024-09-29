import express from "express";
import nodemailer from "nodemailer";
import User from "./types/User";
import UserVerification from "./types/UserVerification";

const app = express();
app.use(express.json());

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
let userVerifications: UserVerification[] = [];

app.post("/users/signup", (req, res) => {
  const newUser: User = {
    id: crypto.randomUUID(),
    email: req.body.email,
    password: req.body.password,
    verified: false,
  };

  users.push(newUser);

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

app.get("/users/verify/:userId/:uniqueString", (req, res) => {
  const userVerification = userVerifications.find(
    ({ userId }) => userId === req.params.userId
  );

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
    removeUserVerification(userId);
    return;
  }

  if (uniqueString !== req.params.uniqueString) {
    res.status(401).json({
      ok: false,
      message: "Unique string invalid",
    });
    return;
  }

  updateVerifiedUser(userId);
  removeUserVerification(userId);

  res.json({
    ok: true,
    message: "User verified",
  });
});

function updateVerifiedUser(userId: string) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === userId) {
      users[i].verified = true;
      break;
    }
  }
}

function removeUserVerification(userId: string) {
  userVerifications = userVerifications.filter(
    (userVerification) => userVerification.userId !== userId
  );
}

function sendVerificationEmail(user: User) {
  const { id, email } = user;

  const currentUrl = "http://localhost:3000";
  const uniqueString = crypto.randomUUID() + user.id;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email address to complete de signup and login into your account</p><p>This link <b>expires in 6 hours</b></p><p>Press <a href=${
      currentUrl + "/users/verify/" + id + "/" + uniqueString
    }>here</a> to proceed</p>`,
  };

  userVerifications.push({
    userId: id,
    uniqueString: uniqueString,
    createdAt: Date.now(),
    expiresAt: Date.now() + 21600000, //Note: 6 hours ahead
  });

  try {
    transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}

// testing
app.get("/users", (req, res) => {
  res.json(users);
});

// testing
app.get("/userVerifications", (req, res) => {
  res.json(userVerifications);
});

app.listen(3000, () => console.log("Server runing"));
