#! /bin/bash

REQ_URL="http://localhost:8080/rates"

echo "Received JSON response:"
curl --silent --header "Content-Type: application/json" $REQ_URL | jq
