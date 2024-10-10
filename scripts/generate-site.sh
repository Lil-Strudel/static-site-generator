#!/bin/bash

set -e

# BUCKET_NAME="$1"
# CONFIG="$2"
#
# echo "Using bucket: $BUCKET_NAME"
# echo "Using config: $CONFIG"

# Run the TypeScript app for page generation
echo "Running page generator TypeScript app..."
pnpm --filter=apps-page-generator run dev

# Copy generated files to the appropriate directory
echo "Copying generated files..."
cp -R ./apps/page-generator/generated/* ./apps/generator/src/

# Build the Astro app
echo "Building the Astro app..."
pnpm --filter=apps-generator run build 

# Run the deploy script
echo "Running deploy script..."
pnpm --filter=apps-deploy run deploy

echo "All steps completed successfully!"
