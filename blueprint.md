# Blueprint: DRUID Application

## 1. Overview

DRUID is a mobile-first web application designed for users to discover and explore Celtic and pre-Christian historical sites. It features an interactive map as its core, allowing users to record their own paths, discover Points of Interest (POIs), and immerse themselves in history and nature. The project is built with Vue.js 3, Vite, and Leaflet.

## 2. Design & Features Implemented

This section documents the project's features and design from the initial version to the current one.

### Version 1 (Initial Setup)

*   **Core Map Functionality:**
    *   Interactive map using Leaflet.js (`vue-leaflet`).
    *   Users can place markers by clicking on the map.
*   **Geolocation:**
    *   "Center on Me" button to find and center the map on the user's current location.
*   **Path Recording:**
    *   "Start/Stop Recording" button to draw a polyline path on the map by clicking.
    *   "Clear Path" button to remove the recorded path.
*   **Composable Logic:**
    *   Extracted map-related logic into a `useMap.js` composable for better organization and reusability.

### Version 2 (Layout & UI Refinement)

*   **Git Repository:**
    *   Initialized a local Git repository.
    *   Connected and pushed the initial project to the `ogerly/druid` GitHub repository.
    *   Created a comprehensive `README.md` file outlining the project's vision and technical details.
*   **Mobile-First Layout:**
    *   Implemented a responsive, mobile-first layout structure.
    *   **`TheNavbar.vue`:** A fixed navigation bar at the top of the screen.
    *   **`TheSidebar.vue`:** A dynamic, slide-in sidebar for navigation, controlled by a hamburger icon in the navbar.
    *   **`App.vue` Refactor:** The main component was updated to orchestrate the new layout, managing the sidebar's open/closed state.
*   **UI/UX Improvements:**
    *   **Centralized Controls:** Moved the map action buttons ("Center on Me", "Record", "Clear") from the map overlay into `TheNavbar.vue` as intuitive icon buttons.
    *   **Visual Feedback:** The record button in the navbar now visually indicates the `isRecording` state (e.g., turns red).
    *   **CSS Fix:** Corrected a `box-sizing` issue in the navbar to prevent it from overflowing the screen width, ensuring all controls are visible.

## 3. Current Plan

*There are no active development tasks. The project is in a stable state, awaiting the next set of feature requests.*
