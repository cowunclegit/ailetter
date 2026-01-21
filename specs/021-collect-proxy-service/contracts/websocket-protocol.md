# WebSocket Protocol: Main Backend <-> Collect Proxy Service

## Connection Handshake
- **URL**: `ws://<main-backend-ip>:<port>/ws/proxy`
- **Headers**:
  - `x-proxy-token`: Shared secret token.

## Message Format
All messages are JSON objects with a `type` and `payload`.

### 1. Identify (Proxy -> Main)
Sent immediately after connection.
```json
{
  "type": "IDENTIFY",
  "payload": {
    "client_id": "collect-proxy-01"
  }
}
```

### 2. Start Collection (Main -> Proxy)
Delegates the collection task.
```json
{
  "type": "START_COLLECTION",
  "payload": {
    "task_id": "uuid-123",
    "sources": [
      { "url": "https://example.com/rss", "type": "rss" },
      { "channel_id": "UC...", "type": "youtube" }
    ]
  }
}
```

### 3. Item Collected (Proxy -> Main)
Streamed for each found item.
```json
{
  "type": "ITEM_COLLECTED",
  "payload": {
    "task_id": "uuid-123",
    "item": {
      "title": "...",
      "source_url": "...",
      "thumbnail_data": "base64...",
      ...
    }
  }
}
```

### 4. Progress Update (Proxy -> Main)
```json
{
  "type": "PROGRESS_UPDATE",
  "payload": {
    "task_id": "uuid-123",
    "message": "Scraping source X...",
    "current": 5,
    "total": 10
  }
}
```

### 5. Collection Complete (Proxy -> Main)
```json
{
  "type": "COLLECTION_COMPLETE",
  "payload": {
    "task_id": "uuid-123",
    "summary": { "total_collected": 45, "errors": [] }
  }
}
```

### 6. Collection Error (Proxy -> Main)
```json
{
  "type": "COLLECTION_ERROR",
  "payload": {
    "task_id": "uuid-123",
    "error": "Source X timeout",
    "is_fatal": false
  }
}
```
