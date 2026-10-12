import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  outputDir: "../../reports/e2e-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  retries: 0,
  workers: 4,
  timeout: 10_000,
  reporter: process.env["CI"]
    ? [["github"], ["list"], ["html", { open: "never", outputFolder: "../../reports/e2e-report" }]]
    : "list",
  use: { baseURL: "http://localhost:3000", trace: "retain-on-failure" },
  projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "bash bgord-scripts/server-start-test.sh",
      cwd: "../..",
      stdout: "pipe",
      stderr: "pipe",
      port: 3000,
      name: "bun-backend",
      timeout: process.env["CI"] ? 60_000 : 20_000,
      gracefulShutdown: { signal: "SIGTERM", timeout: 1_000 },
    },
  ],
});
