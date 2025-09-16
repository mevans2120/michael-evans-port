#!/bin/bash

echo "📋 Sanity Project Setup Script"
echo "================================"
echo ""
echo "This script will help you create a Sanity project."
echo ""

# Check if Sanity CLI is authenticated
echo "Checking Sanity authentication..."
npx sanity@latest login

# Create the project
echo ""
echo "Creating Sanity project..."
echo "When prompted:"
echo "1. Choose 'Create new project'"
echo "2. Enter project name: 'Michael Evans Portfolio'"
echo "3. Use public dataset: Yes"
echo "4. Output path: ./sanity (or just press Enter)"
echo ""

npx sanity@latest init --bare

echo ""
echo "✅ Project created! Now updating your .env.local file..."
echo ""
echo "Please copy your Project ID from above and I'll help you update the environment variables."
echo ""
echo "Your Project ID should look something like: 'abc123xyz'"
echo ""
read -p "Enter your Sanity Project ID: " PROJECT_ID

# Update .env.local file
if [ ! -z "$PROJECT_ID" ]; then
    cat > .env.local << EOF
# Sanity Configuration
VITE_SANITY_PROJECT_ID=$PROJECT_ID
VITE_SANITY_DATASET=production
# VITE_SANITY_API_TOKEN=optional-for-private-datasets
EOF
    echo "✅ Updated .env.local with Project ID: $PROJECT_ID"
else
    echo "❌ No Project ID provided. Please update .env.local manually."
fi

echo ""
echo "📋 Next Steps:"
echo "1. The project has been created and configured"
echo "2. Your .env.local file has been updated"
echo "3. Now you can run: npm run dev"
echo "4. Access Sanity Studio at: http://localhost:5173/studio"
echo ""
echo "Don't forget to configure CORS origins in your Sanity project dashboard:"
echo "- https://www.sanity.io/manage/project/$PROJECT_ID/api"
echo "- Add: http://localhost:5173"
echo "- Add: https://michael-evans-port.vercel.app"