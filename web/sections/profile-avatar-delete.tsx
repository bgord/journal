import { useMutation, useToggle } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Avatar, AvatarSize, ButtonClose } from "../components";
import { rootRoute } from "../router";

export function ProfileAvatarDelete() {
  const router = useRouter();
  const { avatarEtag } = rootRoute.useLoaderData();
  const overlay = useToggle({ name: "profile-avatar-delete" });

  const enabled = avatarEtag !== null;

  const mutation = useMutation({
    perform: () => fetch("/api/preferences/profile-avatar", { method: "DELETE", credentials: "include" }),
    onSuccess: () => router.invalidate({ filter: () => true, sync: true }),
  });

  return (
    <button type="button" onClick={overlay.toggle} data-position="relative" data-cursor="pointer">
      <Avatar size={AvatarSize.large} />

      {overlay.on && enabled && (
        <div data-position="absolute" data-inset="0" data-bg="neutral-900" data-opacity="high" />
      )}
      {overlay.on && enabled && (
        <ButtonClose
          onClick={() => mutation.mutate()}
          data-position="absolute"
          data-top="8"
          data-left="5"
          data-right="5"
        />
      )}
    </button>
  );
}
