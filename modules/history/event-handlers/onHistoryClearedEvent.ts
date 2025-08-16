import * as History from "+history";

export const onHistoryClearedEvent =
  (repository: History.Repos.HistoryRepositoryPort) =>
  async (event: History.Events.HistoryClearedEventType) => {
    await repository.clear(event.payload.subject);
  };
