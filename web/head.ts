export const CSS = (href: string) => [
  { rel: "preload", as: "style", href },
  { rel: "stylesheet", href },
];

export const JS = (src: string) => ({ type: "module", src });

export const META = [
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
];

export const FONT = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
] as const;
