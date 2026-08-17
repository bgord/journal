import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Emotions from "+emotions";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Emotions.Commands.ScheduleTimeCapsuleEntryCommandType>;
};

export const ScheduleTimeCapsuleEntry = (deps: Dependencies):bg.EndpointPort => async (context) => {
  const body = await context.request.json();

  const userId = context.identity.authenticatedUserId();
  const timeZoneOffset = context.middleware.timeZoneOffset();
  const entryId = v.parse(Emotions.VO.EntryId, deps.IdProvider.generate());
  const situationDescription = v.parse(Emotions.VO.SituationDescriptionSchema, body["situationDescription"]);
  const situationKind = v.parse(Emotions.VO.SituationKindSchema, body["situationKind"]);
  const emotionLabel = v.parse(Emotions.VO.EmotionLabelSchema, body["emotionLabel"]);
  const emotionIntensity = v.parse(Emotions.VO.EmotionIntensitySchema, body["emotionIntensity"]);
  const reactionDescription = v.parse(Emotions.VO.ReactionDescriptionSchema, body["reactionDescription"]);
  const reactionType = v.parse(Emotions.VO.ReactionTypeSchema, body["reactionType"]);
  const reactionEffectiveness = v.parse(
    Emotions.VO.ReactionEffectivenessSchema,
    body["reactionEffectiveness"],
  );
  const scheduledForDay = v.parse(tools.DayIsoId, body["scheduledFor"]);
  const scheduledForHour = v.parse(tools.HourValue, body["scheduledForHour"]);

  const situation = new Emotions.Entities.Situation(
    new Emotions.VO.SituationDescription(situationDescription),
    new Emotions.VO.SituationKind(situationKind),
  );

  const emotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(emotionLabel),
    new Emotions.VO.EmotionIntensity(emotionIntensity),
  );

  const reaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(reactionDescription),
    new Emotions.VO.ReactionType(reactionType),
    new Emotions.VO.ReactionEffectiveness(reactionEffectiveness),
  );

  const scheduledAt = deps.Clock.now().ms;
  const scheduledFor = tools.Day.fromIsoId(scheduledForDay)
    .getStart()
    .add(timeZoneOffset)
    .add(tools.Duration.Hours(tools.Hour.fromValueSafe(scheduledForHour).get())).ms;

  const command = bg.command(
    Emotions.Commands.ScheduleTimeCapsuleEntryCommand,
    { payload: { entryId, situation, emotion, reaction, userId, scheduledAt, scheduledFor } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
