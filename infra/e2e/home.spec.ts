import { expect, test } from "@playwright/test";

test("Home - layout", async ({ page }) => {
  await page.goto("/");

  const homeLink = page.getByRole("banner").getByRole("link", { name: "Journal" });
  await expect(homeLink).toBeVisible();
  await expect(homeLink).toHaveAttribute("href", "/");

  const addEntryLink = page.getByRole("link", { name: "Add entry" });
  await expect(addEntryLink).toBeVisible();
  await expect(addEntryLink).toHaveAttribute("href", "/add-entry");

  const addEntryIcon = addEntryLink.locator("svg");
  await expect(addEntryIcon).toBeVisible();

  const entries = page.getByTestId("entry");
  const count = await entries.count();
  expect(count).toBeGreaterThanOrEqual(10);

  const entry = page
    .getByTestId("entry")
    .filter({ hasText: "Caught in traffic swearing about other drivers" })
    .filter({ hasText: "work" });
  await expect(entry).toBeVisible();

  const whatHappened = entry.getByText("What happened?");
  await expect(whatHappened).toBeVisible();

  const situationLocation = entry.getByText("@Car");
  await expect(situationLocation).toBeVisible();

  const situationKind = entry.getByText("work");
  await expect(situationKind).toBeVisible();

  const situationDescription = entry.getByText("Caught in traffic swearing about other drivers");
  await expect(situationDescription).toBeVisible();

  const emotionLabel = entry.getByText("surprise_positive");
  await expect(emotionLabel).toBeVisible();

  const emotionIntensity = entry.locator("section").filter({ hasText: "What happened?" }).locator("svg");
  await expect(emotionIntensity.locator('rect[fill="var(--brand-400)"]')).toHaveCount(5);

  const whatWasYourReaction = entry.getByText("How did you react?");
  await expect(whatWasYourReaction).toBeVisible();

  const reactionType = entry.getByText("problem_solving");
  await expect(reactionType).toBeVisible();

  const reactionEffectiveness = entry
    .locator("section")
    .filter({ hasText: "What was your reaction?" })
    .locator("svg");
  await expect(reactionEffectiveness.locator('rect[fill="var(--brand-400)"]')).toHaveCount(5);

  const reactionDescription = entry.getByText("Wrote in journal");
  await expect(reactionDescription).toBeVisible();
});
