# 🔐 JWT Authentication System

A secure and scalable **JWT-based Authentication System** built with **Node.js, Express.js, MongoDB, and Mongoose**. The system implements modern authentication features including access tokens, refresh tokens, session management, email verification, logout, and token blacklisting.

## 🚀 Features

* 🔑 User Registration & Login
* 🔐 Password Hashing
* 🎟️ Access Token Authentication
* ♻️ Refresh Token Rotation
* 📧 Email Verification with OTP
* 🚪 Secure Logout
* 🔒 Logout from All Devices
* 🛑 Access Token Blacklisting
* 💻 Session Management
* 🌐 Protected Routes
* 👤 Get Current User
* 🍪 HTTP-only Cookies for Refresh Tokens
* 🛡️ Role/Permission-ready authentication architecture
* 🗄️ MongoDB Database Integration
* ⚡ RESTful API Architecture

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* JavaScript

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* HTTP-only Cookies
* SHA-256 Hashing
* OTP-based Email Verification

### Development Tools

* Postman
* MongoDB Compass
* dotenv
* Git & GitHub

## 📁 Project Structure

```text
JWT_Authentication/
│
├── src/
│   ├── config/
│   │   └── config.js
│   │
│   ├── controllers/
│   │   └── auth.controller.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── session.model.js
│   │
│   ├── routes/
│   │   └── auth.routes.js
│   │
│   ├── utils/
│   │   └── ...
│   │
│   └── app.js
│
├── .env
├── package.json
├── package-lock.json
└── server.js
```

> The exact folder structure may vary depending on the current implementation.

## 🔄 Authentication Flow

### 1. Registration

The user sends registration details:

```http
POST /api/auth/register
```

Example:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

The server:

1. Validates the user data.
2. Hashes the password.
3. Creates the user.
4. Generates an email verification OTP.
5. Sends the OTP to the registered email.

---

### 2. Email Verification

The user submits the received OTP to verify their email.

```http
POST /api/auth/verify-email
```

After successful verification, the user's email is marked as verified.

---

### 3. Login

The user provides their credentials:

```http
POST /api/auth/login
```

After successful authentication:

* An **access token** is generated.
* A **refresh token** is generated.
* The refresh token is stored securely using an HTTP-only cookie.
* A session is created in MongoDB.

The access token is short-lived, while the refresh token can be used to obtain a new access token.

---

### 4. Access Protected Routes

Protected routes require a valid access token.

```http
Authorization: Bearer <access_token>
```

The authentication middleware:

1. Extracts the token.
2. Verifies the JWT.
3. Checks whether the token has been blacklisted.
4. Identifies the authenticated user.
5. Allows access to the protected route.

---

### 5. Refresh Token

When the access token expires, the refresh token can be used to obtain a new access token.

```http
POST /api/auth/refresh-token
```

The system validates the refresh token and associated session before generating a new access token.

---

### 6. Logout

The user can log out from the current session:

```http
POST /api/auth/logout
```

The current session is invalidated and the refresh token cookie is cleared.

---

### 7. Logout From All Devices

The system also supports logging out from all active sessions.

```http
POST /api/auth/logout-all
```

This invalidates the user's active sessions across devices.

---

## 🔐 Security

This project implements several security practices:

### Password Hashing

Passwords are never stored directly in the database. They are hashed before storage.

### JWT Access Tokens

Access tokens are short-lived and used to access protected resources.

### Refresh Tokens

Refresh tokens are used to obtain new access tokens without requiring the user to log in again.

### HTTP-only Cookies

Refresh tokens are stored in HTTP-only cookies to reduce exposure to client-side JavaScript.

### Token Blacklisting

Invalidated access tokens can be blacklisted to prevent them from being reused after logout.

### Session Management

Each login creates a session that can be individually invalidated.

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

### 2. Navigate to the Project

```bash
cd JWT_Authentication
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

> Never commit your `.env` file or expose your secrets publicly.

### 5. Start the Server

For development:

```bash
npm run dev
```

Or:

```bash
npm start
```

The server should start on:

```text
http://localhost:3000
```

## 📡 API Endpoints

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| POST   | `/api/auth/register`      | Register a new user         |
| POST   | `/api/auth/login`         | Login user                  |
| POST   | `/api/auth/verify-email`  | Verify email using OTP      |
| POST   | `/api/auth/refresh-token` | Generate a new access token |
| POST   | `/api/auth/logout`        | Logout current session      |
| POST   | `/api/auth/logout-all`    | Logout from all devices     |
| GET    | `/api/auth/get-me`        | Get authenticated user      |

> Update the endpoint names in this table if your implementation uses different routes.

## 🧪 Testing With Postman

You can test the authentication APIs using **Postman**.

Recommended testing order:

```text
Register
   ↓
Email Verification
   ↓
Login
   ↓
Get Current User
   ↓
Refresh Token
   ↓
Logout
   ↓
Logout From All Devices
```

For protected endpoints, add:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

## 🗄️ Database

MongoDB is used as the primary database.

The system maintains information such as:

### User

```text
_id
username
email
password
emailVerified
createdAt
updatedAt
```

### Session

```text
_id
user
refreshTokenHash
ip
userAgent
createdAt
expiresAt
```

Refresh tokens are stored as hashes rather than storing the raw refresh token.

## 📌 Future Improvements

Possible improvements include:

* Password reset using email OTP
* Rate limiting
* Account lockout after multiple failed login attempts
* OAuth authentication
* Google/GitHub login
* Two-factor authentication
* Device management
* Redis-based token blacklist
* CSRF protection
* Advanced role-based access control
* Production-grade email service integration

## 👨‍💻 Author

**Your Name**

Computer Science Undergraduate | Web Developer

### Technologies

```text
Node.js
Express.js
MongoDB
Mongoose
JWT
JavaScript
REST API
```

## ⭐ Contributing

Contributions, issues, and feature requests are welcome.

If you find a bug or have an idea for improvement, feel free to open an issue or submit a pull request.

## 📄 License

This project is available for educational and development purposes.
