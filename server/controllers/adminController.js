import User from '../models/User.js';
import CropAnalysis from '../models/CropAnalysis.js';

// Fetch all registered users in the platform (excluding password hashes) sorted by date
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deletes user along with their historic scans and PDF report references from database
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin' && (await User.countDocuments({ role: 'admin' })) <= 1) {
      return res.status(400).json({ message: 'Cannot delete the last administrator.' });
    }

    // Delete user's crop analyses and user account
    await CropAnalysis.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({ message: 'User and all associated data deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch crop pathology logs list across all platform users
export const getAllReports = async (req, res) => {
  try {
    const reports = await CropAnalysis.find({})
      .populate('userId', 'name email location')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deletes specific scan diagnosis report from general catalog database
export const deleteReport = async (req, res) => {
  try {
    const analysis = await CropAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await CropAnalysis.findByIdAndDelete(analysis._id);

    res.json({ message: 'Crop analysis report deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


