import transporter from "../config/mailer";

const sendVerificationEmail = ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

export default sendVerificationEmail;
