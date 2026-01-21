# Quickstart: Configuring Proxy Support

## Setup

1. Open the `.env` file in the root or `proxy-service` directory.
2. Add the following variables:
   ```env
   PROXY_URL=http://your-proxy-host:port
   NO_PROXY=localhost,127.0.0.1,your-internal-api.com
   ```
3. If your proxy requires authentication:
   ```env
   PROXY_URL=http://username:password@your-proxy-host:port
   ```

## Verification

1. Start the `proxy-service`:
   ```bash
   cd proxy-service
   npm install
   npm start
   ```
2. Monitor the logs to ensure external requests (e.g., RSS collection) are succeeding.
3. Test a "No Proxy" host to ensure it still works directly.

## Troubleshooting

- **407 Proxy Authentication Required**: Check your `PROXY_URL` credentials.
- **502/503 Service Unavailable**: The proxy server might be down or misconfigured.
- **Connection Timeout**: The proxy might be blocking the target port (e.g., 443).
