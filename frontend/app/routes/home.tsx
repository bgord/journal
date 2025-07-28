import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import type { types } from "../../../app/services/add-entry-form";
import { API } from "../../api";
import NotebookSvg from "../../assets/notebook.svg";
import * as Auth from "../../auth";
import * as Components from "../../components";
import { ReadModel } from "../../read-model";
import type { Route } from "./+types/home";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = UI.Cookies.extractFrom(request);
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "entry_delete") {
    await API(`/entry/${form.get("id")}/delete`, {
      method: "DELETE",
      headers: { cookie, ...UI.WeakETag.fromRevision(Number(form.get("revision"))) },
    });

    return { ok: true };
  }

  if (intent === "evaluate_reaction") {
    await API(`/entry/${form.get("id")}/evaluate-reaction`, {
      method: "POST",
      headers: { cookie, ...UI.WeakETag.fromRevision(Number(form.get("revision"))) },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });

    return { ok: true };
  }

  if (intent === "reappraise_emotion") {
    await API(`/entry/${form.get("id")}/reappraise-emotion`, {
      method: "POST",
      headers: { cookie, ...UI.WeakETag.fromRevision(Number(form.get("revision"))) },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });

    return { ok: true };
  }

  throw new Error("Intent unknown");
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await Auth.guard.getServerSession(request);
  const userId = session?.user.id as string;

  const entries = await ReadModel.listEntriesForUser(userId);

  return { entries, form: ReadModel.AddEntryForm };
}

export type EntryType = Route.ComponentProps["loaderData"]["entries"][number];

export default function Home({ loaderData }: Route.ComponentProps) {
  const t = UI.useTranslations();
  const dialog = UI.useToggle({ name: "dialog" });

  const [emotionType, setEmotionType] = React.useState<"positive" | "negative">("positive");
  const emotionLabel = UI.useField<types.EmotionLabelType>({ name: "emotion-label" });
  const emotionIntensity = UI.useField<types.EmotionIntensityType>({
    name: "emotion-intensity",
    defaultValue: loaderData.form.emotionIntensity.min,
  });
  const reactionEffectiveness = UI.useField<types.ReactionEffectivenessType>({
    name: "reaction-effectiveness",
    defaultValue: loaderData.form.reactionEffectiveness.min,
  });

  UI.useKeyboardShortcuts({ "$mod+Control+KeyN": dialog.enable });

  return (
    <main data-p="6">
      <div data-disp="flex" data-main="end" data-maxw="md" data-mx="auto">
        <button
          type="button"
          className="c-button"
          data-variant="with-icon"
          data-mb="5"
          onClick={dialog.enable}
        >
          <Icons.Plus data-size="md" />
          New entry
        </button>

        <UI.Dialog data-gap="5" data-mt="12" {...UI.Rhythm().times(50).style.square} {...dialog}>
          <div data-disp="flex" data-main="between" data-cross="center">
            <strong data-disp="flex" data-cross="center" data-gap="2" data-fs="base" data-color="neutral-300">
              <Icons.Book data-size="md" data-color="neutral-300" />
              Add new entry
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

          <textarea
            className="c-textarea"
            placeholder={t("entry.situation.description.label")}
            rows={3}
            autoFocus
            {...UI.Form.textareaPattern(loaderData.form.situationDescription)}
          />

          <div data-disp="flex" data-gap="8" data-cross="end">
            <Components.Select>
              <option value="">{t("entry.situation.kind.value.default")}</option>
              {loaderData.form.situationKinds.map((kind) => (
                <option key={kind} value={kind}>
                  {t(`entry.situation.kind.value.${kind}`)}
                </option>
              ))}
            </Components.Select>

            <div data-disp="flex" data-cross="center" data-gap="2">
              <Icons.MapPin data-size="md" data-color="neutral-400" />

              <input
                className="c-input"
                placeholder={t("entry.situation.location.placeholder")}
                {...UI.Form.inputPattern(loaderData.form.situationLocation)}
              />
            </div>
          </div>

          <div style={{ width: "100%", height: "2px" }} data-bg="neutral-800" />

          <div data-disp="flex" data-main="between">
            <div data-disp="flex" data-cross="end">
              <button
                type="button"
                className="c-button"
                data-color="positive-400"
                data-variant={emotionType === "positive" ? undefined : "bare"}
                onClick={() => setEmotionType("positive")}
                {...UI.Rhythm().times(9).style.width}
              >
                {t("entry.emotion.label.type.positive")}
              </button>

              <button
                type="button"
                className="c-button"
                data-color="danger-400"
                data-variant={emotionType === "negative" ? undefined : "bare"}
                onClick={() => setEmotionType("negative")}
                {...UI.Rhythm().times(9).style.width}
              >
                {t("entry.emotion.label.type.negative")}
              </button>

              {emotionType && (
                <Components.Select data-ml="3" data-animation="grow-fade-in" {...emotionLabel.input.props}>
                  <option value="">{t("entry.emotion.label.default.value")}</option>
                  {loaderData.form.emotionLabels
                    .filter((label) => (emotionType === "positive" ? label.positive : !label.positive))
                    .map((emotion) => (
                      <option key={emotion.option} value={emotion.option}>
                        {t(`entry.emotion.label.value.${emotion.option}`)}
                      </option>
                    ))}
                </Components.Select>
              )}
            </div>

            <Components.ClickableRatingPills {...emotionIntensity} />
          </div>

          <div style={{ width: "100%", height: "2px" }} data-bg="neutral-800" />

          <textarea
            className="c-textarea"
            placeholder={t("entry.reaction.description.label")}
            rows={3}
            {...UI.Form.textareaPattern(loaderData.form.reactionDescription)}
          />

          <div data-disp="flex" data-cross="center">
            <Components.Select>
              <option value="">{t("entry.reaction.type.default.value")}</option>
              {loaderData.form.reactionTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`entry.reaction.type.value.${type}`)}
                </option>
              ))}
            </Components.Select>

            <label
              data-fs="xs"
              data-color="neutral-300"
              data-ls="wide"
              data-transform="uppercase"
              data-ml="12"
              data-mr="3"
              {...reactionEffectiveness.label.props}
            >
              {t("entry.reaction.effectiveness.label")}
            </label>
            <Components.ClickableRatingPills {...reactionEffectiveness} />
          </div>

          <div data-disp="flex" data-main="end" data-gap="5" data-mt="auto" data-mb="1">
            <button type="button" className="c-button" data-variant="bare" onClick={dialog.disable}>
              Cancel
            </button>
            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              {...UI.Rhythm().times(12).style.width}
            >
              Save
            </button>
          </div>
        </UI.Dialog>
      </div>

      <ul
        className="entries-list"
        data-disp="flex"
        data-dir="column"
        data-gap="5"
        data-maxw="md"
        data-mx="auto"
      >
        {loaderData.entries.map((entry) => (
          <Components.Entry key={entry.id} {...entry} />
        ))}
      </ul>

      {loaderData.entries.length === 0 && (
        <div data-disp="flex" data-dir="column" data-cross="center">
          <img
            src={NotebookSvg}
            data-animation="grow-fade-in"
            height="300px"
            alt={t("entry.list.empty.alt")}
          />
          <div data-color="brand-300">{t("entry.list.empty")}</div>
        </div>
      )}
    </main>
  );
}
