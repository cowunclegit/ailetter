# Data Model: Collect Proxy Service

## Entities

### Collection Task (Memory/Internal State)
This entity tracks the lifecycle of a collection request. While it may not be persisted to a long-term DB table immediately, it exists in the active state of the Main Backend.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier for the task. |
| `status` | Enum | `pending`, `in_progress`, `completed`, `failed`. |
| `sources` | Array | List of source objects (URL, type, etc.). |
| `started_at` | DateTime | When the task was delegated. |
| `updated_at` | DateTime | Last activity from the proxy. |

### Proxy Status (Main Backend State)
Tracks the connectivity of the remote proxy.

| Field | Type | Description |
| :--- | :--- | :--- |
| `is_connected` | Boolean | Current WebSocket connection status. |
| `last_seen` | DateTime | Timestamp of the last heartbeat/message. |
| `client_id` | String | Static ID of the connected proxy (e.g., "collect-proxy-01"). |

### Trend Item DTO (Data Transfer Object)
The structure of the data sent from the Proxy to the Main Backend.

| Field | Type | Description |
| :--- | :--- | :--- |
| `source_url` | String | Original URL of the item. |
| `title` | String | Title of the trend. |
| `content` | String | Snippet or description. |
| `thumbnail_data` | String | Base64 encoded image data (optional). |
| `published_at` | DateTime | Original publication time. |
| `tags` | Array | Initial tags identified by proxy. |

## State Transitions (Collection Task)
1. `pending`: Task created by user action.
2. `in_progress`: Command sent to Proxy and acknowledged.
3. `completed`: Proxy sent `collection_complete` message.
4. `failed`: Proxy reported error, or 5-minute timeout reached.
