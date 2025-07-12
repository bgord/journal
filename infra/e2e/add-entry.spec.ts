import { expect, test } from "@playwright/test";

test("Add entry - happy path", async ({ page }) => {
  await page.goto("/add-entry");

  // Step 1: Situation
  const situationHeader = page.getByText("Situation");
  await expect(situationHeader).toBeVisible();

  const situationDescription = page.getByLabel("What happened?");
  await expect(situationDescription).toBeVisible();

  const situationKind = page.getByLabel("Kind");
  await expect(situationKind).toBeVisible();

  const situationLocation = page.getByLabel("Location");
  await expect(situationLocation).toBeVisible();

  const nextButton = page.getByRole("button", { name: "Next" });
  await expect(nextButton).toBeDisabled();

  await situationDescription.fill("I went for a walk in the park");
  await situationKind.selectOption("social_event");
  await situationLocation.fill("Park");

  await expect(nextButton).toBeEnabled();
  await nextButton.click();

  // Step 2: Emotion
  const emotionHeader = page.getByText("Emotion");
  await expect(emotionHeader).toBeVisible();

  const emotionLabel = page.getByLabel("Label");
  await expect(emotionLabel).toBeVisible();

  const emotionIntensity = page.getByTestId("rating-4");
  await expect(emotionIntensity).toBeVisible();

  const backButtonToSituation = page.getByRole("button", { name: "Back" });
  await expect(backButtonToSituation).toBeVisible();

  const addReactionButton = page.getByRole("button", { name: "Next" });
  await expect(addReactionButton).toBeDisabled();

  await emotionLabel.selectOption("joy");
  await emotionIntensity.click();

  await expect(addReactionButton).toBeEnabled();
  await addReactionButton.click();

  // Step 3: Reaction
  const reactionHeader = page.getByText("Reaction");
  await expect(reactionHeader).toBeVisible();

  const reactionDescription = page.getByLabel("How did you react?");
  await expect(reactionDescription).toBeVisible();

  const reactionType = page.getByLabel("Type");
  await expect(reactionType).toBeVisible();

  const reactionEffectiveness = page.getByTestId("rating-5");
  await expect(reactionEffectiveness).toBeVisible();

  const backButtonToEmotion = page.getByRole("button", { name: "Back" });
  await expect(backButtonToEmotion).toBeVisible();

  const addButton = page.getByRole("button", { name: "Add" });
  await expect(addButton).toBeDisabled();

  await reactionDescription.fill("I smiled");
  await reactionType.selectOption("expression");
  await reactionEffectiveness.click();

  await expect(addButton).toBeEnabled();
  await addButton.click();

  // After submission
  await page.waitForURL("/");

  const newEntry = page.getByTestId("entry").first();
  await expect(newEntry).toBeVisible();

  const newEntrySituationDescription = newEntry.getByText("I went for a walk in the park");
  await expect(newEntrySituationDescription).toBeVisible();

  const newEntrySituationKind = newEntry.getByText("social_event");
  await expect(newEntrySituationKind).toBeVisible();

  const newEntrySituationLocation = newEntry.getByText("@Park");
  await expect(newEntrySituationLocation).toBeVisible();

  const newEntryEmotionLabel = newEntry.getByText("joy");
  await expect(newEntryEmotionLabel).toBeVisible();

  const newEntryReactionDescription = newEntry.getByText("I smiled");
  await expect(newEntryReactionDescription).toBeVisible();

  const newEntryReactionType = newEntry.getByText("expression");
  await expect(newEntryReactionType).toBeVisible();
});
