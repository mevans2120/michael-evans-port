#!/bin/bash
# Script to help identify and fix unused variables
# Lists all unused variable warnings with file paths for manual review

echo "=== Unused Variables by Category ==="
echo ""

echo "📦 Unused Imports (can be removed):"
npm run lint 2>&1 | grep "is defined but never used" | grep -E "(import|'[A-Z])" | head -15

echo ""
echo "🔧 Unused Variables (prefix with _):"
npm run lint 2>&1 | grep "is assigned a value but never used" | head -15

echo ""
echo "⚙️  Unused Function Parameters (prefix with _):"
npm run lint 2>&1 | grep "Allowed unused args" | head -10

echo ""
echo "❌ Unused Caught Errors (rename to _error):"
npm run lint 2>&1 | grep "Allowed unused caught errors" | head -10

echo ""
echo "📊 Total Count:"
echo "Total unused var warnings: $(npm run lint 2>&1 | grep -c '@typescript-eslint/no-unused-vars')"
