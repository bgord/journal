export const API: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> = (input, init) =>
  fetch(`${import.meta.env.VITE_API_URL}${input}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      "time-zone-offset": new Date().getTimezoneOffset().toString(),
      ...init?.headers,
    },
  });
