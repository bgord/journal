import { expect, test } from "@playwright/test";

test("Home - layout", async ({ page }) => {
  await page.goto("/");

  const journalLink = page.getByRole("banner").getByRole("link", { name: "Journal" });
  await expect(journalLink).toBeVisible();
  await expect(journalLink).toHaveAttribute("href", "/");

  const addEntryLink = page.getByRole("link", { name: "Add journal entry" });
  await expect(addEntryLink).toBeVisible();
  await expect(addEntryLink).toHaveAttribute("href", "/add-journal-entry");

  const addEntryIcon = addEntryLink.locator("svg");
  await expect(addEntryIcon).toBeVisible();

  const entries = page.getByTestId("entry");
  await expect(entries).toHaveCount(10);

  const entry = entries.first();

  await expect(entry).toBeVisible();
});
