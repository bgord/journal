import type { Route } from "./+types/login";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export default function Login(_props: Route.ComponentProps) {
  return <main data-pb="36">Login here</main>;
}
