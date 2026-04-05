const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const [[{ total_users }]] = await db.query("SELECT COUNT(*) AS total_users FROM Users WHERE role = 'user'");
        const [[{ total_bookings }]] = await db.query(`
            SELECT COUNT(*) AS total_bookings FROM Bookings b 
            JOIN ParkingSlots s ON b.slot_id = s.id 
            WHERE s.admin_id = ?
        `, [req.user.id]);
        const [[{ total_revenue }]] = await db.query(`
            SELECT SUM(p.amount) AS total_revenue FROM Payments p
            JOIN Bookings b ON p.booking_id = b.id
            JOIN ParkingSlots s ON b.slot_id = s.id
            WHERE p.status = 'completed' AND s.admin_id = ?
        `, [req.user.id]);
        
        res.json({
            total_users,
            total_bookings,
            total_revenue: total_revenue || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, name, email, role, created_at FROM Users");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const [bookings] = await db.query(`
            SELECT b.*, u.name as user_name, u.email, s.slot_number, p.amount, p.status as payment_status
            FROM Bookings b
            JOIN Users u ON b.user_id = u.id
            JOIN ParkingSlots s ON b.slot_id = s.id
            LEFT JOIN Payments p ON p.booking_id = b.id
            WHERE s.admin_id = ?
            ORDER BY b.created_at DESC
        `, [req.user.id]);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

exports.getAllSlots = async (req, res) => {
    try {
        const [slots] = await db.query("SELECT * FROM ParkingSlots WHERE admin_id = ?", [req.user.id]);
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching slots', error });
    }
};

exports.addSlot = async (req, res) => {
    try {
        const { slot_number, type } = req.body;
        await db.query("INSERT INTO ParkingSlots (slot_number, type, admin_id) VALUES (?, ?, ?)", [slot_number, type, req.user.id]);
        res.status(201).json({ message: 'Slot added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding slot', error });
    }
};

exports.deleteSlot = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM ParkingSlots WHERE id = ? AND admin_id = ?", [id, req.user.id]);
        res.json({ message: 'Slot deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting slot', error });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        if (!['user', 'admin'].includes(role)) {
             return res.status(400).json({ message: 'Invalid role specified' });
        }

        // Prevent admin from demoting themselves by accident, optional but good practice.
        if (req.user.id === parseInt(id) && role === 'user') {
             return res.status(403).json({ message: 'You cannot demote yourself' });
        }

        await db.query("UPDATE Users SET role = ? WHERE id = ?", [role, id]);
        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
};
