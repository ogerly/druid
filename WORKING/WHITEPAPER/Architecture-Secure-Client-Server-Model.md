# WHITEPAPER: Secure Client-Server Architecture Model

**_Publication Date:_** 2026-03-03
**_Author:_** Gemini
**_Status:_** Active

## 1. Abstract

This document specifies the official architecture for the DRUID application. The project employs a **Secure Client-Server Model** to ensure a robust separation of concerns and to eliminate the exposure of sensitive credentials on the client-side. The backend acts as the sole, trusted gateway to the Supabase persistence layer.

## 2. Architecture Specification

### 2.1. Frontend (Client)

*   **Framework:** Vue.js 3 with Vite.
*   **Responsibilities:** User Interface rendering and user interaction handling.
*   **Security:** The frontend is a "dumb" client. It **must not** contain any API keys, secrets, or direct database connections. It communicates exclusively with the backend via a defined REST API.

### 2.2. Backend (Server)

*   **Framework:** Node.js with Express.js.
*   **Responsibilities:**
    *   Acts as a secure proxy to the Supabase service.
    *   Manages all user authentication and session logic.
    *   Exposes a REST API for the frontend.
*   **Security:** The backend is the **only** component with access to the Supabase `SERVICE_ROLE_KEY`. This key must be stored securely in environment variables on the server.

## 3. API & Data Flow

### 3.1. API Endpoints

The backend provides the following core endpoints for authentication:

*   `POST /api/auth/signin`: Authenticates a user.
*   `POST /api/auth/signout`: Terminates a user session.
*   `GET /api/auth/user`: Retrieves the current user profile based on the session.

### 3.2. Authentication Flow

1.  The user submits login credentials to the frontend.
2.  The frontend sends a `POST` request to the backend's `/api/auth/signin` endpoint.
3.  The backend validates the credentials against Supabase.
4.  On success, the backend sets a **secure, `httpOnly` cookie** in the user's browser.
5.  Subsequent requests from the frontend to the backend API automatically include this cookie, allowing the backend to validate the user's session with Supabase.

## 4. Security Principle: `httpOnly` Cookies

The use of `httpOnly` cookies is a cornerstone of this architecture. It prevents any client-side JavaScript from accessing the authentication token, thereby mitigating Cross-Site Scripting (XSS) attacks aimed at stealing session credentials. This is the mandated standard for session management in this project.
