'use client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CopyButton } from '@/components/copy-button';
const docker = `docker run --rm --pull=always --name tez-fixture \\\n  --read-only --cap-drop=ALL --security-opt=no-new-privileges \\\n  -p 127.0.0.1:8080:8080 \\\n  --mount "type=bind,src=$(pwd)/routes.json,dst=/app/config.json,readonly" \\\n  ramogh2404/tez:main`;
const native =
  './build/Tez --config routes.json --check-config\n./build/Tez --config routes.json';
export function RunFixture() {
  return (
    <section className="workbench-next">
      <div>
        <p className="eyebrow">03 / RUN LOCALLY</p>
        <h2>Use your configuration</h2>
        <p>
          Put your downloaded <code>routes.json</code> in your working
          directory. Choose Docker, or build Tez with the{' '}
          <a href="/docs#build-from-source">source guide</a>.
        </p>
        <p>
          Stop any previous server using port 8080. Run your curl command in a
          second terminal. Stop Tez with <code>Ctrl-C</code>; restart after
          editing routes.
        </p>
      </div>
      <Tabs defaultValue="docker" className="run-tabs">
        <TabsList className="run-tabs-list" aria-label="Run your fixture">
          <TabsTrigger value="docker">Docker</TabsTrigger>
          <TabsTrigger value="native">From source</TabsTrigger>
        </TabsList>
        <TabsContent value="docker">
          <div className="terminal">
            <div className="terminal-bar">
              <span>DOCKER COMMAND</span>
              <CopyButton text={docker} label="Copy commands" />
            </div>
            <pre>
              <code>{docker}</code>
            </pre>
            <p>
              The file must be readable by container user 10001.{' '}
              <a href="/docs/deployment">Container reference ↗</a>
            </p>
          </div>
        </TabsContent>
        <TabsContent value="native">
          <div className="terminal">
            <div className="terminal-bar">
              <span>FROM YOUR TEZ CHECKOUT</span>
              <CopyButton text={native} label="Copy commands" />
            </div>
            <pre>
              <code>{native}</code>
            </pre>
            <p>
              Configured routes answer GET and HEAD.{' '}
              <a href="/docs/configuration">Configuration reference ↗</a>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
