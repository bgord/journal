import { Rhythm } from "@bgord/ui";
import { useLoaderData } from "@tanstack/react-router";
import { rootRoute } from "../router";

export enum AvatarSize {
  small = "small",
  large = "large",
}

const dimension: Record<AvatarSize, number> = { [AvatarSize.small]: 4, [AvatarSize.large]: 8 };

export function Avatar(props: { size: AvatarSize }) {
  const { session } = useLoaderData({ from: rootRoute.id });

  return (
    <img
      src="/api/profile-avatar/get"
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
