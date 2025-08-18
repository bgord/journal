import type * as Emotions from "+emotions";

export const handleSaveAlarmAdviceCommand =
  (repo: Emotions.Ports.AlarmRepositoryPort) =>
  async (command: Emotions.Commands.SaveAlarmAdviceCommandType) => {
    const alarm = await repo.load(command.payload.alarmId);
    alarm.saveAdvice(command.payload.advice);
    await repo.save(alarm);
  };
