import { Rhythm } from "@bgord/ui";
import { rootRoute } from "../router";

export enum AvatarSize {
  sm = "sm",
  md = "md",
  lg = "lg",
}

const dimension: Record<AvatarSize, number> = {
  [AvatarSize.sm]: 2.5,
  [AvatarSize.md]: 4,
  [AvatarSize.lg]: 8,
};

export function Avatar(props: { size: AvatarSize }) {
  const { session, avatarEtag } = rootRoute.useLoaderData();

  const placeholder = "/public/avatar-placeholder.webp";
  const src = avatarEtag ? `/api/profile-avatar/get?etag=${avatarEtag}` : placeholder;

  return (
    <img
      alt=""
      data-bc="neutral-700"
      data-br="pill"
      data-bs="solid"
      data-bw="thin"
      data-object-fit="cover"
      fetchPriority="high"
      src={src}
      title={session.user.email}
      {...Rhythm().times(dimension[props.size]).style.square}
    />
  );
}
