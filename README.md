# Project Overview

A project that implements email verification and password recovery with **nodemailer**.

---

## Endpoints

### Auth

- **POST /auth/signup**: To create a new user  
  Receives email and password.  
  Send verification email to new user. It expires in 6 hours.  
  Until not verified, this new user will have verified=false
- **GET /auth/verify/:userId/:uniqueString**: To verify new user
- **POST /auth/forgot-password**: To issue verification email for password recovery  
  Receives email.  
  Expires in 6 hours.
- **POST /auth/reset-password/:uniqueString**: Confirms password change  
  Receives email and new password in the body.  
  Receives email secret key in params.

---

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Create a `.env` file in the root of the project.  
   Add `PORT` variable: the API port  
   Add `BASE_URL` variable: the url where this app is going to run from  
   Add `AUTH_EMAIL` variable: the email that will be used to send the messages  
   Add `AUTH_PASS` variable: the key given by the email provider to allow the use for message sending
4. Run `npm install` to install the dependencies.
5. Run `npm run dev` to start the server.

---

## Example Usage

Once the server is running, you can access the application at `http://localhost:3000/`.
