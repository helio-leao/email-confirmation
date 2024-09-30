import transporter from "../config/mailer";
import UserVerifications from "../storage/UserVerifications";
import User from "../types/User";

const sendVerificationEmail = ({ id, email }: User) => {
  const currentUrl = "http://localhost:3000";
  const uniqueString = crypto.randomUUID() + id;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email address to complete de signup and login into your account</p><p>This link <b>expires in 6 hours</b></p><p>Press <a href=${
      currentUrl + "/users/verify/" + id + "/" + uniqueString
    }>here</a> to proceed</p>`,
  };

  UserVerifications.add({
    userId: id,
    uniqueString: uniqueString,
    createdAt: Date.now(),
    expiresAt: Date.now() + 21600000, // 6 hours ahead
  });

  try {
    transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

export default sendVerificationEmail;
