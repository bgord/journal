import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Publishing from "+publishing";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ShareableLink.create", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const shareableLink = Publishing.Aggregates.ShareableLink.create(
        mocks.shareableLinkId,
        mocks.publicationSpecification,
        mocks.dateRange,
        mocks.durationMs,
        mocks.userId,
        deps,
      );

      expect(shareableLink.pullEvents()).toEqual([mocks.GenericShareableLinkCreatedEvent]);
    });
  });
});
