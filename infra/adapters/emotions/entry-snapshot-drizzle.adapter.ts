import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import type { EntrySnapshotPort } from "+emotions/ports";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import type { SupportedLanguages } from "+infra/i18n";
import * as Schema from "+infra/schema";

export class EntrySnapshotDrizzle implements EntrySnapshotPort {
  async getById(entryId: VO.EntryIdType) {
    const result = await db.query.entries.findFirst({
      where: eq(Schema.entries.id, entryId),
    });

    if (!result) return undefined;

    return {
      ...result,
      startedAt: tools.Timestamp.parse(result.startedAt),
      status: result.status as VO.EntryStatusEnum,
      situationKind: result.situationKind as VO.SituationKindOptions,
      emotionLabel: result.emotionLabel as VO.GenevaWheelEmotion | null,
      reactionType: result.reactionType as VO.GrossEmotionRegulationStrategy | null,
      language: result.language as SupportedLanguages,
      origin: result.origin as VO.EntryOriginOption,
    };
  }
}
