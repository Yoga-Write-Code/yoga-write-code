import Link from "next/link";

export default function NotFound() {
  const appOrigin = process.env.NEXT_PUBLIC_SITE_URL || "";

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md text-center">
        <svg
          width="40"
          height="40"
          viewBox="0 0 108 108"
          fill="none"
          aria-hidden="true"
          className="mx-auto"
        >
          <rect width="108" height="108" rx="21.6" fill="#58AE39" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M46.1349 26.4156C48.2025 25.3265 50.7459 26.4734 51.2953 28.7445L52.7635 34.8401L84.5301 33.988C85.7602 33.9573 86.8484 34.7803 87.1539 35.9722L87.6467 37.895C87.9242 38.9779 87.5643 40.1245 86.7177 40.8546L75.7605 50.3039L90.1625 67.7559C90.7236 68.4374 90.9141 69.3535 90.6737 70.2029L90.6471 70.2954C90.2452 71.6924 88.8837 72.5867 87.442 72.4007L60.6549 68.9444L59.2785 76.9364L52.8684 69.1149L26.3769 80.2038C25.0365 80.7649 23.4872 80.2638 22.7293 79.024L22.6791 78.942C22.2195 78.187 22.1609 77.2542 22.5222 76.4475L31.7722 55.7964L18.6541 49.2529C17.6766 48.7652 17.0495 47.7763 17.0254 46.6841L16.9883 45.004C16.9612 43.775 17.7895 42.6914 18.9825 42.395L45.5057 35.8451L44.304 30.3569C43.9587 28.7814 44.7083 27.1679 46.1349 26.4156ZM25.2496 46.0917L33.9569 50.8283L35.494 47.2984C36.0859 45.9391 37.6673 45.3166 39.0269 45.9078C40.3872 46.4992 41.0103 48.0815 40.4187 49.4417L38.6979 53.3976L47.379 57.2899C48.7312 57.8962 49.3363 59.4837 48.7306 60.8363C48.1247 62.1892 46.5369 62.7949 45.1839 62.1892L36.5262 58.3133L30.1511 72.5406L51.6405 63.8233L46.6549 41.0973L25.2496 46.0917ZM54.0525 40.1753L59.663 63.4257L81.7686 66.0168L71.8453 53.9918L64.5267 60.0266C63.3825 60.97 61.6903 60.8074 60.7467 59.6635C59.8033 58.5223 59.9643 56.8323 61.1063 55.8898L68.4458 49.832L65.7336 46.47C64.8034 45.317 64.9827 43.6284 66.1343 42.6965C67.2906 41.7647 68.9832 41.9458 69.9162 43.1011L72.3347 46.096L79.0483 39.5242L54.0525 40.1753Z"
            fill="white"
          />
        </svg>

        <p className="font-sans mt-6 text-5xl font-semibold tracking-tight text-ink">404</p>
        <h1 className="mt-2 text-lg font-medium text-ink-secondary">Page not found</h1>
        <p className="mt-2 text-sm text-ink-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-field bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            Back to home
          </Link>
          {appOrigin ? (
            <a
              href={`${appOrigin}/login`}
              className="inline-flex h-10 items-center rounded-field border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle"
            >
              Log in
            </a>
          ) : null}
        </div>
      </div>
    </main>
  );
}