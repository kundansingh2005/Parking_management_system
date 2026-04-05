const express = require('express');
const { getAvailableSlots, bookSlot, getMyBookings, payFee } = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);
router.get('/locations', getLocations);
router.get('/slots', getAvailableSlots);
router.post('/book', bookSlot);
router.get('/bookings', getMyBookings);
router.post('/pay', payFee);

module.exports = router;
