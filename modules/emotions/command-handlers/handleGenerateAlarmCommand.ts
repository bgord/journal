import * as Emotions from "+emotions";

export const handleGenerateAlarmCommand = async (command: Emotions.Commands.GenerateAlarmCommandType) => {
  await Emotions.Services.AlarmFactory.create(
    command.payload.alarmName,
    command.payload.trigger,
    command.payload.userId,
  );
};
