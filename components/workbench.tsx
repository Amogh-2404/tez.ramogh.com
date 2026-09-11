'use client';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowDownToLine, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CopyButton } from '@/components/copy-button';
import {
  buildFixture,
  validateFixture,
  presets,
  statuses,
  contentTypes,
  type Fixture,
} from '@/lib/fixture';

type ModelTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
};
type ModelDocument = Document & {
  modelContext?: {
    registerTool: (
      tool: ModelTool,
      options: { signal: AbortSignal },
    ) => void | Promise<void>;
  };
};

export function Workbench() {
  const [fixture, setFixture] = useState<Fixture>({ ...presets.hello });
  const [notice, setNotice] = useState('');
  let result: ReturnType<typeof buildFixture> | undefined;
  let error = '';
  try {
    result = buildFixture(fixture);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Invalid route.';
  }
  function edit(key: keyof Fixture, value: string) {
    setFixture((previous) => ({ ...previous, [key]: value }));
    setNotice('');
  }
  useEffect(() => {
    const context = (document as ModelDocument).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: 'configure_tez_fixture',
            title: 'Configure a Tez fixture',
            description:
              'Validate and update the visible local route workbench. Returns config JSON and curl command. Does not start a server, send an HTTP request, or save a file.',
            inputSchema: {
              type: 'object',
              properties: {
                path: { type: 'string', maxLength: 256 },
                status: { type: 'string', enum: [...statuses] },
                contentType: { type: 'string', enum: [...contentTypes] },
                body: { type: 'string', maxLength: 65536 },
              },
              required: ['path', 'status', 'contentType', 'body'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: true },
            execute(input: unknown) {
              const next = validateFixture(input);
              const output = buildFixture(next);
              flushSync(() => {
                setFixture({ ...next });
                setNotice('Route updated.');
              });
              return output;
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {
      /* Browsers without a working registry retain the full interface. */
    }
    return () => lifecycle.abort();
  }, []);
  function download() {
    if (!result) return;
    const url = URL.createObjectURL(
      new Blob([result.config], { type: 'application/json' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'routes.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('routes.json downloaded.');
  }
  return (
    <div className="workbench">
      <div className="workbench-presets">
        <span>START WITH</span>
        {Object.entries(presets).map(([key, value]) => (
          <Button
            type="button"
            variant="ghost"
            key={key}
            onClick={() => {
              setFixture({ ...value });
              setNotice('Example loaded.');
            }}
            className="preset-button"
          >
            {key === 'hello'
              ? 'Hello, Tez'
              : key === 'profile'
                ? 'JSON fixture'
                : 'Error response'}{' '}
            <ArrowRight size={14} />
          </Button>
        ))}
      </div>
      <div className="workbench-grid">
        <section className="route-editor" aria-labelledby="route-title">
          <div className="workbench-bar">
            <h2 id="route-title">01 / Define the response</h2>
            <span>GET + HEAD</span>
          </div>
          <div className="route-fields">
            <label htmlFor="route-path">Route path</label>
            <input
              id="route-path"
              value={fixture.path}
              maxLength={256}
              spellCheck={false}
              onChange={(e) => edit('path', e.target.value)}
              aria-describedby="path-help"
            />
            <p id="path-help" className="field-help">
              Use a path such as /hello or /fixtures/profile.
            </p>
            <div className="field-pair">
              <div>
                <label id="status-label" htmlFor="status-select">
                  Status
                </label>
                <Select
                  value={fixture.status}
                  onValueChange={(value) => {
                    if (value) {
                      setFixture((previous) => ({
                        ...previous,
                        status: value,
                        body: value === '204 No Content' ? '' : previous.body,
                      }));
                      setNotice('');
                    }
                  }}
                >
                  <SelectTrigger
                    id="status-select"
                    aria-labelledby="status-label"
                    className="route-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="route-options">
                    {statuses.map((value) => (
                      <SelectItem value={value} key={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label id="type-label" htmlFor="type-select">
                  Content type
                </label>
                <Select
                  value={fixture.contentType}
                  onValueChange={(value) => value && edit('contentType', value)}
                >
                  <SelectTrigger
                    id="type-select"
                    aria-labelledby="type-label"
                    className="route-select"
                  >
                    <SelectValue>
                      {(value) =>
                        value === 'application/json'
                          ? 'JSON'
                          : value === contentTypes[2]
                            ? 'HTML'
                            : 'Plain text'
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="route-options">
                    {contentTypes.map((value) => (
                      <SelectItem value={value} key={value}>
                        {value === 'application/json'
                          ? 'JSON'
                          : value === contentTypes[2]
                            ? 'HTML'
                            : 'Plain text'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <label htmlFor="route-body">
              Response body <span>{result ? `${result.bytes} bytes` : ''}</span>
            </label>
            <textarea
              id="route-body"
              value={fixture.body}
              maxLength={65536}
              spellCheck={false}
              onChange={(e) => edit('body', e.target.value)}
              disabled={fixture.status === '204 No Content'}
              aria-describedby="body-help route-error"
            />
            <p id="body-help" className="field-help">
              The exact body returned for GET. HEAD returns headers only.
            </p>
            <output id="route-error" className="route-feedback">
              {error || 'Ready to export.'}
            </output>
          </div>
        </section>
        <section className="route-output" aria-labelledby="output-title">
          <div className="workbench-bar">
            <h2 id="output-title">02 / Export configuration</h2>
            <span>routes.json</span>
          </div>
          <div className="output-code">
            <div className="output-caption">
              <span>CONFIGURATION</span>
              {result && <CopyButton text={result.config} label="Copy JSON" />}
            </div>
            <pre>
              <code>
                {result?.config ||
                  '// Fix the route to generate valid configuration.'}
              </code>
            </pre>
          </div>
          <div className="output-request">
            <div className="output-caption">
              <span>REQUEST IT LOCALLY</span>
              {result && <CopyButton text={result.curl} label="Copy curl" />}
            </div>
            <pre>
              <code>{result?.curl || '// Waiting for a valid route.'}</code>
            </pre>
          </div>
          <div className="export-controls">
            <Button
              onClick={download}
              disabled={!result}
              className="button button-primary export-button"
            >
              <ArrowDownToLine size={17} />
              Download routes.json
            </Button>
            <Button
              variant="ghost"
              className="reset-button"
              onClick={() => {
                setFixture({ ...presets.hello });
                setNotice('Reset to hello, Tez.');
              }}
            >
              <RotateCcw size={15} />
              Reset
            </Button>
            <output>{notice}</output>
          </div>
        </section>
      </div>
    </div>
  );
}
