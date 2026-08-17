import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Emotions from "+emotions";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Emotions.Commands.ReappraiseEmotionCommandType>;
};

export const ReappraiseEmotion =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const entryId = v.parse(Emotions.VO.EntryId, params["entryId"]);
    const label = v.parse(Emotions.VO.EmotionLabelSchema, body["label"]);
    const intensity = v.parse(Emotions.VO.EmotionIntensitySchema, body["intensity"]);

    const newEmotion = new Emotions.Entities.Emotion(
      new Emotions.VO.EmotionLabel(label),
      new Emotions.VO.EmotionIntensity(intensity),
    );

    const command = bg.command(
      Emotions.Commands.ReappraiseEmotionCommand,
      { revision: context.middleware.revision.fromWeakETag(), payload: { entryId, newEmotion, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
