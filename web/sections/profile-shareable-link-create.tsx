import {
  Dialog,
  Rhythm,
  useDateField,
  useShortcuts,
  useTextField,
  useToggle,
  useTranslations,
} from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { HelpCircle, Plus, ShareIos } from "iconoir-react";
import { useState } from "react";
import {
  Form,
  type ShareableLinkDuration,
  type ShareableLinkSpecification,
} from "../../app/services/create-shareable-link-form";
import { ButtonCancel, ButtonClose, Select } from "../components";
import { profileRoute } from "../router";
import { RequestState } from "../ui";

export function ProfileShareableLinkCreate() {
  const t = useTranslations();
  const router = useRouter();
  const [state, setState] = useState<RequestState>(RequestState.idle);

  const dialog = useToggle({ name: "dialog" });

  const specification = useTextField<ShareableLinkSpecification>(Form.specification.field);
  const duration = useTextField<ShareableLinkDuration>(Form.duration.field);
  const dateRangeStart = useDateField(Form.dateRangeStart.field);
  const dateRangeEnd = useDateField(Form.dateRangeEnd.field);

  async function createShareableLink(event: React.FormEvent) {
    event.preventDefault();

    if (state === RequestState.loading) return;

    setState(RequestState.loading);

    const response = await fetch("/api/publishing/link/create", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        publicationSpecification: specification.value,
        durationMs: Form.duration.map[duration.value ?? Form.duration.field.defaultValue],
        dateRangeStart: dateRangeStart.value,
        dateRangeEnd: dateRangeEnd.value,
      }),
    });

    if (!response.ok) return setState(RequestState.error);

    router.invalidate({ filter: (r) => r.id === profileRoute.id, sync: true });
    setState(RequestState.done);
    dialog.disable();
  }

  useShortcuts({ "$mod+Control+KeyN": dialog.enable });

  return (
    <>
      <button
        type="button"
        className="c-button"
        data-variant="with-icon"
        data-ml="auto"
        onClick={dialog.enable}
      >
        <Plus data-size="md" />
        {t("profile.shareable_links.create.cta_primary")}
      </button>

      <Dialog data-mt="12" data-gap="3" style={{ ...Rhythm().times(50).width }} {...dialog}>
        <div data-stack="x" data-main="between">
          <strong data-stack="x" data-cross="center" data-gap="2" data-color="neutral-300">
            <ShareIos data-size="md" data-color="neutral-300" />
            {t("profile.shareable_links.create.label")}
          </strong>
          <ButtonClose disabled={state === RequestState.loading} onClick={dialog.disable} />
        </div>

        <form onSubmit={createShareableLink} data-stack="y" data-gap="8" data-color="neutral-100">
          <div data-stack="y" data-gap="1">
            <label className="c-label">{t("profile.shareable_links.create.duration.label")}</label>

            <div data-stack="x">
              {Form.duration.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="c-button"
                  data-variant={duration.value === option ? "secondary" : "bare"}
                  onClick={() => duration.set(option as ShareableLinkDuration)}
                  disabled={state === RequestState.loading}
                  {...Rhythm().times(9).style.width}
                >
                  {t(`profile.shareable_links.create.duration.${option}.value`)}
                </button>
              ))}
            </div>
          </div>

          <div data-stack="y" data-cross="start" data-gap="1">
            <label className="c-label" {...specification.label.props}>
              {t("profile.shareable_links.create.specification.label")}
            </label>

            <div data-stack="x" data-gap="5">
              <Select required disabled={state === RequestState.loading} {...specification.input.props}>
                {Form.specification.options.map((specification) => (
                  <option key={specification} value={specification}>
                    {t(`profile.shareable_links.create.specification.${specification}.value`)}
                  </option>
                ))}
              </Select>

              <div data-stack="x" data-cross="center" data-gap="1" data-fs="xs" data-color="neutral-300">
                <HelpCircle data-size="sm" />
                {t("profile.shareable_links.create.specification.legend")}
              </div>
            </div>
          </div>

          <div data-stack="y" data-cross="start" data-gap="1">
            <label className="c-label">{t("profile.shareable_links.create.date_range.label")}</label>

            <div data-stack="x" data-cross="center" data-gap="3">
              <input
                className="c-input"
                type="date"
                required
                max={dateRangeEnd.value}
                disabled={state === RequestState.loading}
                {...dateRangeStart.input.props}
              />
              -
              <input
                className="c-input"
                required
                type="date"
                disabled={state === RequestState.loading}
                {...dateRangeEnd.input.props}
              />
            </div>
          </div>

          <div data-stack="x" data-main="between" data-cross="center" data-gap="5">
            {state === RequestState.error && (
              <output
                aria-live="assertive"
                data-fs="sm"
                data-color="danger-400"
                data-animation="grow-fade-in"
              >
                {t("profile.delete_account.error")}
              </output>
            )}

            <div data-stack="x" data-gap="5" data-ml="auto">
              <ButtonCancel onClick={dialog.disable} disabled={state === RequestState.loading} />

              <button
                type="submit"
                className="c-button"
                data-variant="primary"
                disabled={state === RequestState.loading}
              >
                {t("profile.shareable_links.create.cta_secondary")}
              </button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
}
