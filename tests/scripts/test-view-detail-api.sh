#!/bin/bash

echo "🧪 Testing View Detail API Endpoints"
echo "====================================="
echo ""

# Test 1: Project Detail
echo "1️⃣  Testing Project Detail API"
echo "   GET /api/projects/id/1"
echo "   -----------------------------------"

response=$(curl -s -w "\n%{http_code}" "http://localhost:3000/api/projects/id/1")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | sed '$d')

echo "   HTTP Status: $http_code"

if [ "$http_code" = "200" ]; then
    echo "   ✅ SUCCESS!"
    echo "   Project data:"
    echo "$body" | jq '.name, .location, .type' 2>/dev/null || echo "$body" | head -c 200
else
    echo "   ❌ FAILED"
    echo "   Response: $body"
fi

echo ""
echo ""

# Test 2: Post Detail
echo "2️⃣  Testing Post Detail API"
echo "   GET /api/posts/id/1"
echo "   -----------------------------------"

response2=$(curl -s -w "\n%{http_code}" "http://localhost:3000/api/posts/id/1")
http_code2=$(echo "$response2" | tail -n 1)
body2=$(echo "$response2" | sed '$d')

echo "   HTTP Status: $http_code2"

if [ "$http_code2" = "200" ]; then
    echo "   ✅ SUCCESS!"
    echo "   Post data:"
    echo "$body2" | jq '.title, .author' 2>/dev/null || echo "$body2" | head -c 200
else
    echo "   ❌ FAILED"
    echo "   Response: $body2"
fi

echo ""
echo ""

# Test 3: Room Detail
echo "3️⃣  Testing Room Detail API"
echo "   GET /api/admin/rooms/id/1"
echo "   -----------------------------------"

response3=$(curl -s -w "\n%{http_code}" "http://localhost:3000/api/admin/rooms/id/1")
http_code3=$(echo "$response3" | tail -n 1)
body3=$(echo "$response3" | sed '$d')

echo "   HTTP Status: $http_code3"

if [ "$http_code3" = "200" ]; then
    echo "   ✅ SUCCESS!"
    echo "   Room data:"
    echo "$body3" | jq '.name, .type, .price' 2>/dev/null || echo "$body3" | head -c 200
else
    echo "   ❌ FAILED"
    echo "   Response: $body3"
fi

echo ""
echo ""

# Test 4: 404 Error Handling
echo "4️⃣  Testing 404 Error Handling"
echo "   GET /api/projects/id/999"
echo "   -----------------------------------"

response4=$(curl -s -w "\n%{http_code}" "http://localhost:3000/api/projects/id/999")
http_code4=$(echo "$response4" | tail -n 1)
body4=$(echo "$response4" | sed '$d')

echo "   HTTP Status: $http_code4"

if [ "$http_code4" = "404" ]; then
    echo "   ✅ SUCCESS! (404 handled correctly)"
    echo "   Error message:"
    echo "$body4" | jq '.message' 2>/dev/null || echo "$body4"
else
    echo "   ⚠️  Expected 404, got $http_code4"
fi

echo ""
echo ""

# Test 5: Invalid ID Error Handling
echo "5️⃣  Testing Invalid ID Error Handling"
echo "   GET /api/projects/id/abc"
echo "   -----------------------------------"

response5=$(curl -s -w "\n%{http_code}" "http://localhost:3000/api/projects/id/abc")
http_code5=$(echo "$response5" | tail -n 1)
body5=$(echo "$response5" | sed '$d')

echo "   HTTP Status: $http_code5"

if [ "$http_code5" = "400" ]; then
    echo "   ✅ SUCCESS! (400 handled correctly)"
    echo "   Error message:"
    echo "$body5" | jq '.message' 2>/dev/null || echo "$body5"
else
    echo "   ⚠️  Expected 400, got $http_code5"
fi

echo ""
echo "====================================="
echo "✨ Testing completed!"
echo ""
echo "💡 Summary:"
echo "   - Project Detail API: $([ "$http_code" = "200" ] && echo "✅" || echo "❌")"
echo "   - Post Detail API: $([ "$http_code2" = "200" ] && echo "✅" || echo "❌")"
echo "   - Room Detail API: $([ "$http_code3" = "200" ] && echo "✅" || echo "❌")"
echo "   - 404 Handling: $([ "$http_code4" = "404" ] && echo "✅" || echo "❌")"
echo "   - 400 Handling: $([ "$http_code5" = "400" ] && echo "✅" || echo "❌")"
