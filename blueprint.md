# Druid Application Blueprint

## 1. Overview

Druid is a modern, map-centric web application designed for tracking, managing, and visualizing personal points of interest (POIs) and movement tracks. It leverages a Vue.js frontend, a Supabase backend for authentication and data storage, and is hosted on Vercel. The application is designed to be fully responsive and provide a seamless user experience on both desktop and mobile devices.

## 2. Core Features & Design

### Style & Design Philosophy
- **Modern & Bold:** The UI uses modern components, a visually balanced layout with clean spacing, and polished styles.
- **Color Palette:** A vibrant and energetic color palette is used to create a visually engaging experience.
- **Typography:** Expressive and relevant typography is used to create a clear visual hierarchy.
- **Iconography:** Icons are used to enhance user understanding and navigation.
- **Interactivity:** Interactive elements have a "glow" effect and shadows to create a sense of depth and interactivity.

### Implemented Features
- **Map-centric Interface:** The core of the application is an interactive map (using Mapbox).
- **User Authentication:** Secure user sign-up and login via passwordless magic links, handled by Supabase Auth.
- **Real-time Data:** Data is fetched and managed in real-time.
- **POI Management:** Users can create, view, update, and delete personal points of interest on the map.
- **GPS Tracking:** The application can track the user's location and save it as a track.
- **PWA Ready:** The application is a Progressive Web App (PWA) with a service worker for offline capabilities.
- **Responsive Design:** The layout adapts to various screen sizes.
- **Routing:** Client-side routing is handled by Vue Router.

## 3. Architecture & Technology Stack

- **Frontend:** Vue.js 3 with Composition API and `<script setup>`
- **State Management:** Pinia
- **Routing:** Vue Router
- **Build Tool:** Vite
- **Backend-as-a-Service (BaaS):** Supabase
    - **Authentication:** Supabase Auth (Magic Links)
    - **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel (with Serverless Functions for backend logic)
- **Mapping:** Mapbox GL JS

## 4. Current Goal: Fixing the Post-Login Redirect

**The Problem:**
After a user clicks the magic link in their email, they are successfully authenticated by Supabase. The browser is then redirected to `https://druid-five.vercel.app/login` with the authentication tokens (access_token, refresh_token, etc.) included as URL fragments (`#`). However, the Vue application on the `/login` page is not detecting this token and is not transitioning the user to an authenticated state (i.e., redirecting to the main map view). The user remains on the login page, even though they are technically authenticated in the URL.

**The Plan:**
The `LoginView.vue` component needs to be updated. When the component mounts, it must check the URL for the presence of an authentication token fragment. If a token is found, it should:
1.  Use the Supabase client library to set the user's session based on the token from the URL.
2.  Once the session is set and the user is confirmed to be logged in, redirect the user from the `/login` page to the main application view (e.g., `/`).
3.  This check should happen automatically as soon as the `LoginView` component is loaded.

**Action Steps:**
1.  Read the content of `src/views/LoginView.vue`.
2.  Modify the `<script setup>` section to include logic that runs on component mount (`onMounted`).
3.  Inside `onMounted`, add the Supabase `onAuthStateChange` listener. This is the standard way to handle logins via redirect. Supabase's library will automatically parse the URL fragment, set the session, and trigger the `SIGNED_IN` event.
4.  Inside the `onAuthStateChange` callback, when a `SIGNED_IN` event occurs, use Vue Router to programmatically navigate the user to the home/map page (`router.push('/')`).
5.  Write the updated content back to `src/views/LoginView.vue`.
6.  Commit and push the changes for a new deployment.
