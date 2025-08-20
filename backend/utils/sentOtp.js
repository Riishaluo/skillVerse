const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'riishaluo@gmail.com',
    pass: 'frmqbhvublbhofcv'
  }
})

const sendOtp = async (email, otp) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif background-color: #f6f9fc padding: 20px">
      <div style="max-width: 500px margin: auto background: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
        
        <h2 style="text-align: center; color: #2563eb; margin-bottom: 10px;">SkillVerse</h2>
        <p style="text-align: center; font-size: 14px; color: #6b7280;">
          Your gateway to learning and skill mastery.
        </p>

        <hr style="border: none; height: 1px; background-color: #e5e7eb; margin: 20px 0;">

        <p style="font-size: 16px; color: #374151;">
          Hello,
        </p>
        <p style="font-size: 16px; color: #374151;">
          Your OTP code for <strong>SkillVerse</strong> is:
        </p>

        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; font-size: 24px; letter-spacing: 4px; font-weight: bold;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #6b7280;">
          This code will expire in <strong>5 minutes</strong>. Please do not share it with anyone for your account’s safety.
        </p>

        <hr style="border: none; height: 1px; background-color: #e5e7eb; margin: 20px 0;">

        <p style="font-size: 12px; color: #9ca3af; text-align: center;">
          &copy; ${new Date().getFullYear()} SkillVerse. All rights reserved.
        </p>

      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"SkillVerse" <riishaluo@gmail.com>',
    to: email,
    subject: 'Your OTP Code - SkillVerse',
    text: `Your OTP for SkillVerse is ${otp}. It will expire in 5 minutes.`,
    html: htmlContent
  });
}

module.exports = sendOtp
