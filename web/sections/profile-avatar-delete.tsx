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
    <button data-cursor="pointer" data-position="relative" onClick={overlay.toggle} type="button">
      <Avatar size={AvatarSize.lg} />

      {overlay.on && enabled && (
        <div data-bg="neutral-900" data-inset="0" data-opacity="high" data-position="absolute" />
      )}
      {overlay.on && enabled && (
        <ButtonClose
          data-left="5"
          data-position="absolute"
          data-right="5"
          data-top="8"
          onClick={() => mutation.mutate()}
        />
      )}
    </button>
  );
}
