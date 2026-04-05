const express = require('express');
const { getDashboardStats, getAllUsers, getAllBookings, getAllSlots, addSlot, deleteSlot, updateUserRole } = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken, isAdmin);
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/bookings', getAllBookings);
router.get('/slots', getAllSlots);
router.post('/slots', addSlot);
router.delete('/slots/:id', deleteSlot);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
