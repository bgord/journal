import { useState } from "preact/hooks";

export function Home() {
  const [result] = useState(123);

  return (
    <div data-color="neutral-200">
      Home
      <a href="/weekly">weekly</a>
      <div data-stack="y" data-mt="5">
        Value: {result}
      </div>
    </div>
  );
}
