import type { BootstrapType } from "+infra/bootstrap";
import * as Projections from "+infra/projections";

export function registerProjectors({ Adapters, Tools }: Pick<BootstrapType, "Adapters" | "Tools">) {
  const deps = { ...Adapters.System, ...Tools };

  new Projections.EntryProjector(deps);
  new Projections.AlarmProjector(deps);
  new Projections.PatternDetectionProjector(deps);
  new Projections.WeeklyReviewProjector(deps);
  new Projections.ShareableLinkProjector(deps);
  new Projections.AiUsageCounterProjector(deps);
  new Projections.HistoryProjector({ ...deps, ...Adapters.History });
  new Projections.ShareableLinkHitProjector(deps);
  new Projections.PreferencesProjector(deps);
  new Projections.ProfileAvatarsProjector(deps);
}
