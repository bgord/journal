import { Rhythm } from "@bgord/ui";
import { useLoaderData } from "@tanstack/react-router";
import { rootRoute } from "../router";

export enum AvatarSize {
  small = "small",
  large = "large",
}

const dimension: Record<AvatarSize, number> = { [AvatarSize.small]: 4, [AvatarSize.large]: 8 };

export function Avatar(props: { size: AvatarSize }) {
  const { session, avatarEtag } = useLoaderData({ from: rootRoute.id });

  const url = avatarEtag ? `/api/profile-avatar/get?etag=${avatarEtag}` : undefined;

  return (
    <img
      src={url}
      alt=""
      title={session.user.email}
      data-bc="neutral-700"
      data-bwb="hairline"
      data-br="pill"
      data-object-fit="cover"
      {...Rhythm().times(dimension[props.size]).style.square}
    />
  );
}
