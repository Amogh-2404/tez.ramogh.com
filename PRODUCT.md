# Tez: product and website direction

## The job

Help a developer get a repeatable local HTTP response, serve nearby static assets, and inspect the implementation when behavior matters. Fixed GET/HEAD fixtures and an understandable C++ request path are the current strengths.

The first useful result is a successful `/health` request. The next is a developer-owned fixture, exported from the workbench or edited in Git. Reading the internals is available without becoming a prerequisite for either.

## Product changes in this pass

- Validate configuration without binding a port with `--check-config`.
- Identify selected files, configured route count, and invalid route fields.
- Preserve container defaults when developers supply extra CLI flags.
- Provide fixed success/error fixtures and a real same-origin browser example.
- Publish documentation tied to the source revision and a local configuration workbench.

## Visual direction

A technical field guide with the clarity of an instrument panel. Forest green, amber, and pale green carry the existing Tez identity. Large, tightly set type establishes hierarchy; rules and whitespace separate content. The request path is the primary diagram. There are no invented adoption counters, testimonials, benchmark graphs, or pretend server results.

The site uses system fonts, static HTML, and local assets. Main content is readable without JavaScript; copy controls, presets, and exports enhance the workbench and guides. Motion respects reduced-motion preferences. The workbench keeps its input local and validates before export.

## Research behind the choices

The following are design references, not performance comparisons or endorsements:

- [Caddy getting started](https://caddyserver.com/docs/getting-started): complete tasks and checkable results.
- [Bun quickstart](https://bun.com/docs/quickstart): make the first command easy to reach.
- [Hono introduction](https://hono.dev/docs/getting-started/basic): explain the category with a compact working example.
- [SQLite appropriate uses](https://www.sqlite.org/whentouse.html): help readers decide whether the tool fits.
- [Ghostty about](https://ghostty.org/docs/about): explain engineering intent and project ownership plainly.

## Boundaries and future decisions

Tez remains a development project implementing HTTP/1.x. TLS, authentication, CORS middleware, compression, HTTP/2, HTTP/3, live route reload, and persistent application state are not part of the current product. Filesystem reads and logging remain synchronous.

Before claiming a speedup, run the repository's measurement plan on a suitable dedicated machine. Before expanding scope, choose a concrete consumer need and add the corresponding protocol, lifecycle, and resource-limit tests. Configurable methods, reload semantics, file streaming, and graceful draining each need their own design; a polished website does not establish those guarantees.
