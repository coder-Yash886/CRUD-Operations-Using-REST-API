# User Management System — CRUD REST API

A production-grade RESTful API backend application built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** for managing users with full CRUD (Create, Read, Update, Delete) capabilities.

🌐 **Live API Base URL:** [https://crud-operations-using-rest-api.onrender.com](https://crud-operations-using-rest-api.onrender.com)

---

## 📌 Project Overview

This application fulfills all requirements of the Backend Developer Intern Technical Assignment by providing robust, secure, and validated REST APIs for user management:

- **Create a User (POST `/api/users`)**: Registers a new user with input validation, duplicate email prevention, and bcrypt password hashing.
- **Get All Users (GET `/api/users`)**: Retrieves all registered users, strictly excluding passwords or password hashes.
- **Get User by ID (GET `/api/users/:id`)**: Retrieves a single user by their ID with 404 handling.
- **Update User (PUT `/api/users/:id`)**: Updates user attributes with data validation, unique email verification, and password re-hashing if updated.
- **Delete User (DELETE `/api/users/:id`)**: Deletes a user by their ID with 404 handling.

---

## 🛠️ Technology Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Security & Utilities:**
  - `bcryptjs`: Password hashing using salt rounds
  - `validator`: Email format and string validation
  - `dotenv`: Environment variable management
  - `nodemon`: Development server live-reload

---

## 🏛️ Project Architecture

The project follows the standard **MVC (Model-Controller-Route)** architectural pattern:

```
Assignment/
├── config/
│   └── db.js                 # MongoDB connection using Mongoose
├── controllers/
│   └── userController.js     # Business logic & request handling for CRUD operations
├── middleware/
│   └── errorMiddleware.js    # Centralized error handler & 404 route middleware
├── models/
│   └── User.js               # Mongoose schema, validation, & bcrypt hooks
├── routes/
│   └── userRoutes.js         # REST API endpoints routing
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules (node_modules, .env)
├── package.json              # Project dependencies and npm scripts
├── postman_collection.json   # Exported Postman collection for API testing
├── README.md                 # Project documentation & setup instructions
└── server.js                 # Express application entry point
```

### Request-Response Flow:
```
Client Request (Postman / Frontend)
           │
           ▼
     server.js (Express & Global Middleware)
           │
           ▼
     routes/userRoutes.js (Route Mapping)
           │
           ▼
     controllers/userController.js (Validation & Business Logic)
           │
           ▼
     models/User.js (Mongoose Schema & Password Hashing Hooks)
           │
           ▼
     MongoDB Atlas (Database Persistence)
```

---

## 🗄️ Database Schema (User Model)

Each user document stored in MongoDB contains the following fields:

| Field | Type | Required | Constraints / Description |
|---|---|---|---|
| `id` / `_id` | ObjectId | Auto | Unique MongoDB Identifier |
| `fullName` | String | Yes | Minimum 2 characters, trimmed |
| `email` | String | Yes | Unique index, trimmed, lowercase, valid email format |
| `password` | String | Yes | Minimum 6 characters, hashed with bcrypt (never returned in responses) |
| `createdAt` | Date | Yes | Default: `Date.now` |

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/coder-Yash886/CRUD-Operations-Using-REST-API.git
cd CRUD-Operations-Using-REST-API
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### 4. Run the Application
- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```

Server will start on `http://localhost:5000`.

---

## 📡 REST API Documentation

### Base URL:
`http://localhost:5000`

### 1. Health Check
- **Endpoint:** `GET /`
- **Status Code:** `200 OK`
- **Response:**
  ```json
  {
    "success": true,
    "message": "User Management System API is running smoothly."
  }
  ```

---

### 2. Create User (Task 1)
- **Endpoint:** `POST /api/users`
- **Status Code:** `201 Created`
- **Request Body:**
  ```json
  {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User created successfully.",
    "data": {
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2026-10-21T19:38:24.900Z",
      "id": "6ad914b077845a86f9c66b76"
    }
  }
  ```

---

### 3. Get All Users (Task 2)
- **Endpoint:** `GET /api/users`
- **Status Code:** `200 OK`
- **Response:**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "fullName": "John Doe",
        "email": "john.doe@example.com",
        "createdAt": "2026-10-21T19:38:24.900Z",
        "id": "6ad914b077845a86f9c66b76"
      }
    ]
  }
  ```

---

### 4. Get User by ID (Task 3)
- **Endpoint:** `GET /api/users/:id`
- **Status Code:** `200 OK`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2026-10-21T19:38:24.900Z",
      "id": "6ad914b077845a86f9c66b76"
    }
  }
  ```

---

### 5. Update User (Task 4)
- **Endpoint:** `PUT /api/users/:id`
- **Status Code:** `200 OK`
- **Request Body (all fields optional, at least one required):**
  ```json
  {
    "fullName": "John Updated Doe",
    "email": "john.updated@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User updated successfully.",
    "data": {
      "fullName": "John Updated Doe",
      "email": "john.updated@example.com",
      "createdAt": "2026-10-21T19:38:24.900Z",
      "id": "6ad914b077845a86f9c66b76"
    }
  }
  ```

---

### 6. Delete User (Task 5)
- **Endpoint:** `DELETE /api/users/:id`
- **Status Code:** `200 OK`
- **Response:**
  ```json
  {
    "success": true,
    "message": "User deleted successfully.",
    "data": {
      "id": "6ad914b077845a86f9c66b76",
      "fullName": "John Updated Doe",
      "email": "john.updated@example.com"
    }
  }
  ```

---

## 🛡️ Error Handling & Status Codes

The API strictly implements proper HTTP status codes and uniform JSON error structures:

| HTTP Status | Description | Condition |
|---|---|---|
| `200 OK` | Success | Successful GET, PUT, DELETE operations |
| `201 Created` | Resource Created | Successful POST user creation |
| `400 Bad Request` | Client Error | Missing fields, invalid email format, duplicate email, invalid ObjectId format |
| `404 Not Found` | Not Found | User with given ID does not exist, or unmapped route accessed |
| `500 Internal Server Error` | Server Error | Unhandled server or database exceptions |

Sample Error Response:
```json
{
  "success": false,
  "message": "Validation failed: Please provide a valid email address."
}
```

---

## 🔒 Security Practices

1. **Password Hashing:** Passwords are never stored in plain text. They are hashed using `bcryptjs` with auto-generated salt (10 rounds).
2. **Password Secrecy:** The `password` field has `select: false` in the Mongoose schema, and the custom `toJSON` transformation deletes the `password` field before serialization to ensure password hashes are never leaked in API responses.
3. **Email Lowercasing & Trimming:** Emails are sanitized (trimmed and lowercased) to avoid accidental duplicates.
4. **Environment Safety:** Sensitive credentials (`MONGODB_URI`, `PORT`) are kept in `.env` and ignored by `.gitignore`.

---

## 🧪 Postman Testing

A ready-to-import Postman collection is included in this repository:
- **File:** `postman_collection.json`

### Steps to Test in Postman:
1. Open **Postman**.
2. Click **Import** (top left).
3. Select the `postman_collection.json` file from this project root.
4. The collection will automatically configure the `{{baseUrl}}` variable (`http://localhost:5000`) and dynamically save the `{{userId}}` upon creating a user.
