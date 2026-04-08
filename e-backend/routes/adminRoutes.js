import express from 'express';
import { 
    getAllUsers, 
    toggleApproveUser, 
    updateUserRole, 
    deleteUser, 
    getAdminStats, 
    updateSiteSettings,
    updateUserDetails
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected: Admin Only
router.get('/users', [verifyToken, isAdmin], getAllUsers);
router.put('/users/:id/approve', [verifyToken, isAdmin], toggleApproveUser);
router.put('/users/:id/role', [verifyToken, isAdmin], updateUserRole);
router.put('/users/:id', [verifyToken, isAdmin], updateUserDetails);
router.delete('/users/:id', [verifyToken, isAdmin], deleteUser);

// Phase 4: Analytics & Site Content
router.get('/stats', [verifyToken, isAdmin], getAdminStats);
router.put('/settings', [verifyToken, isAdmin], updateSiteSettings);

export default router;
