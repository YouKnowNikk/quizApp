import nodemailer from 'nodemailer'
const pass = process.env.pass
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'nikeshgupta130@gmail.com',
      pass: pass,
    },
  });
const sendOTPByEmail = async (email, otp, fullName) => {
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP',
      text: `Hi ${fullName} , Your OTP is: ${otp}. It will expire in 10 minutes.`,
    }
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending OTP email:', error);
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  export {generateOTP ,sendOTPByEmail}