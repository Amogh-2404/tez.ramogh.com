import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { CopyButton } from '@/components/copy-button';

const dockerCommand = `docker run --rm --pull=always --name tez \\
  --read-only --cap-drop=ALL \\
  --security-opt=no-new-privileges \\
  -p 127.0.0.1:8080:8080 ramogh2404/tez:main`;

export default function Home() {
  return (
    <main id="main">
      <section className="hero section-shell">
        <div className="hero-heading">
          <p className="eyebrow">
            <span className="signal" /> C++17 · HTTP/1.1 · MIT
          </p>
          <h1>
            A small
            <br />
            <span>HTTP server.</span>
          </h1>
          <p className="hero-description">
            Define response fixtures in JSON and serve static files from the
            same process. Built with C++17, Boost.Asio, and Boost.Beast.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#start">
              Run Tez <ArrowRight size={18} />
            </a>
            <a className="text-link" href="https://github.com/Amogh-2404/Tez">
              Read the source <ArrowUpRight size={17} />
            </a>
          </div>
          <p className="hero-note">
            By <a href="https://ramogh.com">R. Amogh</a>.
          </p>
        </div>
        <div className="exchange" aria-label="Example HTTP exchange">
          <div className="instrument-title">
            <span>EXAMPLE / GET RESPONSE</span>
            <span className="instrument-dot" />
          </div>
          <div className="request-line">
            <span className="method">GET</span>
            <code>/hello</code>
            <span className="protocol">HTTP/1.1</span>
          </div>
          <div className="trace">
            <div>
              <span className="trace-index">01</span>
              <strong>Accept & parse</strong>
              <span>Boost.Beast</span>
            </div>
            <div>
              <span className="trace-index">02</span>
              <strong>Match the route</strong>
              <span>routes.json</span>
            </div>
            <div>
              <span className="trace-index">03</span>
              <strong>Write the response</strong>
              <span>Boost.Asio</span>
            </div>
          </div>
          <div className="response">
            <div>
              <span className="response-status">200 OK</span>
              <span>text/plain</span>
            </div>
            <pre>hello, Tez</pre>
          </div>
        </div>
      </section>
      <div className="spec-strip section-shell">
        <span>Linux & macOS</span>
        <span>Native amd64 + arm64 images</span>
        <span>JSON routes + static files</span>
        <span>GET + HEAD fixtures</span>
      </div>
      <section id="start" className="start-section section-shell">
        <div>
          <p className="eyebrow section-number">01 / GET STARTED</p>
          <h2>Run with Docker</h2>
          <p>Start the development image and check the health endpoint.</p>
          <a className="text-link" href="/docs">
            Installation guide <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="terminal">
          <div className="terminal-bar">
            <span>Docker · development build</span>
            <CopyButton text={dockerCommand} label="Copy Docker command" />
          </div>
          <pre>
            <code>
              <span className="code-comment"># Start Tez</span>
              {'\n'}
              {dockerCommand}
              {'\n\n'}
              <span className="code-comment"># In another terminal</span>
              {'\n'}curl --fail http://127.0.0.1:8080/health{'\n'}
              <span className="code-answer">{'{"status":"ok"}'}</span>
            </code>
          </pre>
          <p>
            Stop with <code>Ctrl-C</code> or <code>docker stop tez</code>.{' '}
            <code>main</code> is a mutable development tag. Pin a verified
            digest for deployments.
          </p>
        </div>
      </section>
      <section className="use-section section-shell">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">02 / USE CASES</p>
            <h2>
              Local development
              <br />
              and HTTP internals
            </h2>
          </div>
          <p>
            Use fixed responses to test a client, serve a frontend locally, or
            study how a C++ server handles requests.
          </p>
        </div>
        <div className="use-row">
          <span className="use-number">01</span>
          <div>
            <h3>Test against fixed responses</h3>
            <p>
              Keep success and error responses in Git. Make your client handle
              both before the backend is ready.
            </p>
          </div>
          <div>
            <code>
              GET /fixtures/profile → 200
              <br />
              GET /fixtures/unavailable → 503
            </code>
            <a className="text-link" href="/workbench">
              Build a response <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="use-row">
          <span className="use-number">02</span>
          <div>
            <h3>Serve static files</h3>
            <p>
              Serve a small frontend and its response fixtures from the same
              origin. Point Tez at an explicit static root.
            </p>
          </div>
          <div>
            <code>--static-dir examples/fixtures/static</code>
            <a className="text-link" href="/docs/recipes">
              Try the working example <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="use-row">
          <span className="use-number">03</span>
          <div>
            <h3>Read the implementation</h3>
            <p>
              The architecture guide covers parsing, connection lifetime,
              routing, and response writes, with links to the source.
            </p>
          </div>
          <div>
            <code>accept → parse → dispatch → write</code>
            <a className="text-link" href="/docs/architecture">
              Walk through the internals <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
      <section className="internals-section section-shell">
        <div className="internals-heading">
          <div>
            <p className="eyebrow section-number">03 / IMPLEMENTATION</p>
            <h2>
              How requests
              <br />
              are handled
            </h2>
          </div>
          <a className="text-link" href="/docs/engineering">
            Read the design decisions <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="ownership-flow">
          <div>
            <span>01 / ACCEPT</span>
            <h3>Connection limits</h3>
            <p>
              Connection admission has an explicit limit. Each admitted
              connection gets a session.
            </p>
          </div>
          <div>
            <span>02 / PARSE</span>
            <h3>HTTP parsing</h3>
            <p>
              Beast parses HTTP. Tez validates the target, framing, and request
              limits.
            </p>
          </div>
          <div>
            <span>03 / DISPATCH</span>
            <h3>Route selection</h3>
            <p>
              Immutable JSON routes, built-in handlers, or a confined static
              file reader.
            </p>
          </div>
          <div>
            <span>04 / WRITE</span>
            <h3>Response writes</h3>
            <p>
              The response stays alive until the asynchronous write completes.
            </p>
          </div>
        </div>
        <div className="internals-note">
          <p>
            Per-session strands keep operations serialized. Persistent
            connections reuse the session; pipelined responses stay in order.
          </p>
          <p>
            File reads and logging are synchronous today. The{' '}
            <a href="/docs/performance">measurement plan</a> records what still
            needs evidence.
          </p>
        </div>
      </section>
      <section className="project-section section-shell">
        <div className="project-copy">
          <p className="eyebrow">04 / ABOUT</p>
          <h2>About Tez</h2>
          <p>
            Tez is my personal C++ HTTP server project. I use it to work on
            request parsing, asynchronous I/O, and connection management. The
            code and engineering notes are available on GitHub.
          </p>
          <p className="signature">
            R. Amogh <span aria-hidden="true">/</span>{' '}
            <a href="https://ramogh.com" className="text-link">
              ramogh.com <ArrowUpRight size={14} />
            </a>
          </p>
        </div>
        <div className="project-scope">
          <h3>CURRENT SUPPORT</h3>
          <p>
            Tez is in active development toward 1.1.0. It supports HTTP/1.0 and
            HTTP/1.1 on Linux and macOS.
          </p>
          <p>
            TLS, authentication, HTTP/2, HTTP/3, compression, and persistent
            application storage are outside the current implementation.
          </p>
          <a className="text-link" href="/docs/configuration#limits">
            Configuration and limits <ArrowUpRight size={16} />
          </a>
          <br />
          <a
            className="text-link"
            href="https://github.com/Amogh-2404/Tez/issues"
          >
            Report an issue <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </main>
  );
}
