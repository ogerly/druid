# Blueprint: DRUID Application

## 1. Overview

DRUID is a mobile-first web application designed for users to discover and explore Celtic and pre-Christian historical sites. It features an interactive map as its core, allowing users to record their own paths, discover Points of Interest (POIs), and immerse themselves in history and nature. The project is built with Vue.js 3, Vite, and Leaflet.

## 2. Design & Features Implemented

This section documents the project's features and design from the initial version to the current one.

### Version 1 (Initial Setup)

*   **Core Map Functionality:** Interactive map using Leaflet.js, marker placement.
*   **Geolocation:** "Center on Me" functionality.
*   **Path Recording:** Start/Stop/Clear path recording.
*   **Composable Logic:** Map logic extracted into `useMap.js`.

### Version 2 (Layout & UI Refinement)

*   **Git Repository & Docs:** Initialized Git, created `README.md`, `WHITEPAPER.md` and `blueprint.md`.
*   **Mobile-First Layout:** Implemented `TheNavbar.vue` and `TheSidebar.vue`.
*   **UI/UX Improvements:** Moved map controls to the navbar, added visual feedback for recording, and fixed CSS layout issues.

### Version 3 (Points of Interest)

*   **Mock Data:** Created a `pois.js` file with sample data.
*   **Data Composable:** Developed `usePois.js` to fetch and manage POI data.
*   **Map Display:** Rendered POIs on the map with category-specific colored markers and descriptive popups.

## 4. Current Plan: SPA Navigation & Sidebar Views

This phase will transform the application from a single-view map into a full Single-Page Application (SPA) by implementing routing and creating the views for the sidebar navigation.

1.  **Install Vue Router:**
    *   Add `vue-router` to the project dependencies.

2.  **Configure Routes:**
    *   Create a `src/router/index.js` file.
    *   Define routes for the following pages:
        *   `/` (Map)
        *   `/places` (Places List)
        *   `/calendar` (Wheel-of-the-Year)
        *   `/profile` (User Profile)
        *   `/settings` (Settings)

3.  **Create View Components:**
    *   Create placeholder Vue components for the new views inside `src/views`:
        *   `PlacesView.vue`
        *   `CalendarView.vue`
        *   `ProfileView.vue`
        *   `SettingsView.vue`

4.  **Integrate Router:**
    *   Update `main.js` to install and use the router plugin.
    *   Modify `App.vue` to use the `<router-view>` component to display the current page.

5.  **Update Sidebar Navigation:**
    *   Modify `TheSidebar.vue` to use `<router-link>` components to link to the newly created pages, providing a seamless navigation experience.
