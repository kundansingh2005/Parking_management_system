const bcrypt = require('bcrypt');
const db = require('./config/db');

async function fix() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await db.query("UPDATE Users SET password_hash = ? WHERE email = 'admin@admin.com'", [hashedPassword]);
        console.log("Admin password updated successfully to 'admin123'");
        
        // Let's verify what the users table has just to be absolutely sure
        const [users] = await db.query("SELECT * FROM Users WHERE email = 'admin@admin.com'");
        console.log(users);
    } catch (e) {
        console.error("error:", e);
    } finally {
        process.exit();
    }
}

fix();
