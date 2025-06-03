#!/bin/bash

# Exit on any error
set -e

PRIVATE_KEY_FILE="private.pem"
PUBLIC_KEY_FILE="public.pem"
ENV_FILE=".env"

echo "Generating RSA 2048-bit private key..."
openssl genpkey -algorithm RSA -out "$PRIVATE_KEY_FILE" -pkeyopt rsa_keygen_bits:2048

echo "Extracting public key..."
openssl rsa -pubout -in "$PRIVATE_KEY_FILE" -out "$PUBLIC_KEY_FILE"

echo "Encoding keys to base64..."
PRIVATE_KEY_B64=$(base64 -w 0 "$PRIVATE_KEY_FILE")
PUBLIC_KEY_B64=$(base64 -w 0 "$PUBLIC_KEY_FILE")

echo "Appending keys to $ENV_FILE..."
{
  echo ""
  echo "# RSA keys generated on $(date)"
  echo "PRIVATE_KEY_B64=$PRIVATE_KEY_B64"
  echo "PUBLIC_KEY_B64=$PUBLIC_KEY_B64"
} >> "$ENV_FILE"

echo "Done! Keys appended to .env file."
