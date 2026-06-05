import nodemailer from 'nodemailer';

export const sendReportEmail = async (userEmail, userName, cropAnalysis) => {
  // If SMTP details are not configured, print to logs and succeed
  const smtpHost = process.env.SMTP_HOST || 'smtp.ethereal.email';
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  console.log(`[Email Service] Preparing email report for ${userName} (${userEmail})...`);

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
    // Ethereal mock account or log fallback
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'mock.farmer@ethereal.email',
        pass: 'mockpassword',
      },
    });
  }

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background-color: #346856; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">AgriVision AI Crop Health Report</h2>
      </div>
      <div style="padding: 20px; color: #333333; line-height: 1.6;">
        <p>Dear <strong>${userName}</strong>,</p>
        <p>Your agricultural crop analysis report is ready. Here are the key findings:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Crop Analyzed</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${cropAnalysis.cropName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Detected Diagnosis</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0; color: #d32f2f; font-weight: bold;">${cropAnalysis.disease}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Severity Level</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">
              <span style="padding: 2px 6px; border-radius: 4px; background-color: ${cropAnalysis.severity === 'High' ? '#ffebee' : cropAnalysis.severity === 'Medium' ? '#fff3e0' : '#e8f5e9'}; color: ${cropAnalysis.severity === 'High' ? '#c62828' : cropAnalysis.severity === 'Medium' ? '#ef6c00' : '#2e7d32'}; font-weight: bold;">
                ${cropAnalysis.severity}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Confidence Score</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${cropAnalysis.confidence}</td>
          </tr>
        </table>

        <h3 style="color: #346856; border-bottom: 2px solid #346856; padding-bottom: 5px;">Key Symptoms</h3>
        <ul>
          ${cropAnalysis.symptoms.map(s => `<li>${s}</li>`).join('')}
        </ul>

        <h3 style="color: #346856; border-bottom: 2px solid #346856; padding-bottom: 5px;">Immediate Treatment</h3>
        <ul>
          ${cropAnalysis.treatment.map(t => `<li>${t}</li>`).join('')}
        </ul>

        <p style="margin-top: 25px;">Please log in to your dashboard to download the complete PDF report containing fertilization guides, irrigation schedules, and weather precautions.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="background-color: #44ac5c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Dashboard</a>
        </div>
      </div>
      <div style="background-color: #f5f5f5; color: #777777; padding: 15px; text-align: center; font-size: 12px; border-top: 1px solid #e0e0e0;">
        <p>AgriVision AI Platform &copy; 2026. Empowering Sustainable Farming.</p>
      </div>
    </div>
  `;

  try {
    if (isMock) {
      console.log(`[Email Mock Service] Email sent successfully to ${userEmail} (Ethreal simulation). Content:`);
      console.log(`- Crop: ${cropAnalysis.cropName}, Disease: ${cropAnalysis.disease}, Severity: ${cropAnalysis.severity}`);
      return true;
    }

    await transporter.sendMail({
      from: `"AgriVision AI" <${smtpUser}>`,
      to: userEmail,
      subject: `AgriVision AI Crop Health Alert: ${cropAnalysis.disease} detected on ${cropAnalysis.cropName}`,
      html: emailHtml,
    });

    console.log(`[Email Service] Real email sent successfully to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('[Email Service] Error sending email:', error.message);
    // Return true anyway so as not to crash the backend app during uploads
    return false;
  }
};
