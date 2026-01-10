#!/bin/bash

# Phase 6: API Testing Script
# This script tests all the endpoints and functionality

BASE_URL="http://localhost:5001/api"
PASS_COUNT=0
FAIL_COUNT=0

echo "======================================"
echo "Phase 6: Testing & Validation"
echo "======================================"
echo ""

# Helper function
test_endpoint() {
    local test_name="$1"
    local url="$2"
    local expected="$3"
    
    echo "Testing: $test_name"
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "$expected"; then
        echo "✅ PASS: $test_name"
        ((PASS_COUNT++))
    else
        echo "❌ FAIL: $test_name"
        echo "   Response: ${response:0:100}..."
        ((FAIL_COUNT++))
    fi
    echo ""
}

# Wait for server to be ready
echo "Waiting for server to be ready..."
for i in {1..30}; do
    if curl -s "$BASE_URL/countries?limit=1" > /dev/null 2>&1; then
        echo "✅ Server is ready!"
        break
    fi
    sleep 1
done
echo ""

# 6.1: Test GET /api/countries without params
echo "6.1: Testing GET /api/countries without params"
test_endpoint "Returns paginated response" "$BASE_URL/countries" '"items"'
test_endpoint "Returns 20 items by default" "$BASE_URL/countries" '"limit":20'

# 6.2: Test pagination
echo "6.2: Testing pagination"
test_endpoint "Page 2 returns correct page" "$BASE_URL/countries?page=2" '"page":2'
test_endpoint "Custom limit works" "$BASE_URL/countries?limit=5" '"limit":5'

# 6.3: Test search functionality
echo "6.3: Testing search functionality"
test_endpoint "Search by country name" "$BASE_URL/countries?search=Germany" '"name":"Germany"'
test_endpoint "Search by capital" "$BASE_URL/countries?search=Berlin" '"capital":"Berlin"'
test_endpoint "Search is case-insensitive" "$BASE_URL/countries?search=germany" '"name":"Germany"'

# 6.4: Test region filtering
echo "6.4: Testing region filtering"
test_endpoint "Filter by Africa" "$BASE_URL/countries?region=Africa" '"region":"Africa"'
test_endpoint "Filter by Americas" "$BASE_URL/countries?region=Americas" '"region":"Americas"'
test_endpoint "Filter by Asia" "$BASE_URL/countries?region=Asia" '"region":"Asia"'

# 6.5: Test combined filters
echo "6.5: Testing combined filters"
test_endpoint "Search + Region" "$BASE_URL/countries?search=South&region=Africa" '"region":"Africa"'
test_endpoint "Search + Pagination" "$BASE_URL/countries?search=United&page=1&limit=5" '"limit":5'

# 6.6: Test GET /api/countries/:code
echo "6.6: Testing GET /api/countries/:code"
test_endpoint "Valid alpha3Code" "$BASE_URL/countries/DEU" '"name":"Germany"'
test_endpoint "borderCountries populated" "$BASE_URL/countries/DEU" '"borderCountries"'
test_endpoint "Invalid code returns 404" "$BASE_URL/countries/INVALID" '"statusCode":404'

echo ""
echo "======================================"
echo "Test Results Summary"
echo "======================================"
echo "✅ Passed: $PASS_COUNT"
echo "❌ Failed: $FAIL_COUNT"
echo "======================================"
