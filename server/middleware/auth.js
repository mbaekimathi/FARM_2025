const jwt = require('jsonwebtoken');
const { pool } = require('../database/connection');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify employee still exists in database
    const [rows] = await pool.execute(
      'SELECT id, full_names, employee_code, phone_number FROM employees WHERE id = ?',
      [decoded.employeeId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. Employee not found.' 
      });
    }

    req.employee = rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication.' 
    });
  }
};

module.exports = auth; 