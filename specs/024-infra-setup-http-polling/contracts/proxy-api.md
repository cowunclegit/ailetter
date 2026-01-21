# Proxy API Contracts

## Authentication
All requests MUST include the `x-proxy-token` header.

---

## 1. Get Pending Tasks
Retrieves the next available collection task.

- **Endpoint**: `GET /api/proxy/tasks`
- **Response**: `200 OK`
- **Body**:
  ```json
  {
    "task": {
      "id": "uuid-v4",
      "sources": [
        { "id": 1, "type": "rss", "url": "https://example.com/rss" }
      ]
    }
  }
  ```
- **Response (No Tasks)**: `204 No Content`

---

## 2. Update Task Progress
Sends progress updates or results to the backend.

- **Endpoint**: `POST /api/proxy/update`
- **Request Body**:
  ```json
  {
    "type": "PROGRESS_UPDATE | ITEM_COLLECTED | COLLECTION_COMPLETE | COLLECTION_ERROR",
    "payload": {
      "task_id": "uuid-v4",
      "..." : "payload data"
    }
  }
  ```
- **Response**: `200 OK`
  ```json
  { "status": "accepted" }
  ```
