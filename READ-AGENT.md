# READ-AGENT.md - Agent Workspace Contract

**_Last Updated:_** 2026-03-02 by Gemini

## 1. Project Overview

This is a **Vue.js 3** front-end application built with **Vite** and styled with **Tailwind CSS**. The project is written in **TypeScript**.

The application is named "DRUID" and appears to involve mapping features, indicated by files like `useMap.js`, `MapView.vue`, and mentions of POIs (Points of Interest). It is configured to use Supabase, though the specific integration is yet to be detailed.

## 2. Agent Mandate & Rules of Engagement

Any agent operating in this repository **MUST** adhere to the **AAMS (Autonomous Agent Manifest Specification)**.

*   **Contract File:** The primary contract is defined in `.agent.json`.
*   **Workspace:** All agent-generated output (documentation, plans, logs) MUST reside within the `WORKING/` directory.
*   **Documentation:** Follow the three-layer model:
    *   **Workpapers (`WORKING/WORKPAPER/`):** For session-specific tasks. Create a new one for each distinct goal.
    *   **Whitepapers (`WORKING/WHITEPAPER/`):** For stable, long-term architecture decisions.
    *   **Memory (`WORKING/MEMORY/`):** For ingesting key learnings from workpapers.
*   **Secrets:** Never commit secrets or API keys. Use `.env` files or a dedicated secret manager.
*   **Idempotency:** All setup operations must be idempotent. Assume the workspace may already exist.

## 3. How to Start a Session

1.  **Consult this file (`READ-AGENT.md`)** to understand the current state.
2.  **Query the Memory (`WORKING/MEMORY/ltm-index.md`)** for context related to your task.
3.  **Create a new Workpaper** in `WORKING/WORKPAPER/` named `{date}-{agent}-{topic}.md`.
4.  State your `session_goal` clearly at the top of the new workpaper.
5.  Execute your tasks.
6.  At the end of the session, complete the workpaper, ingest learnings into memory, and move the workpaper to `WORKING/WORKPAPER/closed/`.

## 4. Current Project State (as of 2026-03-02)

*   **AAMS Initialized:** The workspace structure is in place.
*   **Initial Scan Complete:** The first workpaper, `2026-03-02-Gemini-Initial-Repo-Scan.md`, documents the repository's state at the time of initialization.
*   **Legacy Docs:** A `docs/` directory with a similar structure to AAMS exists. Its contents need to be reviewed and potentially migrated.
*   **Next Action:** Awaiting user clarification on open questions listed in the initial workpaper before proceeding with further development or documentation indexing.
