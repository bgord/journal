import { useState } from "preact/hooks";
import { useTranslations } from "./translations";

export function Home() {
  const t = useTranslations();
  const [result] = useState(123);

  return (
    <div data-stack="x" data-gap="5" data-color="neutral-200">
      {t("app.name")}
      <a href="/weekly">weekly</a>
      <div data-stack="y">Value: {result}</div>
    </div>
  );
}
