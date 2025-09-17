import { expect, test } from "@playwright/test";

test("Home - layout", async ({ page }) => {
  await page.goto("/");

  const homeLink = page.getByRole("banner").getByRole("link", { name: "Journal" });
  await expect(homeLink).toBeVisible();
  await expect(homeLink).toHaveAttribute("href", "/");
});
