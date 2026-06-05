import express from 'express';
import { 
  getAllUsers, 
  deleteUser, 
  getAllReports, 
  deleteReport 
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/reports', protect, admin, getAllReports);
router.delete('/reports/:id', protect, admin, deleteReport);

export default router;
