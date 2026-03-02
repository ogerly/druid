# Workpaper: Issue Report & Task Definition

**_Session Start:_** 2026-03-02

## 1. Session Goal

To formally report a critical issue identified during the initial repository scan and define it as an actionable task. This workpaper serves as the equivalent of a GitHub Issue.

## 2. Issue: Duplicate Documentation Structures

- **Title:** `Task: Consolidate Legacy docs/ Folder into AAMS Workspace`
- **Status:** `Open`
- **Priority:** `High`

### Description

**Context:** During the AAMS initialization (`2026-03-02-Gemini-Initial-Repo-Scan.md`), a new `WORKING/` directory was created to serve as the single source of truth for all agent-managed documentation, including workpapers, whitepapers, and long-term memory, as per the `.agent.json` contract.

**Problem:** The repository contains a pre-existing `docs/` folder which mirrors the AAMS structure (e.g., `docs/WORKPAPER`, `docs/WITEPAPER`). This creates two competing sources of truth. This redundancy will lead to confusion for both human developers and AI agents, fragmented context, and makes maintaining documentation difficult and error-prone.

**Goal:** To maintain a single, coherent, and authoritative knowledge base, the legacy `docs/` folder must be deprecated, and its valuable contents must be migrated into the official `WORKING/` directory.

### Acceptance Criteria

1.  **Review & Triage:** All files within the `docs/` directory must be reviewed to determine their relevance and purpose.
2.  **Migrate Whitepapers:** Conceptual and architectural documents (e.g., `Konzept.md`, `Ideen und gedanken zu DRUID.md`) should be moved to `WORKING/WHITEPAPER/`.
3.  **Archive Workpapers:** Old session documents from `docs/WORKPAPER/` should be moved to the `WORKING/WORKPAPER/closed/` directory.
4.  **Update Memory:** Key insights and decisions from the migrated documents must be summarized and ingested into the long-term memory index (`WORKING/MEMORY/ltm-index.md`).
5.  **Deprecate Old Folder:** After a successful and verified migration, the original `docs/` folder must be deleted.

## 3. File Protocol

| Action   | Path                                                              |
| :------- | :---------------------------------------------------------------- |
| **CREATE** | `WORKING/WORKPAPER/2026-03-02-Gemini-Issue-Legacy-Docs-Report.md` |

## 4. Next Steps

Awaiting approval to execute the migration task outlined above.
