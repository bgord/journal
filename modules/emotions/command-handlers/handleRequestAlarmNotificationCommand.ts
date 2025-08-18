import type * as Emotions from "+emotions";

export const handleRequestAlarmNotificationCommand =
  (repo: Emotions.Ports.AlarmRepositoryPort) =>
  async (command: Emotions.Commands.RequestAlarmNotificationCommandType) => {
    const alarm = await repo.load(command.payload.alarmId);
    alarm.notify();
    await repo.save(alarm);
  };
