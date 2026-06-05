import CropAnalysis from '../models/CropAnalysis.js';
import Report from '../models/Report.js';
import { analyzeCropImage } from '../services/geminiService.js';
import { sendReportEmail } from '../services/emailService.js';
import { sendSMSAlert } from '../services/smsService.js';

// Uploads crop image, queries Gemini AI for path diagnostics, saves records, and fires async notifications
export const uploadCropImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file.' });
    }

    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // Run Gemini disease detection
    const aiResult = await analyzeCropImage(imageBuffer, mimeType);

    // Convert uploaded buffer to a base64 data URL for easy display in frontend
    const base64Image = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;

    // Create database entry for CropAnalysis
    const analysis = new CropAnalysis({
      userId: req.user._id,
      imageUrl: base64Image,
      cropName: aiResult.crop || 'Unknown Crop',
      disease: aiResult.disease || 'Healthy',
      severity: aiResult.severity || 'Low',
      confidence: aiResult.confidence || '0%',
      symptoms: aiResult.symptoms || [],
      causes: aiResult.causes || [],
      treatment: aiResult.treatment || [],
      prevention: aiResult.prevention || [],
      recommendations: aiResult.recommendations || {
        fertilizers: { organic: [], chemical: [], dosage: '' },
        irrigation: { waterQuantity: '', waterFrequency: '' },
        pestControl: { pesticides: [], organicAlternatives: [] },
        yieldTips: { soilManagement: '', nutrientManagement: '', cropRotation: '', mulching: '' },
        weatherPrecautions: { rainfallAlerts: '', temperatureRisks: '', humidityRisks: '' }
      }
    });

    const savedAnalysis = await analysis.save();

    // Generate Report entry
    const report = new Report({
      userId: req.user._id,
      analysisId: savedAnalysis._id,
      pdfUrl: '' // Generated on the fly by the client or stored later
    });
    await report.save();

    // Trigger asynchronous notifications
    // Email Notification
    sendReportEmail(req.user.email, req.user.name, savedAnalysis);

    // SMS notification for High severity diseases
    if (savedAnalysis.severity === 'High') {
      sendSMSAlert(req.user.name, null, savedAnalysis);
    }

    res.status(201).json(savedAnalysis);
  } catch (error) {
    console.error('Error in uploadCropImage controller:', error);
    res.status(500).json({ message: 'Failing to analyze image. Please try again later.', error: error.message });
  }
};

// Retrieves past diagnoses history for logged-in user with filters (crop, disease, severity, dates)
export const getAnalysisHistory = async (req, res) => {
  try {
    const { crop, disease, severity, startDate, endDate } = req.query;

    const query = { userId: req.user._id };

    if (crop) {
      query.cropName = { $regex: crop, $options: 'i' };
    }

    if (disease) {
      query.disease = { $regex: disease, $options: 'i' };
    }

    if (severity) {
      query.severity = severity;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const analyses = await CropAnalysis.find(query).sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch single analysis logs. Verifies ownership or admin authorization levels.
export const getAnalysisById = async (req, res) => {
  try {
    const analysis = await CropAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Crop analysis not found.' });
    }

    // Verify ownership or admin role
    if (analysis.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Re-triggers email report delivery for a specific scan directly from the frontend
export const triggerEmailReport = async (req, res) => {
  try {
    const analysis = await CropAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const emailSent = await sendReportEmail(req.user.email, req.user.name, analysis);
    if (emailSent) {
      res.json({ message: 'Report successfully emailed.' });
    } else {
      res.status(500).json({ message: 'Failed to send email report.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Re-triggers simulated SMS notification alerts to the user's phone
export const triggerSMSReport = async (req, res) => {
  try {
    const analysis = await CropAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const phone = req.body.phone || null;
    const smsData = await sendSMSAlert(req.user.name, phone, analysis);
    res.json({ message: 'SMS Alert dispatched successfully.', details: smsData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
