import type { ActionFunctionArgs } from "react-router";
import * as Auth from "../../auth";

export async function action({ request }: ActionFunctionArgs) {
  await Auth.guard.removeSession(request);
}

export default function Logout() {
  return null;
}
