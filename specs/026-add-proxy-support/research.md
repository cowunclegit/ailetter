# Research: Proxy Support in Node.js

## Decision: Implementation Strategy for Proxy Support

**Choice**: Use `axios` with `https-proxy-agent` (for HTTPS) and standard HTTP agents for proxying.

**Rationale**:
- `axios` is already used in the project for HTTP requests.
- Node.js `http`/`https` modules do not natively support corporate proxies (especially those requiring CONNECT for HTTPS) via simple environment variables without explicit agent configuration.
- `https-proxy-agent` is the industry standard for handling HTTPS proxying in Node.js.
- Supporting `NO_PROXY` requires custom logic to bypass the agent for specific hosts, which can be handled using the `proxy-from-env` package or custom matching logic.

**Alternatives Considered**:
- **Native `http_proxy` support**: Node.js does not automatically use `http_proxy` environment variables for its internal `http` module.
- **Global-agent**: A global-agent could simplify implementation but might have side effects on other parts of the system or third-party libraries that manage their own agents.

## Implementation Details

### Configuration Handling
- `PROXY_URL`: Should support formats like `http://proxy.example.com:8080` and `http://user:pass@proxy.example.com:8080`.
- `NO_PROXY`: Comma-separated list of hostnames or IP ranges that should bypass the proxy.

### Proxy Agent Factory
A utility function in `src/utils/proxy.js` will:
1. Parse `PROXY_URL` and `NO_PROXY`.
2. Determine if a given URL should use the proxy based on `NO_PROXY`.
3. Create and return the appropriate `HttpsProxyAgent` or `http.Agent`.

### Integration with Axios
Update the base `axios` configuration in `proxy-service` to use the custom agent factory.

```javascript
// Example snippet
const agent = getProxyAgent(targetUrl);
const response = await axios.get(targetUrl, {
  httpAgent: agent,
  httpsAgent: agent,
  proxy: false // Disable axios's internal proxy handling to use the agent
});
```

## Unresolved Questions / Needs Clarification
- **Internal DNS**: Does the corporate proxy handle internal DNS? *Assumption: Yes, common in corporate environments.*
- **Protocol Support**: Should we support SOCKS proxies? *Assumption: No, HTTP/HTTPS proxies are the primary requirement.*
