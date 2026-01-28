#!/bin/bash

# Test script for POST /api/admin/rooms/save endpoint
# Usage: bash test-rooms-save.sh

BASE_URL="http://localhost:3000"

echo "========================================="
echo "Testing POST /api/admin/rooms/save"
echo "========================================="
echo ""

# Test 1: Create new room (INSERT)
echo "Test 1: Creating new room..."
echo "-----------------------------------"
curl -X POST "$BASE_URL/api/admin/rooms/save" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Executive Suite",
    "type": "suite",
    "price": 2000000,
    "status": "available",
    "projectId": 1,
    "description": "Luxurious executive suite with panoramic views",
    "amenities": ["Air Conditioning", "WiFi", "King Bed", "Jacuzzi", "Mini Bar", "Smart TV"],
    "images": ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"]
  }'
echo -e "\n"

# Test 2: Update existing room (UPDATE)
echo "Test 2: Updating room with id=1..."
echo "-----------------------------------"
curl -X POST "$BASE_URL/api/admin/rooms/save" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "name": "Deluxe Garden View - Updated",
    "type": "double",
    "price": 850000,
    "status": "available",
    "description": "Updated: Spacious room with beautiful garden view"
  }'
echo -e "\n"

# Test 3: Validation error - missing required field
echo "Test 3: Testing validation (missing name)..."
echo "-----------------------------------"
curl -X POST "$BASE_URL/api/admin/rooms/save" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "single",
    "price": 500000
  }'
echo -e "\n"

# Test 4: Validation error - invalid price
echo "Test 4: Testing validation (negative price)..."
echo "-----------------------------------"
curl -X POST "$BASE_URL/api/admin/rooms/save" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Room",
    "type": "single",
    "price": -100
  }'
echo -e "\n"

# Test 5: Update non-existent room
echo "Test 5: Updating non-existent room (id=999)..."
echo "-----------------------------------"
curl -X POST "$BASE_URL/api/admin/rooms/save" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 999,
    "name": "Non-existent Room",
    "type": "single",
    "price": 500000
  }'
echo -e "\n"

# Test 6: Get all rooms to verify changes
echo "Test 6: Getting all rooms to verify..."
echo "-----------------------------------"
curl -X GET "$BASE_URL/api/admin/rooms"
echo -e "\n"

echo "========================================="
echo "Tests completed!"
echo "========================================="
