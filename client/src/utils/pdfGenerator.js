import { jsPDF } from 'jspdf';

/**
 * Generates a professional PDF report for crop analysis
 * @param {object} farmer - User object
 * @param {object} analysis - CropAnalysis object
 */
export const generatePDFReport = (farmer, analysis) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [52, 104, 86];    // #346856 (Deep Forest)
  const secondaryColor = [132, 129, 113]; // #848171 (Sage)
  const accentColor = [68, 172, 92];     // #44ac5c (Leaf Green)
  const textColor = [30, 41, 59];        // Slate 800

  // 1. PAGE HEADER / BANNER
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');

  // Draw a leaf icon (vector drawing)
  doc.setFillColor(...accentColor);
  doc.ellipse(25, 20, 8, 12, 'F');
  doc.setFillColor(...primaryColor);
  doc.ellipse(28, 20, 8, 12, 'F'); // overlay to make crescent leaf
  doc.setFillColor(255, 255, 255);
  doc.rect(20, 20, 10, 1); // leaf stem line

  // App Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('AgriVision AI', 38, 22);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Smart Crop Disease Diagnosis & Recommendation Engine', 38, 28);

  // Report Title Badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(140, 12, 55, 16, 2, 2, 'F');
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CROP HEALTH REPORT', 143, 19);
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text(`Date: ${new Date(analysis.createdAt || Date.now()).toLocaleDateString()}`, 143, 24);

  let y = 50;

  // 2. FARMER & ANALYSIS SUMMARY TABLE
  doc.setFillColor(245, 247, 245);
  doc.roundedRect(15, y, 180, 32, 1, 1, 'F');
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FARMER PROFILE', 20, y + 6);
  doc.text('DIAGNOSIS HIGHLIGHTS', 110, y + 6);

  doc.setDrawColor(220, 225, 220);
  doc.setLineWidth(0.3);
  doc.line(105, y + 2, 105, y + 30); // divider line

  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Name: ${farmer?.name || 'Farmer'}`, 20, y + 13);
  doc.text(`Location: ${farmer?.location || 'Not Specified'}`, 20, y + 19);
  doc.text(`Farm Size: ${farmer?.farmSize || 0} Acres`, 20, y + 25);

  doc.text(`Crop Type: ${analysis.cropName}`, 110, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.text(`Detected: ${analysis.disease}`, 110, y + 19);
  doc.setFont('helvetica', 'normal');
  
  // Severity pill
  doc.text('Severity:', 110, y + 25);
  const severity = analysis.severity || 'Low';
  if (severity === 'High') {
    doc.setFillColor(254, 226, 226); // red pill
    doc.setTextColor(220, 38, 38);
  } else if (severity === 'Medium') {
    doc.setFillColor(255, 243, 205); // yellow pill
    doc.setTextColor(217, 119, 6);
  } else {
    doc.setFillColor(209, 250, 229); // green pill
    doc.setTextColor(5, 150, 105);
  }
  doc.roundedRect(125, y + 21, 18, 5, 1, 1, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(severity, 127, y + 24.5);

  // Confidence
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Confidence: ${analysis.confidence}`, 150, y + 25);

  y += 40;

  // Helper to draw section title
  const drawSectionTitle = (title) => {
    doc.setFillColor(...primaryColor);
    doc.rect(15, y, 4, 6, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(title, 22, y + 5);
    y += 10;
  };

  // Helper to draw lists
  const drawList = (items, indent = 20) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...textColor);
    
    if (!items || items.length === 0) {
      doc.text('- None specified.', indent, y);
      y += 6;
      return;
    }

    items.forEach(item => {
      // Automatic text wrapping
      const lines = doc.splitTextToSize(`• ${item}`, 170);
      lines.forEach(line => {
        if (y > 275) {
          doc.addPage();
          y = 20; // reset y on new page
        }
        doc.text(line, indent, y);
        y += 5.5;
      });
    });
    y += 2;
  };

  // 3. AI ANALYSIS (Symptoms & Causes)
  drawSectionTitle('AI DIAGNOSTIC DETAILS');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Key Observed Symptoms:', 15, y);
  y += 5;
  drawList(analysis.symptoms);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Possible Biological & Environmental Causes:', 15, y);
  y += 5;
  drawList(analysis.causes);

  // 4. RECOMMENDATIONS (Treatment & Preventive Plan)
  drawSectionTitle('RECOMMENDED TREATMENT & PREVENTION PLAN');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Immediate Action / Treatment Options:', 15, y);
  y += 5;
  drawList(analysis.treatment);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Long-term Prevention & Cultural Control:', 15, y);
  y += 5;
  drawList(analysis.prevention);

  // Check if we need to add a page before starting the smart recommendations
  if (y > 200) {
    doc.addPage();
    y = 20;
  }

  // 5. SMART RECOMMENDATION ENGINE (Fertilizer & Irrigation)
  drawSectionTitle('SMART RECOMMENDATION ENGINE VALUES');
  
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, 180, 50, 1, 1, 'F');

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Fertilizer Suggestion', 20, y + 6);
  doc.text('Irrigation Scheduling', 110, y + 6);

  doc.setDrawColor(226, 232, 240);
  doc.line(105, y + 2, 105, y + 48);

  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const ferts = analysis.recommendations?.fertilizers || {};
  doc.text(`Organic: ${(ferts.organic || []).join(', ') || 'Compost'}`, 20, y + 13);
  doc.text(`Chemical: ${(ferts.chemical || []).join(', ') || 'Balanced NPK'}`, 20, y + 21);
  
  const dosageLines = doc.splitTextToSize(`Dosage: ${ferts.dosage || 'See package instructions'}`, 80);
  let dosageY = y + 29;
  dosageLines.forEach(l => {
    doc.text(l, 20, dosageY);
    dosageY += 5;
  });

  const irr = analysis.recommendations?.irrigation || {};
  doc.text(`Quantity: ${irr.waterQuantity || 'Standard root zone saturation'}`, 110, y + 13);
  doc.text(`Frequency: ${irr.waterFrequency || 'Depends on soil moisture'}`, 110, y + 21);

  const pest = analysis.recommendations?.pestControl || {};
  doc.text(`Pest Control: ${(pest.pesticides || []).join(', ') || 'No active pests'}`, 110, y + 29);
  doc.text(`Organic Alternatives: ${(pest.organicAlternatives || []).join(', ') || 'Neem oil spray'}`, 110, y + 37);

  y += 58;

  // 6. YIELD IMPROVEMENT TIPS
  const yieldTips = analysis.recommendations?.yieldTips || {};
  if (yieldTips.soilManagement || yieldTips.cropRotation) {
    if (y > 215) {
      doc.addPage();
      y = 20;
    }
    drawSectionTitle('YIELD ENHANCEMENT & SOIL HEALTH');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Soil Management:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(yieldTips.soilManagement || 'Maintain pH 6.0-6.8 and apply rich compost.', 48, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Crop Rotation:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(yieldTips.cropRotation || 'Rotate with legumes to restore nitrogen levels.', 48, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Mulching Advice:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(yieldTips.mulching || 'Apply 2 inches of organic straw mulching.', 48, y);
    y += 10;
  }

  // 7. FOOTER: MOCK SIGNATURE, QR CODE, AND TERMS
  y = Math.max(y, 250); // push to bottom of current page
  
  doc.setDrawColor(200, 200, 200);
  doc.line(15, y, 195, y);

  // Draw Simulated QR Code (Grid of small boxes)
  const qrX = 15;
  const qrY = y + 4;
  doc.setFillColor(0, 0, 0);
  doc.rect(qrX, qrY, 22, 22); // outer border
  doc.setFillColor(255, 255, 255);
  doc.rect(qrX + 1.5, qrY + 1.5, 19, 19); // inner white border
  doc.setFillColor(0, 0, 0);
  // Drawing some mini grids to simulate a QR code
  doc.rect(qrX + 3, qrY + 3, 5, 5); // top-left anchor
  doc.rect(qrX + 14, qrY + 3, 5, 5); // top-right anchor
  doc.rect(qrX + 3, qrY + 14, 5, 5); // bottom-left anchor
  doc.rect(qrX + 10, qrY + 10, 2, 2);
  doc.rect(qrX + 6, qrY + 10, 2, 2);
  doc.rect(qrX + 10, qrY + 6, 2, 2);
  doc.rect(qrX + 14, qrY + 14, 3, 3);
  doc.setFillColor(255, 255, 255);
  doc.rect(qrX + 4.2, qrY + 4.2, 2.6, 2.6);
  doc.rect(qrX + 15.2, qrY + 4.2, 2.6, 2.6);
  doc.rect(qrX + 4.2, qrY + 15.2, 2.6, 2.6);

  doc.setTextColor(...secondaryColor);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Scan QR Code to access', qrX + 25, y + 10);
  doc.text('digital diagnostics online.', qrX + 25, y + 14);

  // Signature area
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryColor);
  doc.text('AgriVision Pathologist Board', 140, y + 10);
  
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(8);
  doc.text('Certified Agricultural AI System', 140, y + 15);
  
  doc.line(140, y + 20, 190, y + 20);

  return doc;
};
