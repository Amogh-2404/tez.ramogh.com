# Get started

Run Tez with Docker, or build from source on Linux or macOS.

## Run with Docker

The `main` image is the current development build for Linux amd64 and arm64. Start it on your machine's loopback interface:

```sh
docker run --rm --pull=always --name tez \
  --read-only --cap-drop=ALL --security-opt=no-new-privileges \
  -p 127.0.0.1:8080:8080 ramogh2404/tez:main
```

In a second terminal:

```sh
curl --fail http://127.0.0.1:8080/health
```

The response is:

```json
{"status":"ok"}
```

Stop with `Ctrl-C` in the server terminal or `docker stop tez`. The `main` tag is mutable. Use the [container guide](/docs/deployment/) to inspect the source revision and pin an exact digest.

## Build from source

You need a C++17 compiler, CMake 3.20+, Boost 1.74+, and nlohmann/json 3.7+. Tests also use GoogleTest and Python 3.8+. Linux and macOS are supported.

On macOS:

```sh
brew install cmake boost nlohmann-json googletest python
```

On Ubuntu or Debian:

```sh
sudo apt-get update
sudo apt-get install build-essential cmake libboost-all-dev nlohmann-json3-dev libgtest-dev python3
```

Then build and run the tests:

```sh
git clone https://github.com/Amogh-2404/Tez.git
cd Tez
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=ON
cmake --build build --parallel 2
ctest --test-dir build --output-on-failure
```

## Run the example fixtures

The commands in this section use the source build above. To use Docker with your own routes, follow the [configuration mount recipe](/docs/deployment/#mount-your-content).

The repository includes a small response set and a browser page that makes real requests to it. Validate the configuration before opening a listener:

```sh
./build/Tez --config examples/fixtures/routes.json \
  --static-dir examples/fixtures/static --check-config
```

You should see `Configuration valid.`, the selected paths, and three configured routes. Validation does not bind a port or scan every static file.

Start the same configuration:

```sh
./build/Tez --config examples/fixtures/routes.json \
  --static-dir examples/fixtures/static
```

In another terminal:

```sh
curl --fail http://127.0.0.1:8080/hello
curl --include http://127.0.0.1:8080/fixtures/profile
curl --head http://127.0.0.1:8080/fixtures/profile
curl --include http://127.0.0.1:8080/fixtures/unavailable
```

The greeting is `hello, Tez`. The profile is a fixed JSON response. The final endpoint deliberately returns `503 Service Unavailable`, so your client can exercise its error state. Open `http://127.0.0.1:8080/static/index.html` to inspect the same endpoints in your browser.

## Edit a response

Open `examples/fixtures/routes.json` and change the `/hello` body to `"hello from my project\n"`. Stop and restart Tez, then request `/hello` again:

```sh
curl --fail http://127.0.0.1:8080/hello
```

The response is now `hello from my project`. Routes are loaded once at startup. The fixture files stay easy to review and version in Git.

For a new response, the [route workbench](/workbench/) generates a valid configuration file and curl command. It runs locally in your browser and sends nothing to a server.

## Supported behavior and limits

Configured routes answer **GET and HEAD**. `/echo` accepts POST and PUT for inspecting a request body. The built-in `/api/data` responses are demonstrations without persistence. Static assets are available below `/static/`; there is no directory index or automatic `index.html` resolution.

Tez currently implements HTTP/1.0 and HTTP/1.1. TLS, authentication, CORS middleware, HTTP/2, HTTP/3, compression, and live route reload are not included. Keep local development on loopback. See [configuration](/docs/configuration/) for exact limits and [deployment](/docs/deployment/) before exposing a service.

## Related documentation

- [Configuration](/docs/configuration/): command-line flags, routes, and resource limits.
- [How it works](/docs/architecture/): connection ownership, parsing, and file access.
- [Fixture recipes](/docs/recipes/): success, error, and same-origin browser workflows.
- [Contributing](/docs/contributing/): build checks and focused changes.
