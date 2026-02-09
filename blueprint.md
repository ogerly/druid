# Blueprint: DRUID Application

## 1. Overview

DRUID is a mobile-first web application designed for users to discover and explore Celtic and pre-Christian historical sites. It features an interactive map as its core, allowing users to record their own paths, discover Points of Interest (POIs), and immerse themselves in history and nature. The project is built with Vue.js 3, Vite, and Leaflet, with a strong focus on a clean, modern UI using Tailwind CSS and DaisyUI.

## 2. Design & Features Implemented

This section documents the project's features and design from the initial version to the current one.

### Version 1-5 (Summary)

*   **Core Functionality:** Established an interactive Leaflet map, geolocation, basic path recording, and SPA navigation with Vue Router.
*   **UI/UX:** Implemented a responsive mobile-first layout using a DaisyUI drawer, a navigation bar, and a sidebar.
*   **Data Management:** Fetched and displayed POIs from a mock data source and laid the groundwork for state management.
*   **Architecture:** Built on a modern Vue 3 foundation with TypeScript, `<script setup>`, and a composable-based architecture.

### Version 6 (Enhanced Tracking and Data Management)

*   **Flexible Tracking Interval:** Added a setting in the `SettingsView` to allow users to configure the GPS tracking interval in seconds. This provides flexibility for different activities like city walks versus hiking.
*   **JSON Data Export:** Implemented a feature in the `TracksView` to export recorded GPS tracks as a JSON file. This allows for data backup, analysis, and sharing.
*   **JSON Data Import & Visualization:**
    *   Created a function to import GPS track data from a JSON file.
    *   Visualized the imported track on the `MapView` as a polyline, connecting the GPS coordinates.
    *   Added a sample `wanderstrecke.json` file in the `public` directory to serve as a test case.

## 3. Current Plan: Refined Tracking & Data Portability

Based on direct user feedback, this phase refines the tracking functionality to be more context-aware and improves data handling by using realistic test data and providing export capabilities.

1.  **Create Realistic Test Data:**
    *   Research a real, publicly available hiking trail in Germany (e.g., a section of the Harzer-Hexen-Stieg).
    *   Create a `public/wanderstrecke.json` file containing the actual GPS coordinates (latitude, longitude) from this trail to serve as a high-quality, realistic test case.

2.  **Implement Simplified Tracking Interval Setting:**
    *   In `SettingsView.vue`, instead of a number input, add a simple toggle or button group with two options:
        *   **"Stadt" (City):** Sets the tracking interval to 30 seconds.
        *   **"Wandern" (Hiking):** Sets the tracking interval to 60 seconds.
    *   Create a `settingsStore.ts` to persist this choice.
    *   The `trackingEngine.ts` will read the selected interval from this store.

3.  **Implement JSON Export:**
    *   In `TracksView.vue`, add an "Export" button next to each saved track.
    *   Clicking the button will trigger a download of the track's coordinate data as a JSON file (e.g., `track-1689686400000.json`).

4.  **Implement Test Track Visualization:**
    *   Add a "Load Test Track" button to `MapView.vue`.
    *   This button will fetch and parse the `public/wanderstrecke.json` file.
    *   The coordinates will be used to draw a polyline on the map, visualizing the entire hiking trail.
