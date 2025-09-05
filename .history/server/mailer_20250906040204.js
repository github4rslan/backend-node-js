// server/mailer.js
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // smtp.gmail.com
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,                    // STARTTLS on 587
  auth: {
    user: process.env.SMTP_USER,    // your Gmail address
    pass: process.env.SMTP_PASS,    // the 16-char App Password
  },
});

export async function sendWelcomeEmail({ to, name }) {
  return transporter.sendMail({
    from: `"My App" <${process.env.SMTP_USER}>`, // must match your Gmail
    to,
    subject: "Welcome 🎉",
    html: `<p>Hi ${name || to}, welcome to <b>My App</b>!</p>`,
  });
}
