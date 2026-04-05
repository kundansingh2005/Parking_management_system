const db = require('./config/db');

async function test() {
    try {
        const adminId = 1; // Assuming user 1 exists
        let slotQueries = [];
        let queryValues = [];
        for (let i = 1; i <= 2; i++) {
            slotQueries.push("(?, ?, ?, ?)");
            queryValues.push(`TEST-P-${i}`, 'available', 'car', adminId); 
        }
        await db.query(`INSERT INTO ParkingSlots (slot_number, status, type, admin_id) VALUES ${slotQueries.join(',')}`, queryValues);
        console.log("Slots inserted");
    } catch (e) {
        console.error("error:", e);
    } finally {
        process.exit();
    }
}
test();
