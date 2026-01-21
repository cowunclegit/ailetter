# Proxy Service

Collects external data (RSS, YouTube, meta-scraping).

## Configuration

The service can be configured via environment variables.

### Proxy Support

If you are running the service from behind a corporate proxy, you can configure the following variables:

- `PROXY_URL`: The full URL of your proxy server. Supports Basic Authentication.
  - Example: `http://user:password@proxy.example.com:8080`
- `NO_PROXY`: A comma-separated list of hostnames that should bypass the proxy.
  - Example: `localhost,127.0.0.1,.internal.corp.com`

Alternatively, standard environment variables `HTTPS_PROXY` and `HTTP_PROXY` are also supported.

## Usage

```bash
npm install
npm start
```

## Testing

```bash
npm test
```
