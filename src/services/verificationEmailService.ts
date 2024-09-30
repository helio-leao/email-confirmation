import transporter from "../config/mailer";

const sendVerificationEmail = async (
  userId: string,
  email: string,
  uniqueString: string
) => {
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `
      <p>Verify your email address to complete de signup and login into your account</p>
      <p>This link <b>expires in 6 hours</b></p>
      <p>
        Press <a href=${
          process.env.BASE_URL + "/auth/verify/" + userId + "/" + uniqueString
        }>here</a> to proceed
      </p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

export default sendVerificationEmail;
