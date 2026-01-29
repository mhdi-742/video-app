# 🎥 VideoVault - Secure Video Streaming & Analytics Platform

VideoVault is a comprehensive full-stack application designed for secure video uploading, processing, and streaming. It features a robust **Role-Based Access Control (RBAC)** system, real-time content analysis simulation, and adaptive streaming capabilities. This project demonstrates a complete workflow from secure file ingestion to frontend delivery, emphasizing security, scalability, and user experience.

---

## 🚀 Key Features

### 🛡️ **Advanced Security & Access Control**
* **Role-Based Access Control (RBAC):** A strict three-tier permission system:
    * **Viewer:** Read-only access to authorized content.
    * **Editor:** Upload, manage, and delete their *own* content.
    * **Admin:** Complete system oversight ("God Mode")—view all videos, delete any content, and manage user roles via a dedicated dashboard.
* **User Isolation:** Strict data segregation ensures users (Editors/Viewers) only interact with data they are explicitly authorized to see.
* **Secure Authentication:** JWT (JSON Web Token) based stateless authentication with automatic session expiration handling.

### ⚡ **High-Performance Streaming & Processing**
* **HTTP Range Requests:** Implements professional-grade video streaming that supports seeking and buffering, rather than simple file downloads.
* **Real-Time Status Updates:** Utilizes **Socket.io** to push processing updates (e.g., "Processing" → "Ready") instantly to the client without polling.
* **Mock AI Analysis:** Simulates an AI content moderation engine that analyzes video metadata to flag content as "Safe" or "Unsafe" asynchronously.

### 💻 **Modern Frontend Experience**
* **Dynamic Dashboard:** Responsive UI with real-time search, sorting (by date/size), and safety filtering.
* **Admin Control Panel:** A dedicated interface for administrators to manage user roles and oversee platform content.
* **Visual Feedback:** Interactive status badges and live progress indicators.

---

## 🛠️ Tech Stack

### **Backend (API Layer)**
* **Runtime:** Node.js
* **Framework:** Express.js (RESTful API architecture)
* **Database:** MongoDB & Mongoose ODM (Data modeling & storage)
* **Real-Time:** Socket.io (Event-driven communication)
* **File Handling:** Multer (Multipart/form-data handling) & FS (File System streams)
* **Authentication:** JSON Web Tokens (JWT) & Bcrypt (Password hashing)

### **Frontend (Client Layer)**
* **Framework:** React.js (Vite build tool)
* **Styling:** Tailwind CSS (Utility-first styling)
* **State Management:** React Context API (Auth state)
* **HTTP Client:** Axios (with Interceptors for global error handling)
* **Icons:** Lucide React

---

## 🏗️ Architecture Overview

The application follows a **Monolithic Full-Stack Architecture** with clear separation of concerns:

1.  **Client Layer:** A React Single Page Application (SPA) that manages user interaction and real-time state. It communicates with the backend via REST endpoints and a WebSocket connection.
2.  **Service Layer:** The Node/Express backend handles business logic, including authentication, file processing, and database interactions.
3.  **Data Layer:** MongoDB stores user profiles, video metadata, and role configurations. Video files are stored using a local ephemeral file system to ensure low latency during demonstrations.

### **Design Decisions & Assumptions**
* **Storage:** Local disk storage was chosen over cloud object storage (S3) to minimize external dependencies and latency for the assessment demo.
* **AI Simulation:** A deterministic mock engine is used for "Content Sensitivity Analysis" to ensure predictable demo outcomes (Safe vs. Flagged) without relying on non-deterministic external ML APIs.

---

## ⚙️ Installation & Setup

### **Prerequisites**
* Node.js (v14 or higher)
* MongoDB (Local or Atlas Connection String)

### **1. Backend Setup**
```bash
cd server
npm install

# Create a .env file in the server directory
# Add the following variables:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000

npm run dev
# Server will start on http://localhost:5000
```
## 💻 Frontend (Client)

### Tech Stack
* **Framework:** React.js (powered by Vite)
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **HTTP Client:** Axios (configured with Interceptors)
* **Real-Time:** Socket.io-client
* **Icons:** Lucide React

### Setup & Installation
1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Access the application:**
    Open your browser and navigate to `http://localhost:5173`
## 📖 User Manual

Welcome to **VideoVault**! This guide will help you navigate the platform, manage your videos, and understand your access permissions.

### 👤 User Roles & Permissions

The platform uses a **Role-Based Access Control (RBAC)** system. Your capabilities depend on the role assigned to your account.

| Feature | Viewer | Editor (Default) | Admin |
| :--- | :---: | :---: | :---: |
| **View Dashboard** | ✅ | ✅ | ✅ |
| **Watch Videos** | ✅ (Shared/Public) | ✅ (Own Content) | ✅ (All Content) |
| **Upload Videos** | ❌ | ✅ | ✅ |
| **Delete Videos** | ❌ | ✅ (Own Content Only) | ✅ (Any Video) |
| **View Admin Panel**| ❌ | ❌ | ✅ |
| **Manage Users** | ❌ | ❌ | ✅ |

---

### 🚀 Getting Started

#### 1. Registration & Login
* **Sign Up:** Navigate to the `/register` page. Enter a unique username, email, and password.
    * *Note:* New accounts are assigned the **Editor** role by default, allowing you to upload videos immediately.
* **Login:** Use your credentials to access the Dashboard.
* **Session:** Your session is secure. If you are inactive for too long, you will be automatically logged out for security.

#### 2. Uploading Videos (Editors & Admins)
1.  Click the **"Upload Video"** button in the top-right corner of the Dashboard.
2.  Select an `.mp4` video file from your computer (Max size: 50MB recommended for demo).
3.  Enter a **Title** for your video.
4.  Click **Upload**. You will see a progress bar indicating the upload status.

#### 3. Monitoring Processing Status
The system analyzes every upload in real-time. Watch the status badge on your video card:
* 🟡 **Processing:** The video is currently being analyzed for content sensitivity.
* 🟢 **Ready:** The video is safe and ready to view.
* 🔴 **Flagged:** The system detected sensitive content.

#### 4. Watching Videos
* Click on the **Thumbnail** of any "Ready" video to open the player.
* The player supports **Streaming**, meaning you can click anywhere on the timeline to jump to that section instantly without waiting for the whole file to download.

#### 5. Filtering & Search
* **Search:** Use the search bar to find videos by title.
* **Sort:** Use the dropdown to sort by **Newest**, **Oldest**, or **File Size**.
* **Safe Mode:** Toggle the **"Safe Only"** checkbox to instantly hide any video marked as "Flagged" (Red).

---

### 🛡️ Admin Guide (Admin Role Only)

If you are an Administrator, you will see a red **"🛡️ Admin Panel"** button in the header.

#### 1. Managing Users
* Navigate to the **"Manage Users"** tab in the Admin Panel.
* You will see a list of all registered users.
* Use the dropdown menu next to a user to change their role (e.g., promote a *Viewer* to an *Editor*).

#### 2. Content Moderation
* Navigate to the **"Manage Videos"** tab.
* You have a global view of every video uploaded to the platform.
* Click the **Trash Icon** next to any video to permanently delete it from the server. **Warning:** This action cannot be undone.

---

### ❓ Troubleshooting

* **"Upload Failed":** Ensure your file is a valid video format (MP4) and does not exceed the server's file size limit.
* **"Session Expired":** For security, tokens expire after a set period. If this happens, you will be redirected to the Login page automatically.
* **Video Won't Play:** Ensure the status is **Green (Ready)**. Videos that are still **Yellow (Processing)** cannot be played yet.

  ## 🧪 Testing & QA Guide

This section outlines the test cases used to verify the application's critical functionality, ensuring compliance with the project requirements.

### **Test Case 1: Video Ingestion Workflow**
* **Objective:** Verify that a user can upload a video and that it is processed correctly.
* **Steps:**
    1.  Log in as an **Editor** (or Admin).
    2.  Click the "Upload Video" button.
    3.  Select a standard `.mp4` file (e.g., `vacation.mp4`) and submit.
* **Expected Result:**
    * [cite_start]The dashboard immediately displays a new video card with a **"Processing" (Yellow)** status badge[cite: 59].
    * [cite_start]Within a few seconds, the status automatically updates to **"Ready" (Green)** without a page refresh (via Socket.io)[cite: 59].
    * [cite_start]The video becomes playable when clicked[cite: 62].

### **Test Case 2: Content Sensitivity Analysis**
* **Objective:** Verify that the "Mock AI" correctly flags sensitive content.
* **Steps:**
    1.  Upload a video file with a specific trigger name (e.g., `bad_trip.mp4`).
    2.  Wait for processing to complete.
* **Expected Result:**
    * [cite_start]The video status updates to **"Flagged" (Red)**[cite: 61].
    * [cite_start]The video card displays a "Flagged" warning icon[cite: 61].

### **Test Case 3: Security & User Isolation**
* **Objective:** Ensure users can only access their own content.
* **Steps:**
    1.  Log in as **User A** and upload a unique video.
    2.  Log out and log in as **User B**.
* **Expected Result:**
    * [cite_start]**User B** sees their own empty library (or their own videos) but **cannot** see User A's video[cite: 117].
    * This confirms the Multi-Tenant Architecture is functioning correctly.

### **Test Case 4: Admin Privileges**
* **Objective:** Verify the "God Mode" capabilities of the Admin role.
* **Steps:**
    1.  Log in as an **Admin**.
    2.  Navigate to the "Admin Panel" (Shield Icon).
    3.  Locate a video uploaded by another user (e.g., User A).
    4.  Click the **Trash Icon** to delete it.
* **Expected Result:**
    * The video is permanently removed from the system.
    * [cite_start]When User A logs back in, the video is gone from their dashboard[cite: 35].

### **Test Case 5: Safe Mode Filtering**
* **Objective:** Verify the frontend filtering mechanism.
* **Steps:**
    1.  Ensure the dashboard contains both "Safe" and "Flagged" videos.
    2.  Toggle the **"Safe Only"** switch to `ON`.
* **Expected Result:**
    * [cite_start]All "Flagged" (Red) videos instantly disappear from the grid[cite: 49].
    * Toggling it `OFF` brings them back.

---
## 📂 Project Structure

The codebase uses a monolithic structure with clearly separated **Client** (Frontend) and **Server** (Backend) directories.

```bash
video-vault/
├── client/                     # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── AdminRoute.jsx  # Protected route wrapper for Admin-only pages
│   │   │   ├── PrivateRoute.jsx# Protected route wrapper for authenticated users
│   │   │   ├── UploadModal.jsx # Modal component for file uploads
│   │   │   ├── VideoCard.jsx   # Displays video thumbnail, status, and actions
│   │   │   └── VideoPlayer.jsx # Custom player for streaming content
│   │   │
│   │   ├── context/            # Global State Management
│   │   │   └── AuthContext.jsx # Handles Login/Logout & Axios Interceptors
│   │   │
│   │   ├── pages/              # Main Route Views
│   │   │   ├── AdminDashboard.jsx # Admin control panel (User/Video management)
│   │   │   ├── Dashboard.jsx   # Main user interface (Video library)
│   │   │   ├── Login.jsx       # User authentication page
│   │   │   └── Register.jsx    # New user registration page
│   │   │
│   │   ├── App.jsx             # Main Router configuration
│   │   └── main.jsx            # Entry point
│   └── package.json
│
├── server/                     # Backend Application (Node + Express)
│   ├── middleware/             # Custom Middleware
│   │   ├── auth.js             # JWT verification middleware
│   │   └── checkRole.js        # RBAC middleware (Viewer/Editor/Admin checks)
│   │
│   ├── models/                 # Mongoose Database Schemas
│   │   ├── User.js             # User data & Role definitions
│   │   └── Video.js            # Video metadata & Status tracking
│   │
│   ├── routes/                 # API Route Definitions
│   │   ├── auth.js             # Authentication endpoints (Login/Register)
│   │   ├── users.js            # User management endpoints (Admin only)
│   │   └── video.js            # Video CRUD & Streaming endpoints
│   │
│   ├── utils/                  # Helper Utilities
│   │   └── videoProcessor.js   # Mock AI analysis logic
│   │
│   ├── uploads/                # Local storage for video files
│   ├── .env                    # Environment variables (Port, MongoURI, Secrets)
│   └── server.js               # Server entry point & Socket.io configuration
│
└── README.md                   # Project Documentation

