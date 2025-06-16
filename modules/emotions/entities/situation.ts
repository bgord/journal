import { SituationDescription } from "../value-objects/situation-description";
import { SituationKind } from "../value-objects/situation-kind";
import { SituationLocation } from "../value-objects/situation-location";

export class Situation {
  constructor(
    public readonly description: SituationDescription,
    public readonly location: SituationLocation,
    public readonly kind: SituationKind,
  ) {}
}
