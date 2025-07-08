import { test } from "@playwright/test";

test("Home", async ({ page }) => {
  await page.goto("/");

  // Login
  // await expect(page.getByRole("heading", { name: "raok" })).toBeVisible();
  // await page.getByLabel("Admin username").fill(admin.username);
  // await page.getByLabel("Admin password").fill(admin.password);
  // await page.getByRole("button", { name: "Login" }).click();
});
