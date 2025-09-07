const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // e.g., smtp.gmail.com
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,                    // STARTTLS on 587
  auth: {
    user: process.env.SMTP_USER,    // your Gmail address
    pass: process.env.SMTP_PASS,    // your Gmail App Password
  },
});

async function sendWelcomeEmail({ to, name }) {
  const displayName = name || to.split("@")[0];

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #007bff; text-align: center;">Welcome to DashSphere, ${displayName}!</h2>
      <p>We’re thrilled to have you on board. DashSphere is your all-in-one smart dashboard, designed to give you real-time insights and powerful features at your fingertips.</p>
      <ul>
        <li>🌤 Live Weather Updates</li>
        <li>💰 Real-time Crypto Prices & Market Trends</li>
        <li>📊 Personalized Dashboard Widgets</li>
        <li>⚡ And hundreds of other productivity-enhancing features!</li>
      </ul>
      <p>Start exploring now and make the most out of DashSphere!</p>
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://your-app-website.com/dashboard" 
           style="padding: 12px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; display: inline-block;">
          Go to Dashboard
        </a>
      </p>
      <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
        © ${new Date().getFullYear()} DashSphere. All rights reserved.
      </p>
    </div>
  `;

  return transporter.sendMail({
    from: `"DashSphere" <${process.env.SMTP_USER}>`,
    to,
    subject: "🎉 Welcome to DashSphere!",
    html: htmlContent,
  });
}

module.exports = { transporter, sendWelcomeEmail };
