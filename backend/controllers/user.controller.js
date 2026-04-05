const db = require('../config/db');

exports.getAvailableSlots = async (req, res) => {
    try {
        const adminId = req.query.admin_id;
        const query = adminId ? "SELECT * FROM ParkingSlots WHERE status = 'available' AND admin_id = ?" : "SELECT * FROM ParkingSlots WHERE status = 'available' AND admin_id IS NOT NULL";
        const [slots] = await db.query(query, adminId ? [adminId] : []);
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching slots', error });
    }
};

exports.getLocations = async (req, res) => {
    try {
        // Fetch all admins who have defined a location
        const [locations] = await db.query("SELECT id AS admin_id, location, name AS company_name FROM Users WHERE role = 'admin' AND location IS NOT NULL");
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching locations', error });
    }
};

exports.bookSlot = async (req, res) => {
    try {
        const { slot_id, duration_hours, vehicle_number } = req.body;
        const user_id = req.user.id;

        if (!vehicle_number) {
            return res.status(400).json({ message: 'Vehicle number is required' });
        }

        const [slots] = await db.query("SELECT * FROM ParkingSlots WHERE id = ? AND status = 'available'", [slot_id]);
        if (slots.length === 0) return res.status(400).json({ message: 'Slot not available' });

        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + duration_hours * 60 * 60 * 1000);
        
        // Simple fee calculation: 50 per hour
        const amount = duration_hours * 50;

        // Create booking
        const [result] = await db.query(
            "INSERT INTO Bookings (user_id, slot_id, start_time, end_time, vehicle_number, status, qr_code_data) VALUES (?, ?, ?, ?, ?, 'active', ?)",
            [user_id, slot_id, startTime, endTime, vehicle_number, `booking_${Date.now()}`]
        );

        const bookingId = result.insertId;

        // Update slot status
        await db.query("UPDATE ParkingSlots SET status = 'occupied' WHERE id = ?", [slot_id]);

        // Create initial payment record
        await db.query(
            "INSERT INTO Payments (booking_id, amount, status) VALUES (?, ?, 'pending')",
            [bookingId, amount]
        );

        res.status(201).json({ message: 'Slot booked successfully', bookingId, amount });
    } catch (error) {
        res.status(500).json({ message: 'Error booking slot', error });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const [bookings] = await db.query(`
            SELECT b.*, s.slot_number, s.type, p.amount, p.status as payment_status 
            FROM Bookings b
            JOIN ParkingSlots s ON b.slot_id = s.id
            LEFT JOIN Payments p ON p.booking_id = b.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [req.user.id]);
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

exports.payFee = async (req, res) => {
    try {
        const { booking_id } = req.body;
        // In a real app, process payment with Stripe/Razorpay
        await db.query("UPDATE Payments SET status = 'completed' WHERE booking_id = ?", [booking_id]);
        res.json({ message: 'Payment simulated and completed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment', error });
    }
};
