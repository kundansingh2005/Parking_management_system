CREATE DATABASE IF NOT EXISTS parking_db;
USE parking_db;

CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ParkingSlots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_number VARCHAR(50) NOT NULL,
    status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
    type ENUM('car', 'bike') DEFAULT 'car',
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    slot_id INT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    vehicle_number VARCHAR(50),
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    qr_code_data VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES ParkingSlots(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE
);

-- Insert a default admin user (password: admin123)
-- The password hash here should be properly generated in the backend, but we can do it during backend init or insert a known bcrypt hash.
-- Hash of 'admin123' is $2a$10$XQ.9mKj2XQ.9mKj2XQ.9mOIfhE2F4oU/y7a810Z/Qd81M14d7Bq7i
INSERT IGNORE INTO Users (id, name, email, password_hash, role) VALUES (1, 'Admin', 'admin@admin.com', '$2b$10$eOQe3u9AOTwGkZ7y5H6nLu7E48nOhK2aZ5hW5wW9x8w.R2/eI1GZ6', 'admin');

-- Insert some default slots
INSERT IGNORE INTO ParkingSlots (id, slot_number, status, type) VALUES 
(1, 'A1', 'available', 'car'),
(2, 'A2', 'available', 'car'),
(3, 'A3', 'available', 'car'),
(4, 'B1', 'available', 'bike'),
(5, 'B2', 'available', 'bike');
