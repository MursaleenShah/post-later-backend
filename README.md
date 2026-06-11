# Post Later - Backend

A backend application that allows users to schedule social media posts and receive automated email reminders when it's time to publish them.

Built using Node.js, Express.js, MongoDB, JWT Authentication, Cloudinary, Nodemailer, and node-cron.

## Features

### Authentication & Authorization

* User Registration
* User Login
* User Logout
* JWT-based Authentication
* Protected Routes
* Password Hashing using bcrypt
* User-specific data access control

### Post Management

* Create Scheduled Posts
* Update Scheduled Posts
* Delete Scheduled Posts
* Get All User Posts
* Get Individual Post Details
* User Ownership Validation for all operations

### Media Uploads

* Upload Images using Cloudinary
* Store Cloudinary URLs in MongoDB
* Replace Media During Post Updates
* Automatic Media Deletion from Cloudinary when posts are deleted

### Scheduling System

* Schedule posts for future publishing
* Automated background job processing using node-cron
* Email reminder delivery at scheduled time
* Prevention of duplicate email notifications using post status tracking

### Email Notifications

* Automated email reminders using Nodemailer
* Personalized email content
* Scheduled delivery based on post publishing time

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT (JSON Web Tokens)
* bcrypt

### Media Storage

* Cloudinary
* Multer

### Scheduling & Notifications

* node-cron
* Nodemailer

---

## API Endpoints

### Authentication

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | /api/users/register     |
| POST   | /api/users/login        |
| POST   | /api/users/logout       |
| GET    | /api/users/current-user |

### Posts

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /api/posts     |
| GET    | /api/posts     |
| GET    | /api/posts/:id |
| PUT    | /api/posts/:id |
| DELETE | /api/posts/:id |

---

## Security Features

* Passwords are securely hashed using bcrypt.
* JWT-based authentication for protected routes.
* HTTP-only cookies for token storage.
* User ownership validation on all post operations.
* Unauthorized access prevention.

---

## Project Workflow

1. User registers and logs in.
2. User creates a scheduled post.
3. Optional media files are uploaded to Cloudinary.
4. Post details are stored in MongoDB.
5. node-cron continuously monitors pending posts.
6. When the scheduled time is reached, an email reminder is sent.
7. Post status is updated to prevent duplicate notifications.

---

## Future Improvements

* Refresh Tokens
* Password Reset via Email
* Email Verification
* Rate Limiting
* API Documentation using Swagger
* Unit and Integration Testing

---
