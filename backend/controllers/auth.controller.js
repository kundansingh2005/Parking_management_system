const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, location, total_slots } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        const [existing] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const assignedRole = role === 'admin' ? 'admin' : 'user';

        const [userResult] = await db.query(
            'INSERT INTO Users (name, email, password_hash, role, location) VALUES (?, ?, ?, ?, ?)', 
            [name, email, hashedPassword, assignedRole, assignedRole === 'admin' ? location : null]
        );
        
        // Auto-generate requested parking slots for new Admins
        if (assignedRole === 'admin' && total_slots && total_slots > 0) {
            const adminId = userResult.insertId;
            let slotQueries = [];
            let queryValues = [];
            for (let i = 1; i <= total_slots; i++) {
                slotQueries.push("(?, ?, ?, ?)");
                // Defaulting standard multi-creation to car slots available
                queryValues.push(`P-${i}`, 'available', 'car', adminId); 
            }
            await db.query(`INSERT INTO ParkingSlots (slot_number, status, type, admin_id) VALUES ${slotQueries.join(',')}`, queryValues);
        }

        res.status(201).json({ message: assignedRole === 'admin' ? 'Parking Admin and slots registered successfully' : 'User registered successfully.' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: error.message || 'Internal server error.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.json({
            message: 'Logged in successfully.',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: error.message || 'Internal server error.' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, role, created_at FROM Users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};
