#!/bin/bash

echo "🧪 Testing CRUD Operations"
echo "=========================="
echo ""

echo "1️⃣ Testing CREATE (POST /api/admin/projects)"
curl -X POST http://localhost:3000/api/admin/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"CLI Test","slug":"cli-test","description":"Test from CLI"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null | head -c 200
echo ""
echo ""

echo "2️⃣ Testing READ (GET /api/admin/projects)"
curl -s http://localhost:3000/api/admin/projects | jq 'length'
echo ""

echo "3️⃣ Testing UPDATE (PUT /api/admin/projects/1)"
curl -X PUT http://localhost:3000/api/admin/projects/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated via CLI"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null | head -c 200
echo ""
echo ""

echo "4️⃣ Testing DELETE (DELETE /api/admin/projects/999)"
curl -X DELETE http://localhost:3000/api/admin/projects/999 \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null
echo ""

echo "✅ Test Complete!"
