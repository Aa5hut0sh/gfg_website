import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


export const sendOtpEmail = async (toEmail: string, otpCode: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your RGIPT GFG Platform Verification Code",
    html: `
      <h2>Account Verification</h2>
      <p>Your OTP for registration is: <strong>${otpCode}</strong></p>
      <p>This code is valid for 10 minutes. <strong>Do not share it with anyone</strong>.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};