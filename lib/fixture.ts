export type Fixture = {
  path: string;
  status: string;
  contentType: string;
  body: string;
};
export const statuses = [
  '200 OK',
  '201 Created',
  '204 No Content',
  '400 Bad Request',
  '404 Not Found',
  '503 Service Unavailable',
] as const;
export const contentTypes = [
  'text/plain; charset=utf-8',
  'application/json',
  'text/html; charset=utf-8',
] as const;
export const presets: Record<string, Fixture> = {
  hello: {
    path: '/hello',
    status: '200 OK',
    contentType: contentTypes[0],
    body: 'hello, Tez\n',
  },
  profile: {
    path: '/fixtures/profile',
    status: '200 OK',
    contentType: 'application/json',
    body: '{\n  "name": "Ada",\n  "role": "engineer"\n}\n',
  },
  unavailable: {
    path: '/fixtures/unavailable',
    status: '503 Service Unavailable',
    contentType: 'application/json',
    body: '{\n  "error": "temporarily unavailable"\n}\n',
  },
};
export function validateFixture(value: unknown): Fixture {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Provide a route object.');
  const item = value as Record<string, unknown>;
  if (
    Object.keys(item).some(
      (key) => !['path', 'status', 'contentType', 'body'].includes(key),
    )
  )
    throw new Error('Unexpected route field.');
  for (const key of ['path', 'status', 'contentType', 'body'])
    if (typeof item[key] !== 'string')
      throw new Error(`${key} must be a string.`);
  const fixture = item as Fixture;
  if (!/^\/[A-Za-z0-9/_-]*$/.test(fixture.path) || fixture.path.length > 256)
    throw new Error(
      'Start with /. Use letters, numbers, slashes, hyphens, or underscores (up to 256 characters).',
    );
  if (
    ['/health', '/echo', '/api/data'].includes(fixture.path) ||
    fixture.path.startsWith('/static/')
  )
    throw new Error(
      'That path belongs to a built-in endpoint. Choose a different path.',
    );
  if (!(statuses as readonly string[]).includes(fixture.status))
    throw new Error('Choose a supported response status.');
  if (!(contentTypes as readonly string[]).includes(fixture.contentType))
    throw new Error('Choose a supported content type.');
  if (fixture.body.length > 65536)
    throw new Error('Keep this workbench response below 65,536 characters.');
  for (let index = 0; index < fixture.body.length; index += 1) {
    const unit = fixture.body.charCodeAt(index);
    if (unit >= 0xd800 && unit <= 0xdbff) {
      const next = fixture.body.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff))
        throw new Error(
          'The response contains an unpaired Unicode surrogate. Remove the invalid character.',
        );
      index += 1;
    } else if (unit >= 0xdc00 && unit <= 0xdfff)
      throw new Error(
        'The response contains an unpaired Unicode surrogate. Remove the invalid character.',
      );
  }
  if (fixture.status === '204 No Content' && fixture.body !== '')
    throw new Error('204 responses must have an empty body.');
  if (
    fixture.contentType === 'application/json' &&
    fixture.status !== '204 No Content'
  ) {
    try {
      JSON.parse(fixture.body);
    } catch {
      throw new Error('The response body is not valid JSON.');
    }
  }
  return fixture;
}
export function buildFixture(value: unknown) {
  const fixture = validateFixture(value);
  const config =
    JSON.stringify(
      {
        [fixture.path]: {
          status: fixture.status,
          content_type: fixture.contentType,
          body: fixture.body,
        },
      },
      null,
      2,
    ) + '\n';
  return {
    config,
    curl: `curl --include 'http://127.0.0.1:8080${fixture.path}'`,
    bytes: new TextEncoder().encode(fixture.body).length,
  };
}
