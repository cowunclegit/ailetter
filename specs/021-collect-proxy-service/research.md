# Research: Collect Proxy Service

## Decision: WebSocket Library
- **Chosen**: `ws`
- **Rationale**: `ws` is a lightweight, high-performance WebSocket implementation for Node.js. Since we need a simple bi-directional channel between two trusted servers (Main and Proxy) and don't need complex features like rooms or automatic browser fallbacks provided by `socket.io`, `ws` is the more efficient choice.
- **Alternatives considered**: `socket.io` (rejected as too heavy for server-to-server), `uws` (rejected due to maintenance/build complexity).

## Decision: Secure Handshake
- **Chosen**: Header-based token + Payload-based Identity.
- **Rationale**: During the WebSocket connection request (HTTP Upgrade), the Proxy will send the shared secret in the `Authorization` or a custom header (`x-proxy-token`). Immediately upon connection, the Proxy must send an `identify` message containing its `static_id`. The Main Backend will close the connection if the token is invalid or the identification is not received within 5 seconds.
- **Alternatives considered**: URL params (rejected for security), certificates (rejected for complexity).

## Decision: Data Streaming Pattern
- **Chosen**: Event-driven individual item messages.
- **Rationale**: The Proxy will emit `item_collected` events for each source item. This allows the Main Backend to process and save them incrementally. A final `collection_complete` or `collection_error` message will signify the end of the task.
- **Alternatives considered**: Large array at the end (rejected due to memory/timeout risks).

## Decision: Image Handling
- **Chosen**: Binary (Buffer) sent as part of the JSON payload (Base64 encoded) or separate binary message.
- **Rationale**: While binary is more efficient, Base64 within the JSON `item_collected` message is simpler for implementation given our current schema. However, if performance becomes an issue, we can switch to separate binary messages. For now, we will use Base64 within the JSON to maintain the "one message per item" structure.
- **Alternatives considered**: Proxy serves images via HTTP (rejected as it requires the Main Backend to have internal route access to the Proxy).

## Decision: Local Storage Strategy
- **Chosen**: Dedicated `public/thumbnails/` directory on the Main Backend.
- **Rationale**: Received binary data will be saved as files named by `uuid` or a hash of the original URL. The database will store the relative local path (e.g., `/thumbnails/abc-123.jpg`). This ensures the frontend can serve them directly via Express static middleware.
- **Alternatives considered**: DB BLOBs (rejected due to performance impact on SQLite).
