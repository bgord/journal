"use client";
import * as UI from "@bgord/ui";
import * as RR from "react-router";

export function GlobalShortcuts() {
  const navigate = RR.useNavigate();

  UI.useKeyboardShortcuts({ "$mod+Control+KeyJ": () => navigate("/") });
  UI.useKeyboardShortcuts({ "$mod+Control+KeyS": () => navigate("/dashboard") });

  return null;
}
