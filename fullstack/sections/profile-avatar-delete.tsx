import { useHover } from "@bgord/ui";
import { useLoaderData, useRouter } from "@tanstack/react-router";
import { Xmark } from "iconoir-react";
import React from "react";
import { Avatar, AvatarSize } from "../components/avatar";
import { rootRoute } from "../router";
import { RequestState } from "../ui";

export function ProfileAvatarDelete() {
  const router = useRouter();
  const { avatarEtag } = useLoaderData({ from: rootRoute.id });
  const hover = useHover();
  const [state, setState] = React.useState<RequestState>(RequestState.idle);
  const enabled = avatarEtag !== null;

  async function deleteProfileAvatar(event: React.FormEvent) {
    event.preventDefault();

    if (state === RequestState.loading) return;

    const response = await fetch("/api/preferences/profile-avatar", {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) return setState(RequestState.error);
    setState(RequestState.done);
    router.invalidate({ filter: (r) => r.id === rootRoute.id, sync: true });
  }

  return (
    <div data-position="relative" {...hover.attach}>
      <Avatar size={AvatarSize.large} />

      {hover.hovering && enabled && (
        <div data-position="absolute" data-inset="0" data-bg="neutral-900" data-opacity="high" />
      )}
      {hover.hovering && enabled && (
        <button
          type="button"
          data-position="absolute"
          data-top="8"
          data-left="5"
          data-right="5"
          className="c-button"
          data-variant="with-icon"
          onClick={deleteProfileAvatar}
        >
          <Xmark data-size="md" />
        </button>
      )}
    </div>
  );
}
