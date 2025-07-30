import * as Components from "../../components";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export default function Profile() {
  return (
    <main
      data-disp="flex"
      data-dir="column"
      data-gap="5"
      data-mx="auto"
      data-p="5"
      data-width="100%"
      data-maxw="md"
      data-br="sm"
      data-color="neutral-100"
      data-bg="neutral-900"
      ata-bg="neutral-900"
    >
      <h2>Profile</h2>

      <Components.Separator />

      <div data-disp="flex">Export all data</div>
    </main>
  );
}
