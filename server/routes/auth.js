const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database/connection');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Generate 6-digit employee code
const generateEmployeeCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Employee Signup
router.post('/signup', 
  upload.single('profile_image'),
  [
    body('full_names')
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage('Full names must be between 2 and 255 characters'),
    body('phone_number')
      .trim()
      .matches(/^(\+254|0)[17]\d{8}$/)
      .withMessage('Please enter a valid Kenyan phone number'),
    body('identification_number')
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('Identification number must be between 5 and 50 characters'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirm_password')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      })
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { full_names, phone_number, identification_number, password } = req.body;
      
      // Check if phone number already exists
      const [existingPhone] = await pool.execute(
        'SELECT id FROM employees WHERE phone_number = ?',
        [phone_number]
      );

      if (existingPhone.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already registered'
        });
      }

      // Check if identification number already exists
      const [existingId] = await pool.execute(
        'SELECT id FROM employees WHERE identification_number = ?',
        [identification_number]
      );

      if (existingId.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Identification number already registered'
        });
      }

      // Generate unique employee code
      let employeeCode;
      let isUnique = false;
      while (!isUnique) {
        employeeCode = generateEmployeeCode();
        const [existingCode] = await pool.execute(
          'SELECT id FROM employees WHERE employee_code = ?',
          [employeeCode]
        );
        if (existingCode.length === 0) {
          isUnique = true;
        }
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Prepare profile image path
      const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

      // Insert new employee
      const [result] = await pool.execute(
        'INSERT INTO employees (full_names, phone_number, identification_number, employee_code, password, profile_image) VALUES (?, ?, ?, ?, ?, ?)',
        [full_names, phone_number, identification_number, employeeCode, hashedPassword, profileImage]
      );

      // Generate JWT token
      const token = jwt.sign(
        { employeeId: result.insertId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Employee registered successfully',
        data: {
          id: result.insertId,
          full_names,
          phone_number,
          employee_code: employeeCode,
          profile_image: profileImage
        },
        token
      });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during registration'
      });
    }
  }
);

// Employee Login
router.post('/login',
  [
    body('employee_code')
      .trim()
      .isLength({ min: 6, max: 6 })
      .withMessage('Employee code must be exactly 6 digits'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { employee_code, password } = req.body;

      // Find employee by employee code
      const [employees] = await pool.execute(
        'SELECT id, full_names, employee_code, phone_number, password, profile_image FROM employees WHERE employee_code = ?',
        [employee_code]
      );

      if (employees.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid employee code or password'
        });
      }

      const employee = employees[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid employee code or password'
        });
      }

      // Log login attempt
      await pool.execute(
        'INSERT INTO login_attempts (employee_code, ip_address, success) VALUES (?, ?, ?)',
        [employee_code, req.ip, true]
      );

      // Generate JWT token
      const token = jwt.sign(
        { employeeId: employee.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          id: employee.id,
          full_names: employee.full_names,
          employee_code: employee.employee_code,
          phone_number: employee.phone_number,
          profile_image: employee.profile_image
        },
        token
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  }
);

// Get current employee profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.employee
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

module.exports = router; 