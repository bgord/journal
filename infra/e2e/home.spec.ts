import { expect, test } from "@playwright/test";

test("Sign in - layout", async ({ page }) => {
  await page.goto("/login");

  const header = page.getByText("Journal");
  await expect(header).toBeVisible();
});
