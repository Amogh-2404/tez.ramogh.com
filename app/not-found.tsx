export default function NotFound() {
  return (
    <main id="main" className="not-found section-shell">
      <p className="eyebrow">HTTP / 404</p>
      <h1>Page not found</h1>
      <p>
        The page may have moved. Browse the documentation or return to the home
        page.
      </p>
      <div className="hero-actions">
        <a href="/" className="button button-primary">
          Back to Tez ↗
        </a>
        <a href="/docs" className="text-link">
          Documentation ↗
        </a>
      </div>
    </main>
  );
}
