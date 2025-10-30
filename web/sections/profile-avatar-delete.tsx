import { useHover } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import React from "react";
import { Avatar, AvatarSize, ButtonClose } from "../components";
import { rootRoute } from "../router";
import { RequestState } from "../ui";

export function ProfileAvatarDelete() {
  const router = useRouter();
  const { avatarEtag } = rootRoute.useLoaderData();
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
        <ButtonClose
          onClick={deleteProfileAvatar}
          data-position="absolute"
          data-top="8"
          data-left="5"
          data-right="5"
        />
      )}
    </div>
  );
}
