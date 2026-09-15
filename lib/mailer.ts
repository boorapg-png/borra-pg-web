import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in', // Use smtp.zoho.com if your Zoho account is not on the Indian data center
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_APP_PASSWORD,
  },
});

export const sendWelcomeEmail = async (email: string, name: string, password: string) => {
  const mailOptions = {
    from: `"Boora PG" <${process.env.ZOHO_EMAIL}>`,
    to: email,
    subject: 'Welcome to Boora PG - Your Tenant Portal Login',
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #1a237e;">Welcome to Boora PG, ${name}!</h2>
        <p>Your tenant profile has been successfully created. You can now log in to the Tenant Portal to view your rent ledger, roommates, and submit maintenance requests.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Login URL:</strong> <a href="https://boorapg.com/tenant/login">boorapg.com/tenant/login</a></p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0;"><strong>Temporary Password:</strong> <span style="background: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-family: monospace;">${password}</span></p>
        </div>
        <p style="color: #666; font-size: 14px;">For security reasons, please change your password after your first login.</p>
        <p>Best Regards,<br/><strong>The Boora PG Team</strong></p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};