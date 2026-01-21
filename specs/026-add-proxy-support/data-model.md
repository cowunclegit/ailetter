# Data Model: Proxy Configuration

## Entities

### ProxySettings
Represents the system-wide proxy configuration derived from environment variables.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `proxyUrl` | String | The full URL of the proxy server | Must be a valid URL (http/https) |
| `noProxy` | Array<String> | List of hosts to bypass the proxy | Optional, comma-separated in env |
| `useProxy` | Boolean | Flag to enable/disable proxy logic | Derived from presence of `proxyUrl` |

## Logic

### Proxy Matching
- For each outgoing request, the `targetHost` is checked against the `noProxy` list.
- If a match is found (exact or subdomain match), the request is made directly.
- Otherwise, if `useProxy` is true, the request is routed through the `proxyUrl`.
