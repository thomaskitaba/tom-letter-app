// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // Set the environment to Node.js
    globals: true,       // Use Vitest's global expect function
  },
});
