import * as bg from "@bgord/bun";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusLike<Emotions.Commands.LogEntryCommandType>;
};

export const LogEntry = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const body = await bg.safeParseBody(c);

  const entryId = deps.IdProvider.generate();

  const situation = new Emotions.Entities.Situation(
    new Emotions.VO.SituationDescription(body.situationDescription),
    new Emotions.VO.SituationKind(body.situationKind),
  );

  const emotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(body.emotionLabel),
    new Emotions.VO.EmotionIntensity(body.emotionIntensity),
  );

  const reaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(body.reactionDescription),
    new Emotions.VO.ReactionType(body.reactionType),
    new Emotions.VO.ReactionEffectiveness(body.reactionEffectiveness),
  );

  const command = Emotions.Commands.LogEntryCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Emotions.Commands.LOG_ENTRY_COMMAND,
    payload: { entryId, situation, emotion, reaction, userId, origin: Emotions.VO.EntryOriginOption.web },
  } satisfies Emotions.Commands.LogEntryCommandType);

  await deps.CommandBus.emit(command.name, command);

  return new Response();
};
