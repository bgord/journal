import { Rhythm, useDismiss, useNotifications } from "@bgord/ui";
import { ButtonClose } from "./button-close";

export function Notifications() {
  const notifications = useNotifications();
  const dismiss = useDismiss();

  return (
    <ul
      data-bottom="0"
      data-fs="sm"
      data-gap="3"
      data-left="0"
      data-p="3"
      data-position="fixed"
      data-stack="y"
      data-width="100%"
      {...Rhythm(280).times(1).style.maxWidth}
    >
      {notifications.map((notification) => (
        <li
          data-bg="neutral-700"
          data-cross="center"
          data-gap="3"
          data-main="between"
          data-px="3"
          data-py="1"
          data-stack="x"
          key={notification.id}
        >
          <div>{notification.message}</div>
          <ButtonClose onClick={() => dismiss(notification.id)} />
        </li>
      ))}
    </ul>
  );
}
