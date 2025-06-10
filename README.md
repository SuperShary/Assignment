# Assignment - MERN Stack Web Application

This repository contains a full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js). The application features a robust authentication system, user management, and various administrative functionalities.

## Project Structure

The project is organized into two main directories:

- **Client**: React frontend application using Chakra UI for components
- **Server**: Node.js/Express backend with MongoDB for data storage

## Features

- **Authentication System**: JWT-based authentication with secure login/logout
- **User Management**: Create, view, edit, and delete users with different roles
- **Dashboard**: Admin dashboard with various data visualizations
- **Responsive Design**: Mobile-friendly interface with Chakra UI
- **MongoDB Integration**: Data persistence with MongoDB (works with and without MongoDB connection)
- **Error Handling**: Comprehensive error handling on both client and server
- **Form Validation**: Input validation using Formik and Yup

## Prerequisites

- Node.js (v14 or newer)
- NPM or Yarn
- MongoDB (optional - the app can work with hardcoded admin credentials)

## Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/supershary/Assignment.git
cd Assignment
```

### Server Setup

1. Navigate to the Server directory:

```bash
cd Server
```

2. Install dependencies:

```bash
npm install
```

3. Create an `.env` file in the Server directory (optional):

```
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/skilltest
JWT_SECRET=your_super_secret_jwt_key_for_skill_test
TOKEN_EXPIRY=7d
```

4. Start the server:

```bash
npm start
```

The server will run on port 5001 by default.

### Client Setup

1. Open a new terminal window/tab
2. Navigate to the Client directory:

```bash
cd Client
```

3. Install dependencies:

```bash
npm install
```

4. Create an `.env` file in the Client directory (optional):

```
REACT_APP_BASE_URL=http://localhost:5001/
```

5. Start the client:

```bash
npm start
```

The client will run on port 3000 by default.

## Running the Application

1. Start both the server and client:

```bash
# Terminal 1 - Server
cd Server
npm start

# Terminal 2 - Client
cd Client
npm start
```

2. Access the application in your browser at `http://localhost:3000`

3. Login with the default admin credentials:
   - Email: `admin@gmail.com`
   - Password: `admin123`

## MongoDB Configuration

The application is designed to work with or without a MongoDB connection. If MongoDB is available, it will use it for data persistence. If not, it will operate with limited functionality using the hardcoded admin account.

## Troubleshooting

### Port Already in Use

If you encounter a "Port already in use" error:

1. Kill all Node.js processes:
   ```bash
   # On Windows
   taskkill /F /IM node.exe
   
   # On Mac/Linux
   killall node
   ```

2. Then restart the server.

### MongoDB Connection Issues

If you encounter MongoDB connection issues, the application will still function with limited capabilities. You can:

1. Use the hardcoded admin account (admin@gmail.com/admin123)
2. Check if MongoDB is running on your system
3. Modify the MongoDB connection URL in the Server's configuration

## Implementation Details

### Key Technologies Used

- **Frontend**:
  - React (Create React App)
  - Redux Toolkit for state management
  - Chakra UI for component library
  - Axios for API requests
  - React Router for navigation
  - Formik & Yup for form validation

- **Backend**:
  - Node.js with Express
  - MongoDB with Mongoose
  - JWT for authentication
  - Bcrypt for password hashing

### Authentication Flow

1. User enters credentials on the login page
2. Server validates credentials and issues a JWT token
3. Token is stored in localStorage or sessionStorage (based on "Remember Me" option)
4. Protected routes check for valid token before allowing access
5. Token is included in the Authorization header for API requests

### Error Handling

The application includes comprehensive error handling:

1. Client-side form validation using Formik & Yup
2. Server-side validation for API requests
3. Clear error messages displayed to users
4. Fallback mechanisms for MongoDB connection issues

## Future Enhancements

Potential future enhancements for this project:

1. Enhanced security features (2FA, password reset)
2. More comprehensive user role management
3. Additional data visualization components
4. Offline mode capabilities
5. Performance optimizations for larger datasets

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- Shagun Choudhary - Initial work and development

## Acknowledgments

- Chakra UI team for the component library
- MongoDB team for the database technology
- React and Node.js communities for excellent documentation 