import { Rhythm } from "@bgord/ui";
import { rootRoute } from "../router";

export enum AvatarSize {
  small = "small",
  large = "large",
}

const dimension: Record<AvatarSize, number> = { [AvatarSize.small]: 4, [AvatarSize.large]: 8 };

export function Avatar(props: { size: AvatarSize }) {
  const { session, avatarEtag } = rootRoute.useLoaderData();

  const placeholder = "/public/avatar-placeholder.webp";
  const src = avatarEtag ? `/api/profile-avatar/get?etag=${avatarEtag}` : placeholder;

  return (
    <img
      src={src}
      alt=""
      title={session.user.email}
      data-bc="neutral-700"
      data-bwb="hairline"
      data-br="pill"
      data-object-fit="cover"
      fetchPriority="high"
      {...Rhythm().times(dimension[props.size]).style.square}
    />
  );
}
