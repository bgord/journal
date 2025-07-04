export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export default function AddJournalEntry() {
  return (
    <main data-pb="36">
      <div data-display="flex" data-direction="column" data-max-width="768" data-mx="auto" data-mb="12">
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
              required
              className="c-input"
              type="text"
            />
          </div>

          <div data-display="flex" data-direction="column">
            <label className="c-label" htmlFor="situationLocation">
              Situation location
            </label>
            <input id="situationLocation" name="situationLocation" required className="c-input" type="text" />
          </div>

          <div data-display="flex" data-direction="column">
            <label className="c-label" htmlFor="situationKind">
              Situation kind
            </label>

            <input id="situationKind" name="situationKind" required className="c-input" type="text" />
          </div>

          <button
            type="submit"
            className="c-button"
            data-variant="primary"
            data-ml="auto"
            style={{ width: "72px" }}
          >
            Add
          </button>
        </form>
      </div>
    </main>
  );
}
