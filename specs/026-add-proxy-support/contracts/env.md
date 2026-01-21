# Contract: Environment Variables for Proxy Service

## Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PROXY_URL` | The URL of the corporate proxy. Supports authentication. | `http://user:password@proxy.corp.com:8080` |
| `NO_PROXY` | Comma-separated list of hostnames to bypass the proxy. | `localhost,127.0.0.1,.internal.corp.com` |

## Behavior
- If `PROXY_URL` is not set, all connections are direct.
- If `PROXY_URL` is set, all connections are proxied except those matching `NO_PROXY`.
- `HTTPS_PROXY` and `HTTP_PROXY` can be used as aliases for `PROXY_URL`.
