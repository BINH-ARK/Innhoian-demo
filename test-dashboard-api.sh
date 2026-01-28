#!/bin/bash

# Test Admin Dashboard API
# Kiểm tra endpoint /api/admin/dashboard

echo "🧪 Testing Admin Dashboard API..."
echo "=================================="
echo ""

# Test GET /api/admin/dashboard
echo "📊 Testing: GET /api/admin/dashboard"
echo "-----------------------------------"

response=$(curl -s -w "\n%{http_code}" http://localhost:5000/api/admin/dashboard)
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | sed '$d')

echo "HTTP Status: $http_code"
echo ""
echo "Response Body:"
echo "$body" | jq '.' 2>/dev/null || echo "$body"
echo ""

if [ "$http_code" = "200" ]; then
    echo "✅ SUCCESS: Dashboard API is working!"
    
    # Parse and display stats
    echo ""
    echo "📈 Dashboard Statistics:"
    echo "----------------------"
    echo "$body" | jq -r '
        "Projects: \(.stats.projects.total) (Growth: \(.stats.projects.growth)%)",
        "Services: \(.stats.services.total) (Growth: \(.stats.services.growth)%)",
        "Posts: \(.stats.posts.total) (Growth: \(.stats.posts.growth)%)",
        "Messages: \(.stats.messages.total) (Growth: \(.stats.messages.growth)%)"
    ' 2>/dev/null || echo "Could not parse stats (jq not installed)"
else
    echo "❌ FAILED: Expected 200, got $http_code"
fi

echo ""
echo "=================================="
echo "✨ Test completed!"
