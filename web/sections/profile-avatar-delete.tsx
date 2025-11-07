import { useHover, useMutation } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Avatar, AvatarSize, ButtonClose } from "../components";
import { rootRoute } from "../router";

export function ProfileAvatarDelete() {
  const router = useRouter();
  const { avatarEtag } = rootRoute.useLoaderData();
  const hover = useHover();
  const enabled = avatarEtag !== null;

  const mutation = useMutation({
    perform: () => fetch("/api/preferences/profile-avatar", { method: "DELETE", credentials: "include" }),
    onSuccess: () => router.invalidate({ filter: (r) => r.id === rootRoute.id, sync: true }),
  });

  return (
    <div data-position="relative" {...hover.attach}>
      <Avatar size={AvatarSize.large} />

      {hover.hovering && enabled && (
        <div data-position="absolute" data-inset="0" data-bg="neutral-900" data-opacity="high" />
      )}
      {hover.hovering && enabled && (
        <ButtonClose
          onClick={() => mutation.mutate()}
          data-position="absolute"
          data-top="8"
          data-left="5"
          data-right="5"
        />
      )}
    </div>
  );
}
