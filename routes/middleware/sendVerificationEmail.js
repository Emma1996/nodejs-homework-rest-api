const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const { EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    // Define email options
    const mailOptions = {
      from: EMAIL_USERNAME,
      to: email,
      subject: "Confirmation of registration",
      html: `<p>Please, confirm your email <a href="http://localhost:3000/api/users/verify/${verificationToken}" target="_blank">${email}</a></p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  sendVerificationEmail,
};
