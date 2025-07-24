import * as Patterns from "+emotions/services/patterns";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class PatternsRepository {
  static async create(event: Patterns.PatternDetectionEventType) {
    await db.insert(Schema.patternDetections).values({
      id: event.id,
      name: event.payload.name,
      userId: event.payload.userId,
      createdAt: event.createdAt,
      weekIsoId: event.payload.weekIsoId,
    });
  }
}
