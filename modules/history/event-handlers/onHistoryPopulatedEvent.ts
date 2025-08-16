import * as History from "+history";

export const onHistoryPopulatedEvent =
  (repository: History.Repos.HistoryRepositoryPort) =>
  async (event: History.Events.HistoryPopulatedEventType) => {
    const data = History.VO.HistoryParsed.parse(event.payload);
    await repository.append(data, event.createdAt);
  };
