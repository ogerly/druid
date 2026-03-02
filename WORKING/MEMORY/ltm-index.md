# 🧠 AAMS Long-Term Memory Index

**_Last Updated:_** 2026-03-02

This index serves as the single source of truth for all core concepts, architectural decisions, and key project data. It is populated from insights gained during workpaper sessions.

---

## 1. Core Project: "DRUID" (or "NEMETON")

*   **Entry Date:** 2026-03-02
*   **Source:** `WORKING/WHITEPAPER/Legacy-Konzept.md`, `WORKING/WHITEPAPER/Legacy-Ideen-zu-DRUID.md`

### 1.1 Vision & Core Concept

DRUID is a high-end web application and mobile app designed to bridge the gap between archaeological precision and modern nature spirituality. It provides users with a map-based tool to explore historically significant and personally meaningful locations, all while contextualized by a unique lunisolar calendar.

### 1.2 Key Features

1.  **Interactive Map (Primary UI):**
    *   The application's home screen is a full-screen map (e.g., Mapbox/Google Maps with a nature-themed style).
    *   It displays Points of Interest (POIs) that are categorized by their evidence level.
    *   Includes a GPS focus button and supports user-generated content (UGC).

2.  **The "Calendar Wheel":**
    *   A unique, radial UI that visualizes time as a cycle, not a linear list.
    *   It synchronizes three layers: the 8 major solar festivals, the 12-13 Celtic lunar months (Coligny calendar), and the real-time phase of the moon.
    *   It is designed to be interactive, with pinch-to-zoom and segment expansion for detail.

### 1.3 The Evidence Labeling System (USP)

This is the core feature ensuring the app's credibility. All POIs are classified:

*   **Level 1 (Archaeological):** Scientifically verified sites (e.g., Glauberg).
*   **Level 2 (Reconstructed):** Historically plausible or traditionally significant sites (e.g., Externsteine).
*   **Level 3 (Modern / Nature):** Subjective places of interest, modern meeting spots, or natural wonders. User-submitted POIs are automatically assigned this level.

### 1.4 Technical Architecture (Security-First)

*   **Three-Tier Architecture:**
    *   **Frontend (This Project):** A Vue.js/Vite application responsible for UI/UX only. **It must not contain any secret keys.**
    *   **Backend (Middleware):** A separate service (e.g., Node.js, Python) that holds all secrets (`.env` file), authenticates users, validates all incoming data, and communicates with the database.
    *   **Database (Supabase):** A PostgreSQL database with the PostGIS extension for high-performance geographic queries. Supabase is used as the data store, but all access is brokered through the secure middleware.

*   **API-Driven:** The frontend communicates with the backend via a well-defined REST API with endpoints for `/map`, `/calendar`, and `/events`.

### 1.5 Monetization Strategy

*   **Event Marketplace:** Paid placements for workshops, festivals, etc., in an in-app event ticker.
*   **Premium Subscriptions:** A paid tier for advanced calendar features and detailed astrological data.
