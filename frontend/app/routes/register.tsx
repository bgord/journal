import type { Route } from "./+types/register";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export default function Register(_props: Route.ComponentProps) {
  return <main data-pb="36">Register here</main>;
}
