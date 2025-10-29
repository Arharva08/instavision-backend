const nodemailer = require('nodemailer');

// Email configuration - these should be set in environment variables
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

/**
 * Send registration email with random password
 * @param {string} to - Recipient email
 * @param {string} fullName - User's full name
 * @param {string} password - Randomly generated password
 * @param {string} regNo - Registration number
 * @returns {Promise<boolean>} - Success status
 */
const sendRegistrationEmail = async (to, fullName, password, regNo) => {
  try {
    const mailOptions = {
      from: `"InstaVision" <${emailConfig.auth.user}>`,
      to: to,
      subject: 'Welcome to InstaVision - Your Account Details',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to InstaVision!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your account has been successfully created</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">Hello ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Your account has been successfully registered with InstaVision. Below are your login credentials:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Account Information</h3>
              <p style="margin: 8px 0;"><strong>Registration Number:</strong> <span style="color: #667eea; font-family: monospace;">${regNo}</span></p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <span style="color: #667eea;">${to}</span></p>
              <p style="margin: 8px 0;"><strong>Password:</strong> <span style="color: #667eea; font-family: monospace; background: #f8f9fa; padding: 4px 8px; border-radius: 4px;">${password}</span></p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>Important:</strong> Please change your password after your first login for security purposes.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Login to Your Account
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Registration email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending registration email:', error);
    return false;
  }
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} fullName - User's full name
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} - Success status
 */
const sendPasswordResetEmail = async (to, fullName, newPassword) => {
  try {
    const mailOptions = {
      from: `"InstaVision" <${emailConfig.auth.user}>`,
      to: to,
      subject: 'InstaVision - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Password Reset</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your password has been reset</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">Hello ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Your password has been successfully reset. Here are your new login credentials:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">New Login Information</h3>
              <p style="margin: 8px 0;"><strong>Email:</strong> <span style="color: #667eea;">${to}</span></p>
              <p style="margin: 8px 0;"><strong>New Password:</strong> <span style="color: #667eea; font-family: monospace; background: #f8f9fa; padding: 4px 8px; border-radius: 4px;">${newPassword}</span></p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>Security Note:</strong> Please change your password after logging in for better security.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Login with New Password
              </a>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

module.exports = {
  sendRegistrationEmail,
  sendPasswordResetEmail
};
