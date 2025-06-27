import * as Emotions from "../";

export const handleGenerateAlarmCommand = async (command: Emotions.Commands.GenerateAlarmCommandType) => {
  await Emotions.Services.AlarmCreator.create(
    command.payload.alarmName,
    command.payload.emotionJournalEntryId,
  );
};
