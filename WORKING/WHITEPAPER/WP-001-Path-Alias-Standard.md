# WHITEPAPER: Project-Wide Path Alias Configuration

- **ID:** `WP-001-PATH-ALIAS`
- **Status:** `ACTIVE`

---

## 1. Context & Problem

As the project grows, using relative paths for imports (e.g., `../../components/common`) becomes verbose, error-prone, and difficult to refactor. A clean, scalable solution is needed.

---

## 2. Decision

We will use a path alias throughout the project. The `@` symbol is designated as an alias for the `/src` directory.

### Implementation

This is configured in the `vite.config.ts` file:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // ... other config
})
```

---

## 3. Justification & Best Practices

*   **Readability:** Imports are clean and consistent (e.g., `import MyComponent from '@/components/MyComponent.vue';`).
*   **Maintainability:** Code can be moved between directories without needing to update import paths.
*   **Standard:** This is a standard, community-accepted practice in modern frontend development.

**All new code MUST adhere to this standard and use the `@` alias for any imports referencing the `src` directory.**