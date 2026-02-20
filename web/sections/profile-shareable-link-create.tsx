import {
  Dialog,
  Fields,
  Rhythm,
  useDateField,
  useMutation,
  useShortcuts,
  useTextField,
  useToggle,
  useTranslations,
} from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { HelpCircle, Plus, ShareIos } from "iconoir-react";
import {
  Form,
  type ShareableLinkDuration,
  type ShareableLinkSpecification,
} from "../../app/services/create-shareable-link-form";
import { ButtonCancel, ButtonClose, Select } from "../components";
import { profileRoute } from "../router";

export function ProfileShareableLinkCreate() {
  const t = useTranslations();
  const router = useRouter();

  const dialog = useToggle({ name: "dialog" });

  const specification = useTextField<ShareableLinkSpecification>(Form.specification.field);
  const duration = useTextField<ShareableLinkDuration>(Form.duration.field);
  const dateRangeStart = useDateField(Form.dateRangeStart.field);
  const dateRangeEnd = useDateField(Form.dateRangeEnd.field);

  const mutation = useMutation({
    perform: () =>
      fetch("/api/publishing/link/create", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          publicationSpecification: specification.value,
          durationMs: Form.duration.map[duration.value ?? Form.duration.field.defaultValue],
          dateRangeStart: dateRangeStart.value,
          dateRangeEnd: dateRangeEnd.value,
        }),
      }),
    onSuccess: (_, context) => {
      router.invalidate({ filter: (r) => r.id === profileRoute.id, sync: true });
      Fields.clearAll([specification, duration, dateRangeStart, dateRangeEnd]);
      context.form?.reset();

      dialog.disable();
    },
  });

  useShortcuts({ "$mod+Control+KeyN": dialog.enable });

  return (
    <>
      <button
        className="c-button"
        data-ml="auto"
        data-variant="with-icon"
        onClick={dialog.enable}
        type="button"
        {...dialog.props.controller}
      >
        <Plus data-size="md" />
        {t("profile.shareable_links.create.cta_primary")}
      </button>

      <Dialog data-gap="3" data-mt="12" style={{ ...Rhythm().times(50).width }} {...dialog}>
        <div data-main="between" data-stack="x">
          <strong data-color="neutral-300" data-cross="center" data-gap="2" data-stack="x">
            <ShareIos data-color="neutral-300" data-size="md" />
            {t("profile.shareable_links.create.label")}
          </strong>
          <ButtonClose disabled={mutation.isLoading} onClick={dialog.disable} />
        </div>

        <form data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          <div data-gap="1" data-stack="y">
            <label className="c-label">{t("profile.shareable_links.create.duration.label")}</label>

            <div data-stack="x">
              {Form.duration.options.map((option) => (
                <button
                  className="c-button"
                  data-variant={duration.value === option ? "secondary" : "bare"}
                  disabled={mutation.isLoading}
                  key={option}
                  onClick={() => duration.set(option as ShareableLinkDuration)}
                  type="button"
                  {...Rhythm().times(9).style.width}
                >
                  {t(`profile.shareable_links.create.duration.${option}.value`)}
                </button>
              ))}
            </div>
          </div>

          <div data-cross="start" data-gap="1" data-stack="y">
            <label className="c-label" {...specification.label.props}>
              {t("profile.shareable_links.create.specification.label")}
            </label>

            <div data-gap="5" data-stack="x">
              <Select disabled={mutation.isLoading} required {...specification.input.props}>
                {Form.specification.options.map((specification) => (
                  <option key={specification} value={specification}>
                    {t(`profile.shareable_links.create.specification.${specification}.value`)}
                  </option>
                ))}
              </Select>

              <div data-color="neutral-300" data-cross="center" data-fs="xs" data-gap="1" data-stack="x">
                <HelpCircle data-size="sm" />
                {t("profile.shareable_links.create.specification.legend")}
              </div>
            </div>
          </div>

          <div data-cross="start" data-gap="1" data-stack="y">
            <label className="c-label">{t("profile.shareable_links.create.date_range.label")}</label>

            <div data-color="neutral-300" data-cross="center" data-gap="3" data-stack="x">
              <input
                className="c-input"
                disabled={mutation.isLoading}
                max={dateRangeEnd.value}
                required
                type="date"
                {...dateRangeStart.input.props}
              />
              -
              <input
                className="c-input"
                disabled={mutation.isLoading}
                required
                type="date"
                {...dateRangeEnd.input.props}
              />
            </div>
          </div>

          <div data-cross="center" data-gap="5" data-main="between" data-stack="x">
            {mutation.isError && (
              <output
                aria-live="assertive"
                data-animation="grow-fade-in"
                data-color="danger-400"
                data-fs="sm"
              >
                {t("profile.delete_account.error")}
              </output>
            )}

            <div data-gap="5" data-ml="auto" data-stack="x">
              <ButtonCancel disabled={mutation.isLoading} onClick={dialog.disable} />

              <button className="c-button" data-variant="primary" disabled={mutation.isLoading} type="submit">
                {t("profile.shareable_links.create.cta_secondary")}
              </button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
}
