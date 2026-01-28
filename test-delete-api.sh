#!/bin/bash

echo "🧪 Testing DELETE Room API"
echo "=========================="
echo ""

# Test 1: Create a test room
echo "📝 Step 1: Creating a test room..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/admin/rooms/save \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Room for DELETE",
    "type": "single",
    "price": 500000,
    "status": "available",
    "description": "This room will be deleted"
  }')

echo "Response: $RESPONSE"
ROOM_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

if [ -z "$ROOM_ID" ]; then
  echo "❌ Failed to create room"
  exit 1
fi

echo "✅ Created room with ID: $ROOM_ID"
echo ""

# Test 2: Verify room exists in database
echo "📊 Step 2: Verifying room exists in database..."
sqlite3 .local/db.sqlite "SELECT id, name, price FROM rooms WHERE id = $ROOM_ID;"
echo ""

# Test 3: DELETE the room via API
echo "🗑️  Step 3: Deleting room via API..."
echo "Request: DELETE /api/admin/rooms/$ROOM_ID"
DELETE_RESPONSE=$(curl -s -X DELETE "http://localhost:3000/api/admin/rooms/$ROOM_ID")
echo "Response: $DELETE_RESPONSE"
echo ""

# Test 4: Verify room is deleted from database
echo "🔍 Step 4: Verifying room is deleted from database..."
ROOM_CHECK=$(sqlite3 .local/db.sqlite "SELECT COUNT(*) FROM rooms WHERE id = $ROOM_ID;")

if [ "$ROOM_CHECK" = "0" ]; then
  echo "✅ SUCCESS: Room $ROOM_ID has been deleted from database!"
else
  echo "❌ FAILED: Room $ROOM_ID still exists in database"
  echo "Current data:"
  sqlite3 .local/db.sqlite "SELECT id, name FROM rooms WHERE id = $ROOM_ID;"
fi

echo ""
echo "📋 All rooms in database:"
sqlite3 .local/db.sqlite "SELECT id, name, price FROM rooms;"
