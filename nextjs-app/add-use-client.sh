#!/bin/bash

for file in src/components/ui/*.tsx; do
  if ! grep -q "use client" "$file"; then
    sed -i '' '1s/^/"use client"\n\n/' "$file"
    echo "Added to: $(basename $file)"
  fi
done
