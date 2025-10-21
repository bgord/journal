export function Navigation() {
  return (
    <nav data-stack="y">
      <header data-stack="x" data-cross="center" data-gap="6" data-p="3">
        <div className="logo" data-fs="4xl" data-fw="bold" data-ls="wider" data-color="brand-600">
          <a href="/">Journal</a>
        </div>

        <a href="/dashboard" className="c-link" data-transform="uppercase" data-ml="auto">
          Dashboard
        </a>

        <a
          href="/profile"
          className="c-link"
          data-disp="flex"
          data-cross="center"
          data-gap="2"
          data-fs="base"
          data-fw="medium"
        >
          <img
            src="/profile-avatar/get"
            alt="Image"
            width={48}
            height={48}
            style={{ borderRadius: 9999, objectFit: "cover" }}
            data-bc="neutral-700"
            data-bwb="hairline"
          />
        </a>

        <form action="/api/auth/sign-out" method="post">
          <button class="c-link" type="submit">
            Logout
          </button>
        </form>
      </header>
    </nav>
  );
}
