import express from 'express';
import multer from 'multer';
import { 
  uploadCropImage, 
  getAnalysisHistory, 
  getAnalysisById, 
  triggerEmailReport, 
  triggerSMSReport 
} from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';

// Setup multer for memory storage uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Supported formats: JPG, JPEG, PNG, WEBP.'));
    }
  }
});

const router = express.Router();

router.post('/upload', protect, upload.single('image'), uploadCropImage);
router.get('/history', protect, getAnalysisHistory);
router.get('/:id', protect, getAnalysisById);
router.post('/:id/email', protect, triggerEmailReport);
router.post('/:id/sms', protect, triggerSMSReport);

export default router;
