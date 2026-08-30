#!/usr/bin/env bash
# Quick manual smoke test against a locally running `python run.py`.
set -e
BASE=http://localhost:5000/api

reg=$(curl -s -X POST $BASE/auth/register -H "Content-Type: application/json" \
  -d '{"email":"smoke@example.com","password":"testpass123","name":"Smoke Test"}')
echo "register: $reg"
token=$(echo "$reg" | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

echo "me: $(curl -s $BASE/auth/me -H "Authorization: Bearer $token")"

conv=$(curl -s -X POST $BASE/conversions -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{"from_currency":"KES","to_currency":"USD","amount":1000,"rate":0.0077,"converted_value":7.7}')
echo "create conversion: $conv"

echo "list conversions: $(curl -s $BASE/conversions -H "Authorization: Bearer $token")"

conv_id=$(echo "$conv" | python3 -c "import sys,json;print(json.load(sys.stdin)['conversion']['id'])")
echo "patch conversion: $(curl -s -X PATCH $BASE/conversions/$conv_id -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" -d '{"amount":2000}')"

trip=$(curl -s -X POST $BASE/trips -H "Authorization: Bearer $token" -H "Content-Type: application/json" \
  -d '{"destination":"Dubai, UAE","travel_date":"2026-09-06","days":7,"budget_kes":150000,"target_currency":"AED","channel":"Bank","rate":0.0403,"converted_amount":3042.0}')
echo "create trip: $trip"

trip_id=$(echo "$trip" | python3 -c "import sys,json;print(json.load(sys.stdin)['trip']['id'])")
echo "list trips: $(curl -s $BASE/trips -H "Authorization: Bearer $token")"
echo "patch trip: $(curl -s -X PATCH $BASE/trips/$trip_id -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" -d '{"days":10}')"
echo "delete trip status: $(curl -s -o /dev/null -w '%{http_code}' -X DELETE $BASE/trips/$trip_id -H "Authorization: Bearer $token")"

echo "patch profile: $(curl -s -X PATCH $BASE/auth/me -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" -d '{"name":"Updated Name"}')"

echo "unauthenticated /me status: $(curl -s -o /dev/null -w '%{http_code}' $BASE/auth/me)"
