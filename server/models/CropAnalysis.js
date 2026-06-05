import mongoose from 'mongoose';

const cropAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  cropName: {
    type: String,
    required: true,
  },
  disease: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  confidence: {
    type: String,
    required: true,
  },
  symptoms: {
    type: [String],
    default: [],
  },
  causes: {
    type: [String],
    default: [],
  },
  treatment: {
    type: [String],
    default: [],
  },
  prevention: {
    type: [String],
    default: [],
  },
  recommendations: {
    fertilizers: {
      organic: { type: [String], default: [] },
      chemical: { type: [String], default: [] },
      dosage: { type: String, default: '' },
    },
    irrigation: {
      waterQuantity: { type: String, default: '' },
      waterFrequency: { type: String, default: '' },
    },
    pestControl: {
      pesticides: { type: [String], default: [] },
      organicAlternatives: { type: [String], default: [] },
    },
    yieldTips: {
      soilManagement: { type: String, default: '' },
      nutrientManagement: { type: String, default: '' },
      cropRotation: { type: String, default: '' },
      mulching: { type: String, default: '' },
    },
    weatherPrecautions: {
      rainfallAlerts: { type: String, default: '' },
      temperatureRisks: { type: String, default: '' },
      humidityRisks: { type: String, default: '' },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CropAnalysis = mongoose.model('CropAnalysis', cropAnalysisSchema);

export default CropAnalysis;
