# QR-based Attendance System

## Overview
The QR-based Attendance System is a simple and efficient way to track and record attendance using QR codes. This system allows students or employees (Group) to mark their attendance by scanning a unique QR code assigned to them. The application generates QR codes, tracks attendance in real-time, and stores data securely.

## Features
- **QR Code Generation**: Generates unique QR codes for each user.
- **Attendance Marking**: Users can mark attendance by scanning their unique QR codes.
- **Real-time Attendance Updates**: The system records attendance in real-time.
- **Secure Data Storage**: Attendance data is securely stored in a database.
- **User Authentication**: Allows only registered users to mark their attendance.

## Technologies Used
- **Frontend**: Next JS
- **Backend**: Node.js with Express.js 
- **Database**: MongoDB 
- **QR Code Generation**: `qrcode` library or any other QR code generation library
- **Authentication**:  JWT (JSON Web Token) for user verification