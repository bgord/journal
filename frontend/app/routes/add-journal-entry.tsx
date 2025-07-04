import * as UI from "@bgord/ui";
import { SituationDescription } from "../../../modules/emotions/value-objects/situation-description";
import { SituationKind } from "../../../modules/emotions/value-objects/situation-kind";
import { SituationLocation } from "../../../modules/emotions/value-objects/situation-location";
import { Select } from "../../components/select";
import type { Route } from "./+types/add-journal-entry";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export function loader() {
  return {
    situationDescription: {
      min: SituationDescription.MinimumLength,
      max: SituationDescription.MaximumLength,
    },
    situationLocation: {
      min: SituationLocation.MinimumLength,
      max: SituationLocation.MaximumLength,
    },
    situationKinds: SituationKind.all(),
  };
}

export default function AddJournalEntry({ loaderData }: Route.ComponentProps) {
  return (
    <main data-pb="36">
      <div
        className="entries-list"
        data-display="flex"
        data-direction="column"
        data-max-width="768"
        data-mx="auto"
        data-mt="72"
        data-pt="24"
      >
        <form
          data-display="flex"
          data-direction="column"
          data-shadow="sm"
          data-p="12"
          data-gap="12"
          data-bc="gray-200"
          data-bw="1"
          data-br="4"
          style={{ background: "var(--surface-card)" }}
        >
          <legend data-transform="center">Add journal entry</legend>

          <div data-display="flex" data-direction="column">
            <label className="c-label" htmlFor="situationDescription">
              Situation description
            </label>
            <input
              id="situationDescription"
              name="situationDescription"
              className="c-input"
              type="text"
              placeholder="I failed on my butt"
              {...UI.Services.Form.pattern(loaderData.situationDescription)}
            />
          </div>

          <div data-display="flex" data-direction="column">
            <label className="c-label" htmlFor="situationLocation">
              Situation location
            </label>
            <input
              id="situationLocation"
              name="situationLocation"
              className="c-input"
              type="text"
              placeholder="Kitchen"
              {...UI.Services.Form.pattern(loaderData.situationLocation)}
            />
          </div>

          <div data-display="flex" data-direction="column">
            <label className="c-label" htmlFor="situationKind">
              Situation kind
            </label>

            <Select id="situationKind" name="situationKind" required className="c-select">
              {loaderData.situationKinds.map((kind) => (
                <option key={kind} value={kind}>
                  {kind}
                </option>
              ))}
            </Select>
          </div>

          <button
            type="submit"
            className="c-button"
            data-variant="primary"
            data-ml="auto"
            {...UI.Services.Rhythm().times(6).style.width}
          >
            Add
          </button>
        </form>
      </div>
    </main>
  );
}
