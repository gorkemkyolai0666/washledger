#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4009/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== WashLedger Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@sparklecoinlaundry.com","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
assert_status "Dashboard Stats" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/machines" -H "Authorization: Bearer $TOKEN")
assert_status "List Machines" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/collections" -H "Authorization: Bearer $TOKEN")
assert_status "List Collections" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/repair-orders" -H "Authorization: Bearer $TOKEN")
assert_status "List Repair Orders" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/service-schedules" -H "Authorization: Bearer $TOKEN")
assert_status "List Service Schedules" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/pricing-tiers" -H "Authorization: Bearer $TOKEN")
assert_status "List Pricing Tiers" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/laundromat" -H "Authorization: Bearer $TOKEN")
assert_status "Laundromat Profile" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/repair-orders/urgent" -H "Authorization: Bearer $TOKEN")
assert_status "Urgent Repair Orders" 200 "$HTTP_CODE"

CREATE_MACHINE=$(curl -s -w "\n%{http_code}" "$API_URL/machines" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"number":"T99","zone":"Test Zone","machineType":"washer","capacityLbs":20}')
HTTP_CODE=$(echo "$CREATE_MACHINE" | tail -1)
assert_status "Create Machine" 201 "$HTTP_CODE"

MACHINE_ID=$(echo "$CREATE_MACHINE" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$MACHINE_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/machines/$MACHINE_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"maintenance"}')
  assert_status "Update Machine" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/machines/$MACHINE_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Machine" 200 "$HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats")
assert_status "Unauthorized Access" 401 "$HTTP_CODE"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
