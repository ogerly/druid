# WHITEPAPER: Secrets and Environment Variable Management

- **ID:** `WP-002-SECRETS-MANAGEMENT`
- **Status:** `ACTIVE`

---

## 1. Context & Problem

The project requires the use of sensitive API keys and credentials (e.g., Supabase keys). These secrets must **never** be committed to the Git repository to prevent security breaches.

---

## 2. Decision

We will implement a strict separation of secrets from the codebase using environment variables loaded from `.env` files. These files are explicitly excluded from Git.

### Implementation

1.  **`.gitignore`:** The global `.gitignore` file is the first line of defense. It contains the following rules to prevent any environment file from ever being tracked:

    ```
    .env
    .env.*
    !.env.example
    ```

2.  **Server-Side Secrets:** All sensitive keys, especially the `SUPABASE_SERVICE_ROLE_KEY`, are used **exclusively** on the server-side (`/server` directory).

3.  **`.env.example` File:** For each location requiring an `.env` file (e.g., the `/server` directory), a corresponding `.env.example` file **MUST** be created and committed to the repository. This file acts as a template, listing all required environment variables with placeholder or empty values.

    *Example (`server/.env.example`):*
    ```
    # Supabase credentials
    SUPABASE_URL="YOUR_SUPABASE_URL_HERE"
    SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE"
    ```

---

## 3. Justification & Protocol

*   **Security:** This is the industry-standard method for preventing secret leakage in open-source and private repositories.
*   **Collaboration:** New developers can clone the repository, copy the `.env.example` to `.env`, and fill in their own credentials, enabling them to get the project running without requesting secrets directly.

**Under no circumstances shall a file containing secrets be committed to Git. All secrets must be managed via untracked `.env` files.**