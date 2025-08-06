# Kwetu Farm Employee Management System

A modern employee signup and login system built with React, Node.js, and MySQL for Kwetu Farm.

## Features

- **Employee Signup**: Complete registration with all required fields
- **Employee Login**: Secure login using 6-digit employee code and password
- **Profile Management**: View and manage employee profiles
- **Image Upload**: Optional profile image upload
- **Responsive Design**: Modern, mobile-friendly UI
- **Security**: JWT authentication, password hashing, input validation
- **Database**: MySQL with proper indexing and relationships

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Hook Form
- Axios
- Lucide React Icons
- React Hot Toast

### Backend
- Node.js
- Express.js
- MySQL2
- JWT Authentication
- Bcrypt.js
- Multer (file uploads)
- Express Validator
- Helmet (security)
- CORS

### Database
- MySQL
- Proper indexing
- Login attempt tracking

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- Git

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/mbaekimathi/FARM_2025.git
cd FARM_2025
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE kwetufar_farm;
```

#### Configure Environment Variables
Copy the environment template:
```bash
cd server
cp env.example .env
```

Edit `.env` with your database credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=kwetufar_farm
DB_PASSWORD=Itskimathi007
DB_NAME=kwetufar_farm
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Setup Database Tables
```bash
npm run setup:db
```

### 5. Start Development Servers

#### Option A: Start both frontend and backend
```bash
npm run dev
```

#### Option B: Start separately
```bash
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
npm run client:dev
```

## Usage

### Employee Signup Process
1. Navigate to the signup form
2. Fill in all required fields:
   - Full Names
   - Phone Number (Kenyan format)
   - Identification Number
   - Password (with requirements)
   - Confirm Password
   - Optional Profile Image
3. Submit the form
4. **Important**: Save the generated 6-digit employee code

### Employee Login Process
1. Use your 6-digit employee code
2. Enter your password
3. Access your dashboard

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Employee registration
- `POST /api/auth/login` - Employee login
- `GET /api/auth/profile` - Get current user profile

### Health Check
- `GET /api/health` - API health status

## Deployment to HostPinnacle

### 1. GitHub Repository Setup
1. Create a new GitHub repository
2. Push your code to the repository

### 2. GitHub Secrets Configuration
Add these secrets to your GitHub repository:

```
SFTP_HOST=ftp.kwetufarm.com
SFTP_USERNAME=developer@kwetufarm.com
SFTP_PRIVATE_KEY=your_private_key_here
SFTP_REMOTE_PATH=/public_html
DB_HOST=your_db_host
DB_USER=kwetufar_farm
DB_PASSWORD=Itskimathi007
DB_NAME=kwetufar_farm
DB_PORT=3306
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
PORT=5000
CORS_ORIGIN=https://kwetufarm.com
REACT_APP_API_URL=https://kwetufarm.com/api
```

### 3. Automatic Deployment
- Push to `main` or `master` branch
- GitHub Actions will automatically:
  - Build the React app
  - Deploy to HostPinnacle via SFTP
  - Install dependencies
  - Setup database
  - Restart the application

### 4. Manual Deployment (Alternative)
If you prefer manual deployment:

```bash
# Build the application
npm run build

# Upload files to HostPinnacle via SFTP
# Install dependencies on server
npm install --production

# Setup database
npm run setup:db

# Start the application
npm start
```

## Environment Variables

### Development
- `REACT_APP_API_URL=http://localhost:5000/api`

### Production
- `REACT_APP_API_URL=https://yourdomain.com/api`

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- SQL injection prevention
- XSS protection

## Database Schema

### Employees Table
```sql
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_names VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  identification_number VARCHAR(50) NOT NULL UNIQUE,
  employee_code VARCHAR(6) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Login Attempts Table
```sql
CREATE TABLE login_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(6) NOT NULL,
  ip_address VARCHAR(45),
  attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success BOOLEAN DEFAULT FALSE
);
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check database credentials in `.env`
   - Ensure MySQL is running
   - Verify database exists

2. **Port Already in Use**
   - Change PORT in `.env`
   - Kill existing processes

3. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits

4. **CORS Errors**
   - Update CORS_ORIGIN in `.env`
   - Check frontend API URL

### Development Commands

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Build for production
npm run build

# Setup database
npm run setup:db

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, contact:
- Email: developer@kwetufarm.com
- Phone: [Your contact number]

---

**Kwetu Farm Employee System** - Built with ❤️ for efficient farm management 