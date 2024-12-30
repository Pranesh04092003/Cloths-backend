 
# 👕 E-Commerce Backend API

> A robust Node.js/Express.js backend API for an e-commerce clothing application.

[![Node.js Version][node-version]][node-url]
[![NPM Version][npm-version]][npm-url]
[![Build Status][build-status]][build-url]

## 🌐 Live Demo
- Frontend: [E-Commerce Cloths](https://e-commerce-cloths.vercel.app/)
- Backend API: [API Documentation](#-api-documentation)

## Overview
This is the backend API that powers the E-Commerce Cloths website. The frontend is built with React and is live at [e-commerce-cloths.vercel.app](https://e-commerce-cloths.vercel.app/). This API provides all the necessary endpoints for:
- User authentication
- Product management
- Shopping cart functionality
- Address management
- Order processing

[View on GitHub](https://github.com/Pranesh04092003/E-Commerce-Cloths-Backend)

## Table of Contents
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [API Documentation](#-api-documentation)
- [Getting Started](#-getting-started)
- [Testing](#-testing)
- [Code Quality](#-code-quality)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## 🚀 Features
- ✅ User Authentication (Register/Login)
- 🔐 JWT Token-based Authorization
- 📍 Address Management
- 🔒 Password Hashing with Bcrypt
- 🗄️ MongoDB Database Integration
- ✨ Input Validation
- 🛡️ Error Handling
- 🧪 Unit Testing with Jest
- 📊 ESLint Code Quality

## 🛠️ Tech Stack
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Jest | Testing |
| ESLint | Code quality |

## 📝 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Body | Auth Required |
|--------|----------|-------------|------|---------------|
| POST | `/api/users/register` | Register new user | `{ fullName, email, password }` | No |
| POST | `/api/users/login` | Login user | `{ email, password }` | No |

### Address Management Endpoints

| Method | Endpoint | Description | Body | Auth Required |
|--------|----------|-------------|------|---------------|
| GET | `/api/addresses` | Get all addresses | - | Yes |
| POST | `/api/addresses` | Create address | `{ phone, address, city, state, pincode, isDefault }` | Yes |
| PUT | `/api/addresses/:id` | Update address | `{ phone, address, city, state, pincode, isDefault }` | Yes |
| PATCH | `/api/addresses/:id/set-default` | Set address as default | - | Yes |
| GET | `/api/addresses/default` | Get default address | - | Yes |
| DELETE | `/api/addresses/:id` | Delete address | - | Yes |

### Shop Endpoints

| Method | Endpoint | Description | Body | Auth Required |
|--------|----------|-------------|------|---------------|
| GET | `/api/shop/products/get` | Get all products | - | No |
| GET | `/api/shop/products/:id/sizes` | Get product sizes | - | No |
| POST | `/api/shop/products/:id/purchase` | Purchase product | `{ size, quantity }` | No |
| PUT | `/api/shop/products/:id/sizes` | Update product sizes | `{ sizeName, quantity }` | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Body | Auth Required |
|--------|----------|-------------|------|---------------|
| POST | `/api/admin/add-products` | Add new product | `{ title, image, brand, originalPrice, salePrice, onSale, description, sizes, thumbnails }` | Yes |
| PUT | `/api/admin/update-product/:id` | Update product | `{ title, image, brand, originalPrice, salePrice, onSale, description, sizes }` | Yes |
| DELETE | `/api/admin/delete-product/:id` | Delete product | - | Yes |

#### Example Address Creation
```bash
curl -X POST http://localhost:5000/api/addresses \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001",
    "isDefault": true
  }'
```

#### Example Product Creation
```bash
curl -X POST http://localhost:5000/api/admin/add-products \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Classic T-Shirt",
    "image": "base64-image-data",
    "brand": "MyBrand",
    "originalPrice": 29.99,
    "salePrice": 19.99,
    "onSale": true,
    "description": ["100% Cotton", "Comfortable fit"],
    "sizes": [
      {"name": "S", "quantity": 10, "disabled": false},
      {"name": "M", "quantity": 10, "disabled": false},
      {"name": "L", "quantity": 10, "disabled": false},
      {"name": "XL", "quantity": 10, "disabled": false}
    ],
    "thumbnails": ["base64-thumbnail-1", "base64-thumbnail-2"]
  }'
```

#### Example Purchase Request
```bash
curl -X POST http://localhost:5000/api/shop/products/123/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "size": "M",
    "quantity": 1
  }'
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm/yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/Pranesh04092003/E-Commerce-Cloths-Backend.git
cd E-Commerce-Cloths-Backend
```

2. Install dependencies
```bash
npm install
```

3. Environment Setup

### Required Services
1. **MongoDB Atlas** - For database
2. **Cloudinary Account** - For image storage and manipulation
   - Sign up at [Cloudinary](https://cloudinary.com/home)
   - Used for storing product images and thumbnails
   - Provides image optimization and transformation features
   - Required for product management in admin panel

Create a `.env` file in the root directory:
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abeugnm.mongodb.net/E-commerce-cloths-Backend

# JWT Configuration
JWT_SECRET=your-secret-key

# Cloudinary Configuration (Get these from your Cloudinary dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Cloudinary Setup Steps:
1. Create a free account at [Cloudinary](https://cloudinary.com/home)
2. Go to your Cloudinary Dashboard
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret
4. Paste these values in your `.env` file

> **Note**: Cloudinary is used in this project for:
> - Storing product images
> - Managing image thumbnails
> - Image optimization
> - Secure image delivery
> - Real-time image transformations

Required Environment Variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

4. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## 📁 Project Structure
```
E-Commerce-Cloths-Backend/
├── config/
│   ├── cloudinary.js        # Cloudinary configuration
│   └── database.js          # Database configuration
├── controllers/
│   ├── addressController.js # Address management
│   ├── adminController.js   # Admin operations
│   ├── authController.js    # Authentication logic
│   └── shopController.js    # Shop operations
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── requestLogger.js     # Request logging
│   └── responseLogger.js    # Response logging
├── models/
│   ├── Address.js          # Address model
│   ├── Product.js          # Product model
│   └── User.js             # User model
├── routes/
│   ├── address.js          # Address routes
│   ├── admin.js            # Admin routes
│   ├── auth.js             # Auth routes
│   └── shop.js             # Shop routes
├── node_modules/           # Dependencies
├── .env                    # Environment variables (git-ignored)
├── .env.example           # Example environment variables template
├── .gitignore             # Git ignore file
├── package-lock.json      # Dependency lock file
├── package.json           # Project configuration
└── server.js              # Entry point
```

## 🔒 Authentication Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Create Address
```bash
curl -X POST http://localhost:5000/api/addresses \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }'
```

## 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author
- [Pranesh R V](https://github.com/Pranesh04092003) - Full Backend Development

## 🔗 Repository
This project is maintained at [E-Commerce-Cloths-Backend](https://github.com/Pranesh04092003/E-Commerce-Cloths-Backend)

## 🙏 Acknowledgments
- Node.js community
- Express.js team
- MongoDB team

## 🔗 Related Links
- [Frontend Repository](https://github.com/Pranesh04092003/E-commerce-cloths)
- [Live Website](https://e-commerce-cloths.vercel.app/)
- [Backend Repository](https://github.com/Pranesh04092003/E-Commerce-Cloths-Backend)

[node-version]: https://img.shields.io/node/v/express
[node-url]: https://nodejs.org/
[npm-version]: https://img.shields.io/npm/v/express
[npm-url]: https://www.npmjs.com/
[build-status]: https://img.shields.io/travis/Pranesh04092003/E-Commerce-Cloths-Backend
[build-url]: https://github.com/Pranesh04092003/E-Commerce-Cloths-Backend
 
# E-Commerce-Cloths-Backend
 
