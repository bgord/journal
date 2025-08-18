import type * as Emotions from "+emotions";

export const handleCancelAlarmCommand =
  (repo: Emotions.Ports.AlarmRepositoryPort) => async (command: Emotions.Commands.CancelAlarmCommandType) => {
    const alarm = await repo.load(command.payload.alarmId);
    alarm.cancel();
    await repo.save(alarm);
  };
