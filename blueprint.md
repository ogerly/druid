# Blueprint: DRUID Application

## 1. Overview

DRUID is a mobile-first web application designed for users to discover and explore Celtic and pre-Christian historical sites. It features an interactive map as its core, allowing users to record their own paths, discover Points of Interest (POIs), and immerse themselves in history and nature. The project is built with Vue.js 3, Vite, and Leaflet, with a strong focus on a clean, modern UI using Tailwind CSS and DaisyUI.

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

### Version 4 (Architecture Refactoring: Tailwind & DaisyUI)

*   **Dependency Upgrade:** Integrated `tailwindcss`, `postcss`, `autoprefixer`, and `daisyui` to establish a robust and modern styling foundation.
*   **Layout Overhaul:** Replaced a custom CSS layout with a professional-grade `drawer` layout from DaisyUI for a responsive, consistent, and maintainable structure.
*   **Component Refactoring:** Rebuilt `App.vue`, `TheNavbar.vue`, `TheSidebar.vue`, and `MapView.vue` using Tailwind and DaisyUI utility classes, simplifying code and removing layout hacks.

### Version 5 (SPA Navigation with Vue Router)

*   **Dependency:** Added `vue-router` to the project.
*   **Routing Configuration:** Created a `src/router/index.js` file with lazy-loaded routes for all main views (`Map`, `Places`, `Calendar`, `Profile`, `Settings`).
*   **Application Integration:** Integrated the router into the main Vue instance (`main.js`) and used `<router-view>` in `App.vue` to enable SPA functionality.
*   **Seamless Navigation:** Updated `TheSidebar.vue` to use `<router-link>`, enabling client-side navigation without page reloads.
*   **View Placeholders:** Created placeholder components for each new route in the `src/views` directory.

## 3. Current Plan: Develop "Places" View

This phase will build out the "Places" view to display a list of all Points of Interest. It will also introduce a state management solution to allow interaction between the `PlacesView` and the `MapView`.

1.  **Install Pinia:**
    *   Add `pinia`, the official state management library for Vue, to the project dependencies.
    *   Integrate Pinia into the main Vue application instance (`main.js`).

2.  **Create a Map Store:**
    *   Create a new file `src/stores/mapStore.js`.
    *   Define a Pinia store to manage the map's state, including its center coordinates and zoom level.

3.  **Refactor `MapView.vue`:**
    *   Connect `MapView.vue` to the new Pinia store.
    *   The map's center and zoom level should be read from and updated in the store.

4.  **Implement `PlacesView.vue`:**
    *   Fetch the list of POIs using the existing `usePois` composable.
    *   Display the POIs in a styled list or card layout using DaisyUI components.
    *   For each item in the list, add a button or link ("Show on Map").

5.  **Enable Interactivity:**
    *   When a user clicks "Show on Map" for a specific POI:
        *   The action will call a function in the Pinia store to update the map's center to the coordinates of that POI.
        *   The user will then be programmatically navigated back to the `MapView` (`/`).
    *   The map, now connected to the store, will automatically center on the selected POI.
