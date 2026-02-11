import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklyReviewExportByEmail", async () => {
  const di = await bootstrap();
  const saga = new Emotions.Sagas.WeeklyReviewExportByEmail({
    ...di.Adapters.System,
    ...di.Tools,
    PdfGenerator: di.Adapters.Emotions.PdfGenerator,
    UserContactOHQ: di.Adapters.Auth.UserContactOHQ,
    WeeklyReviewExportQuery: di.Adapters.Emotions.WeeklyReviewExportQuery,
    UserLanguageOHQ: di.Adapters.Preferences.UserLanguageOHQ,
    RetryBackoffStrategy: new bg.RetryBackoffLinearStrategy(tools.Duration.Minutes(1)),
    EMAIL_FROM: di.Env.EMAIL_FROM,
  });

  const config = { from: di.Env.EMAIL_FROM, to: mocks.email };

  test("onWeeklyReviewExportByEmailRequestedEvent - no email", async () => {
    using _ = spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(undefined);
    using weeklyReviewExportQuery = spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
    expect(mailerSend).not.toHaveBeenCalled();
    expect(weeklyReviewExportQuery).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - user repo failure", async () => {
    using _ = spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockImplementation(
      mocks.throwIntentionalErrorAsync,
    );
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailFailedEvent]);
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - no weeklyReview", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact));
    spies.use(spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockResolvedValue(undefined));
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - weeklyReview failure", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact));
    spies.use(
      spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockImplementation(
        mocks.throwIntentionalErrorAsync,
      ),
    );
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailFailedEvent]);
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - mailer failure", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.Mailer, "send").mockImplementation(mocks.throwIntentionalErrorAsync));
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    spies.use(
      spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockResolvedValue(
        mocks.weeklyReviewFull,
      ),
    );
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailFailedEvent]);
  });

  test("onWeeklyReviewExportByEmailRequestedEvent", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn()));
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    spies.use(
      spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockResolvedValue(
        mocks.weeklyReviewFull,
      ),
    );
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      config,
      message: {
        subject: `JOURNAL - weekly review ${mocks.weekStart} - ${mocks.weekEnd}`,
        html: "Find the file attached",
      },
      attachments: [
        {
          filename: tools.Filename.fromString(`weekly-review-export-${mocks.week.toIsoId()}.pdf`).get(),
          content: mocks.PDF,
          contentType: "application/pdf",
        },
      ],
    });
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 1st", async () => {
    using sleeperWait = spyOn(di.Adapters.System.Sleeper, "wait");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using _ = spyOn(Bun, "sleep").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent),
    );

    expect(sleeperWait).toHaveBeenCalledWith(tools.Duration.Minutes(1));
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailRequestedEvent2nd]);
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 2nd", async () => {
    using sleeperWait = spyOn(di.Adapters.System.Sleeper, "wait");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using _ = spyOn(Bun, "sleep").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent2nd),
    );

    expect(sleeperWait).toHaveBeenCalledWith(tools.Duration.Minutes(2));
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailRequestedEvent3rd]);
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 3rd", async () => {
    using sleeperWait = spyOn(di.Adapters.System.Sleeper, "wait");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using _ = spyOn(Bun, "sleep").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent3rd),
    );

    expect(sleeperWait).toHaveBeenCalledWith(tools.Duration.Minutes(3));
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailRequestedEvent4th]);
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 4rd", async () => {
    using sleeperWait = spyOn(di.Adapters.System.Sleeper, "wait");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using _ = spyOn(Bun, "sleep").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent4th),
    );

    expect(sleeperWait).not.toHaveBeenCalled();
    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
