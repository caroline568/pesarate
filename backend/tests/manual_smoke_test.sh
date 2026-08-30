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

echo "unauthenticated /me status: $(curl -s -o /dev/null -w '%{http_code}' $BASE/auth/me)"
