# Quickstart: Dashboard Chronological Sort

## Verification Steps

### 1. Database Check
Verify that trend items are being stored with ISO8601 timestamps.
```bash
sqlite3 dev.db "SELECT published_at FROM trend_items LIMIT 5;"
```

### 2. API Sorting Test
Request trends from the API and check the order.
```bash
curl "http://localhost:3080/api/trends?limit=10" | jq '.[].published_at'
```
Expectation: Timestamps should be in strictly descending order.

### 3. Pagination Stability
Request page 1, then page 2, and ensure the last item of page 1 is strictly newer than (or equal to, with a lower ID than) the first item of page 2.
```bash
# Page 1
curl "http://localhost:3080/api/trends?limit=5&offset=0"
# Page 2
curl "http://localhost:3080/api/trends?limit=5&offset=5"
```
