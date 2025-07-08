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
      command: "bash test-server-start.sh",
      url: "http://127.0.0.1:3333",
      stdout: "pipe",
      stderr: "pipe",
      port: 3333,
      name: "bun-backend",
      timeout: 10_000, // 10s
      gracefulShutdown: { signal: "SIGTERM", timeout: 1_000 },
      reuseExistingServer: !process.env.CI,
    },
  ],
});
