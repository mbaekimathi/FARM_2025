#!/bin/bash

# Kwetu Farm Employee System Deployment Script
# This script helps set up and deploy the application

set -e

echo "🚀 Kwetu Farm Employee System - Deployment Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm version: $(npm -v)"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install server dependencies
    cd server
    npm install
    cd ..
    
    # Install client dependencies
    cd client
    npm install
    cd ..
    
    print_success "All dependencies installed successfully!"
}

# Setup environment file
setup_env() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f "server/.env" ]; then
        cp server/env.example server/.env
        print_warning "Environment file created. Please edit server/.env with your database credentials."
    else
        print_status "Environment file already exists."
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    read -p "Do you want to set up the database now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd server
        npm run setup:db
        cd ..
        print_success "Database setup completed!"
    else
        print_warning "Database setup skipped. Run 'npm run setup:db' manually when ready."
    fi
}

# Build application
build_app() {
    print_status "Building React application..."
    
    cd client
    npm run build
    cd ..
    
    print_success "Application built successfully!"
}

# Start development servers
start_dev() {
    print_status "Starting development servers..."
    
    read -p "Do you want to start the development servers now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Starting development servers..."
        print_status "Backend will run on: http://localhost:5000"
        print_status "Frontend will run on: http://localhost:3000"
        print_status "Press Ctrl+C to stop the servers"
        
        npm run dev
    else
        print_status "To start development servers later, run: npm run dev"
    fi
}

# Deploy to production
deploy_production() {
    print_status "Production deployment setup..."
    
    echo "For production deployment, you need to:"
    echo "1. Set up GitHub repository"
    echo "2. Configure GitHub Secrets"
    echo "3. Push to main/master branch"
    echo ""
    echo "See README.md for detailed deployment instructions."
}

# Main deployment function
main() {
    echo ""
    print_status "Starting deployment process..."
    
    # Check prerequisites
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Setup environment
    setup_env
    
    # Setup database
    setup_database
    
    # Build application
    build_app
    
    # Start development servers
    start_dev
    
    # Production deployment info
    deploy_production
    
    echo ""
    print_success "Deployment script completed!"
    echo ""
    echo "Next steps:"
    echo "1. Edit server/.env with your database credentials"
    echo "2. Run 'npm run setup:db' to create database tables"
    echo "3. Run 'npm run dev' to start development servers"
    echo "4. Visit http://localhost:3000 to test the application"
    echo ""
    echo "For production deployment, see README.md"
}

# Run main function
main "$@" 