import nodemailer from 'nodemailer';

export const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide all required fields: name, email, and message.' });
  }

  const smtpHost = process.env.SMTP_HOST || 'smtp.ethereal.email';
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  console.log(`[Contact Service] Processing message from ${name} (${email})...`);

  let transporter;
  let isMock = true;

  if (smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
    isMock = false;
  } else {
    // Ethereal mock or fallback configuration
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'mock.farmer@ethereal.email',
        pass: 'mockpassword',
      },
    });
  }

  const supportEmailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background-color: #346856; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">Support Inquiry Copy</h2>
      </div>
      <div style="padding: 20px; color: #333333; line-height: 1.6;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>We have received your support message and our team will get back to you shortly. Below is a copy of your inquiry details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold; width: 30%;">Name</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Email</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${email}</td>
          </tr>
        </table>

        <h3 style="color: #346856; border-bottom: 2px solid #346856; padding-bottom: 5px;">Your Message</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #346856; margin: 15px 0; font-style: italic;">
          ${message.replace(/\n/g, '<br />')}
        </div>
        
        <p style="margin-top: 25px; font-size: 13px; color: #666;">This is an automated copy of your message sent to AgriVision AI Support.</p>
      </div>
      <div style="background-color: #f5f5f5; color: #777777; padding: 15px; text-align: center; font-size: 12px; border-top: 1px solid #e0e0e0;">
        <p>AgriVision AI Platform &copy; 2026. Empowering Sustainable Farming.</p>
      </div>
    </div>
  `;

  try {
    if (isMock) {
      console.log(`[Contact Mock Service] Simulated email sent to support@agrivisionai.com and user copy to ${email} (Ethereal simulation). Content:`);
      console.log(`- Sender: ${name} <${email}>`);
      console.log(`- Message: ${message}`);
      return res.status(200).json({ message: 'Message sent successfully (Ethereal simulation).' });
    }

    await transporter.sendMail({
      from: `"AgriVision Support" <${smtpUser}>`,
      to: `support@agrivisionai.com, ${email}`,
      replyTo: email,
      subject: `AgriVision AI Support Inquiry Copy: ${name}`,
      html: supportEmailHtml,
    });

    console.log(`[Contact Service] Real email sent successfully to support and user copy to ${email}`);
    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('[Contact Service] Error sending email:', error.message);
    return res.status(500).json({ message: 'Failed to send message. Please try again later.', error: error.message });
  }
};
