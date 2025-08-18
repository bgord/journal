import type * as Emotions from "+emotions";

export const handleCompleteAlarmCommand =
  (repo: Emotions.Ports.AlarmRepositoryPort) =>
  async (command: Emotions.Commands.CompleteAlarmCommandType) => {
    const alarm = await repo.load(command.payload.alarmId);
    alarm.complete();
    await repo.save(alarm);
  };
