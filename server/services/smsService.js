/**
 * Service to simulate SMS alerts for farmers
 * @param {string} userName 
 * @param {string} phoneNumber (optional)
 * @param {object} cropAnalysis 
 */
export const sendSMSAlert = async (userName, phoneNumber, cropAnalysis) => {
  const phone = phoneNumber || '+1 (555) 019-2834';
  const message = `AgriVision AI ALERT for ${userName}: High severity disease (${cropAnalysis.disease}) detected in your ${cropAnalysis.cropName} crop. Treatment recommendation: ${cropAnalysis.treatment[0] || 'Prune infected parts and apply organic alternatives'}. Check your email for the full report.`;

  console.log(`[SMS Service] Dispatching SMS to ${phone}...`);
  console.log(`----------------------------------------------`);
  console.log(`MESSAGE CONTENT:\n"${message}"`);
  console.log(`----------------------------------------------`);
  
  // Return true to indicate mock SMS sent successfully
  return {
    success: true,
    sentTo: phone,
    message: message,
    timestamp: new Date()
  };
};
