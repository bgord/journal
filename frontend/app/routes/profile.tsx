import * as Icons from "iconoir-react";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export default function Profile() {
  return (
    <main
      data-disp="flex"
      data-dir="column"
      data-gap="5"
      data-mt="8"
      data-mx="auto"
      data-p="8"
      data-width="100%"
      data-maxw="md"
      data-br="sm"
      data-color="neutral-100"
      data-bg="neutral-900"
      ata-bg="neutral-900"
    >
      <h2>Profile</h2>

      <div data-disp="flex" data-main="between" data-mt="8">
        <div>Export all data</div>

        <a
          href={`${import.meta.env.VITE_API_URL}/entry/export`}
          download
          target="_blank"
          rel="noopener noreferer"
          data-color="brand-500"
        >
          <Icons.DownloadCircle data-size="lg" />
        </a>
      </div>
    </main>
  );
}
