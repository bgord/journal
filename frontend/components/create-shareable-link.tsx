import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import * as RR from "react-router";
import type { DurationType, SpecificationType } from "../../app/services/create-shareable-link-form";
import type { loader } from "../app/routes/profile";
import { CancelButton } from "./cancel-button";
import { Select } from "./select";

type LoaderData = Awaited<ReturnType<typeof loader>>;

export function CreateShareableLink() {
  const t = UI.useTranslations();
  const fetcher = RR.useFetcher();
  const loader = RR.useLoaderData<LoaderData>();

  const dialog = UI.useToggle({ name: "dialog" });

  const specification = UI.useField<SpecificationType>({ name: "specification" });

  const [durationType, setDurationType] = React.useState<DurationType>("one_day");

  const dateRangeStart = UI.useField<number>({ name: "dateRangeStart" });
  const dateRangeEnd = UI.useField<number>({ name: "dateRangeEnd" });

  const dateRangeError = dateRangeStart.value > dateRangeEnd.value;

  UI.useKeyboardShortcuts({ "$mod+Control+KeyN": dialog.enable });

  const payload = {
    publicationSpecification: specification.value,
    durationMs: loader.form.durations[durationType],
    dateRangeStart: dateRangeStart.value,
    dateRangeEnd: dateRangeEnd.value,
    intent: "shareable_link_create",
  };

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
            fetcher.submit(payload, { action: "/profile", method: "post" });
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
            <label className="c-label">{t("profile.shareable_links.create.duration.label")}</label>

            <div data-disp="flex">
              {Object.keys(loader.form.durations).map((duration) => (
                <button
                  key={duration}
                  type="button"
                  className="c-button"
                  data-variant={durationType === duration ? "secondary" : "bare"}
                  onClick={() => setDurationType(duration as DurationType)}
                  {...UI.Rhythm().times(9).style.width}
                >
                  {t(`profile.shareable_links.create.duration.${duration}.value`)}
                </button>
              ))}
            </div>
          </div>

          <div data-disp="flex" data-dir="column" data-cross="start" data-gap="1">
            <label className="c-label" {...specification.label.props}>
              {t("profile.shareable_links.create.specification.label")}
            </label>

            <div data-disp="flex" data-gap="5">
              <Select required {...specification.input.props}>
                <option value="">{t("profile.shareable_links.create.specification.default")}</option>
                {loader.form.specifications.map((specification) => (
                  <option key={specification} value={specification}>
                    {t(`profile.shareable_links.create.specification.${specification}.value`)}
                  </option>
                ))}
              </Select>

              <div data-disp="flex" data-cross="center" data-gap="1" data-fs="xs" data-color="neutral-300">
                <Icons.HelpCircle data-size="sm" />
                {t("profile.shareable_links.create.specification.legend")}
              </div>
            </div>
          </div>

          <div data-disp="flex" data-dir="column" data-cross="start" data-gap="1">
            <label className="c-label">{t("profile.shareable_links.create.date_range.label")}</label>

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
                {t("profile.shareable_links.create.date_range.error")}
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
