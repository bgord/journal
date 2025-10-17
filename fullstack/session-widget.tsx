import { signOut, useSession } from "./auth";

export function SessionWidget() {
  const { data } = useSession();
  if (!data) return null;

  return (
    <button className="c-button" onClick={() => signOut()}>
      Sign out {data.user.email}
    </button>
  );
}
