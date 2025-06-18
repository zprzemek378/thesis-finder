#!/bin/bash

echo "🚀 Starting production build process..."

# Go to the project root
cd "$(dirname "$0")"

# Build client
echo "📦 Building client..."
cd client
npm install
npm run build

# Build server
echo "🛠 Building server..."
cd ../server
npm install
npm run build

# Create production directory if it doesn't exist
echo "📁 Preparing production directory..."
cd ..
mkdir -p dist
rm -rf dist/*

# Copy necessary files to production directory
echo "📋 Copying files to production directory..."
cp -r server/dist/* dist/
cp server/package.json dist/
cp server/.env dist/ 2>/dev/null || :
cp -r client/dist dist/public

# Install production dependencies
echo "📚 Installing production dependencies..."
cd dist
npm install --production

echo "✅ Build complete! The production files are in the dist directory."
echo "To start the server, run: cd dist && npm start"
