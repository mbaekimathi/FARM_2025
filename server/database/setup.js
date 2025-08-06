const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabase = async () => {
  try {
    // Create connection without database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'kwetu_farm_employees';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' created or already exists`);

    // Use the database
    await connection.execute(`USE ${dbName}`);

    // Create employees table
    const createEmployeesTable = `
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_names VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL UNIQUE,
        identification_number VARCHAR(50) NOT NULL UNIQUE,
        employee_code VARCHAR(6) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        profile_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_employee_code (employee_code),
        INDEX idx_phone_number (phone_number),
        INDEX idx_identification_number (identification_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createEmployeesTable);
    console.log('Employees table created successfully');

    // Create login_attempts table for security
    const createLoginAttemptsTable = `
      CREATE TABLE IF NOT EXISTS login_attempts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_code VARCHAR(6) NOT NULL,
        ip_address VARCHAR(45),
        attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        success BOOLEAN DEFAULT FALSE,
        INDEX idx_employee_code (employee_code),
        INDEX idx_attempt_time (attempt_time)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createLoginAttemptsTable);
    console.log('Login attempts table created successfully');

    console.log('Database setup completed successfully!');
    await connection.end();

  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
};

createDatabase(); 