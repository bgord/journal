import * as UI from "@bgord/ui";
import React from "react";
import * as Icons from "iconoir-react";
import * as RR from "react-router";
import { CancelButton } from "./cancel-button";
import { Select } from "./select";

export function CreateShareableLink() {
  const t = UI.useTranslations();
  const fetcher = RR.useFetcher();

  const dialog = UI.useToggle({ name: "dialog" });

  const [durationType, setDurationType] = React.useState<"one_day" | "one_week" | "one_month">("one_day");

  const dateRangeStart = UI.useField<number>({ name: "dateRangeStart" });
  const dateRangeEnd = UI.useField<number>({ name: "dateRangeEnd" });

  const dateRangeError = dateRangeStart.value > dateRangeEnd.value;

  UI.useKeyboardShortcuts({ "$mod+Control+KeyN": dialog.enable });

  return (
    <>
      <button
        type="button"
        className="c-button"
        data-variant="with-icon"
        data-ml="auto"
        onClick={dialog.enable}
      >
        <Icons.Plus data-size="md" />
        {t("profile.shareable_links.create.cta_primary")}
      </button>

      <UI.Dialog
        data-mt="12"
        style={{ ...UI.Rhythm().times(50).width, ...UI.Rhythm().times(39).height }}
        {...dialog}
      >
        <fetcher.Form
          data-disp="flex"
          data-dir="column"
          data-gap="8"
          data-color="neutral-100"
          data-height="100%"
          method="POST"
          onSubmit={(event) => {
            event.preventDefault();
            dialog.disable();
          }}
        >
          <div data-disp="flex" data-main="between" data-cross="center">
            <strong data-disp="flex" data-cross="center" data-gap="2" data-fs="base" data-color="neutral-300">
              <Icons.ShareIos data-size="md" data-color="neutral-300" />
              {t("profile.shareable_links.create.label")}
            </strong>

            <button
              className="c-button"
              data-variant="with-icon"
              type="submit"
              data-interaction="subtle-scale"
              onClick={dialog.disable}
            >
              <Icons.Xmark data-size="md" />
            </button>
          </div>

          <div data-disp="flex" data-dir="column" data-gap="1">
            <label className="c-label">Duration</label>

            <div data-disp="flex">
              <button
                type="button"
                className="c-button"
                data-variant={durationType === "one_day" ? "secondary" : "bare"}
                onClick={() => setDurationType("one_day")}
                {...UI.Rhythm().times(9).style.width}
              >
                24 hours
              </button>

              <button
                type="button"
                className="c-button"
                data-variant={durationType === "one_week" ? "secondary" : "bare"}
                onClick={() => setDurationType("one_week")}
                {...UI.Rhythm().times(9).style.width}
              >
                7 days
              </button>

              <button
                type="button"
                className="c-button"
                data-variant={durationType === "one_month" ? "secondary" : "bare"}
                onClick={() => setDurationType("one_month")}
                {...UI.Rhythm().times(9).style.width}
              >
                30 days
              </button>
            </div>
          </div>

          <div data-disp="flex" data-dir="column" data-cross="start" data-gap="1">
            <label className="c-label">Resource type</label>

            <div data-disp="flex" data-gap="5">
              <Select required>
                <option value="">Choose a resource</option>
                <option value="entries">Entries</option>
              </Select>

              <div data-disp="flex" data-cross="center" data-gap="1" data-fs="xs" data-color="neutral-300">
                <Icons.HelpCircle data-size="sm" />
                Only the selected resource type will be accessible
              </div>
            </div>
          </div>

          <div data-disp="flex" data-dir="column" data-cross="start" data-gap="1">
            <label className="c-label">Date range</label>

            <div data-disp="flex" data-cross="center" data-gap="3">
              <input
                className="c-input"
                required
                type="date"
                {...dateRangeStart.input.props}
                value={
                  dateRangeStart.value
                    ? new Date(dateRangeStart.value).toISOString().split("T")[0]
                    : undefined
                }
                onChange={(event) => dateRangeStart.set(event.currentTarget.valueAsNumber)}
              />
              -
              <input
                className="c-input"
                required
                type="date"
                {...dateRangeEnd.input.props}
                value={
                  dateRangeEnd.value ? new Date(dateRangeEnd.value).toISOString().split("T")[0] : undefined
                }
                onChange={(event) => dateRangeEnd.set(event.currentTarget.valueAsNumber)}
              />
            </div>

            {dateRangeError && (
              <div data-mt="1" data-ml="1" data-fs="sm" data-color="danger-400">
                Invalid date range
              </div>
            )}
          </div>

          <div data-disp="flex" data-main="end" data-gap="5" data-mt="auto">
            <CancelButton onClick={dialog.disable} />

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              disabled={dateRangeError}
              {...UI.Rhythm().times(10).style.width}
            >
              {t("profile.shareable_links.create.cta_secondary")}
            </button>
          </div>
        </fetcher.Form>
      </UI.Dialog>
    </>
  );
}
