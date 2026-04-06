const express = require('express');
const { getAvailableSlots, bookSlot, getMyBookings, payFee, getLocations } = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.get('/locations', getLocations);
router.get('/slots', getAvailableSlots);

// Protected routes (authentication required)
router.use(verifyToken);
router.post('/book', bookSlot);
router.get('/bookings', getMyBookings);
router.post('/pay', payFee);

module.exports = router;
