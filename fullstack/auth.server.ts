export async function getSession(request: Request) {
  const res = await fetch(new URL("/api/auth/get-session", request.url), {
    headers: { cookie: request.headers.get("cookie") ?? "" },
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  return { res, json };
}

export async function signInEmail(request: Request, form: FormData) {
  return fetch(new URL("/api/auth/sign-in/email", request.url), {
    method: "POST",
    headers: { cookie: request.headers.get("cookie") ?? "" },
    body: form,
    credentials: "include",
  });
}

export async function signOut(request: Request) {
  return fetch(new URL("/api/auth/sign-out", request.url), {
    method: "POST",
    headers: { cookie: request.headers.get("cookie") ?? "" },
    credentials: "include",
  });
}
