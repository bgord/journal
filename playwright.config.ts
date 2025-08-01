import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./infra/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3000", trace: "on-first-retry" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "edge", use: { ...devices["Desktop Edge"] } },
  ],
  webServer: [
    {
      command: "bash bgord-scripts/test-server-start.sh",
      stdout: "pipe",
      stderr: "pipe",
      port: 3333,
      name: "bun-backend",
      timeout: 10_000, // 10s
      gracefulShutdown: { signal: "SIGTERM", timeout: 1_000 },
    },
    {
      command: "bash bgord-scripts/test-frontend-serve.sh",
      stdout: "pipe",
      stderr: "pipe",
      port: 3000,
      name: "vite-frontend",
      timeout: 10_000, // 10s
      gracefulShutdown: { signal: "SIGTERM", timeout: 1_000 },
    },
  ],
});
