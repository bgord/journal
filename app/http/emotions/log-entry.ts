import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Emotions.Commands.LogEntryCommandType>;
};

export const LogEntry = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const body = await context.request.json();

  const userId = context.identity.userId() as bg.UUIDType;
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

  const command = bg.command(
    Emotions.Commands.LogEntryCommand,
    { payload: { entryId, situation, emotion, reaction, userId, origin: Emotions.VO.EntryOriginOption.web } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
