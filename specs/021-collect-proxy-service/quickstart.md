# Quickstart: Collect Proxy Service

## Prerequisites
- Main Backend and Proxy Service must have a shared secret token.
- Proxy Service must have outbound internet access.

## Setup Main Backend
1. Define environment variables:
   - `PROXY_SHARED_SECRET`: The shared token.
   - `THUMBNAIL_STORAGE_PATH`: Path to save images (e.g., `./public/thumbnails`).
2. Start the backend. It will listen for WebSocket connections on `/ws/proxy`.

## Setup Proxy Service
1. Define environment variables:
   - `MAIN_BACKEND_WS_URL`: `ws://<main-ip>:<port>/ws/proxy`
   - `PROXY_SHARED_SECRET`: Same token as Main Backend.
   - `PROXY_CLIENT_ID`: `collect-proxy-01`.
2. Start the Proxy Service. It will automatically connect to the Main Backend.

## Verification
1. Access the Dashboard on the frontend.
2. Observe the "Proxy Status" indicator (should be green).
3. Click "Collect Now".
4. Monitor logs on both services for the `START_COLLECTION` and `ITEM_COLLECTED` messages.
5. Verify that items appear in the dashboard and thumbnails are saved to the storage path.
