#!/bin/bash

# Generate Supabase TypeScript types
echo "Generating Supabase types..."
supabase gen types typescript --local > src/lib/schemas/database.types.ts

# Generate Zod schemas from types
echo "Generating Zod schemas..."
npx supazod \
  -i src/lib/schemas/database.types.ts \
  -o src/lib/schemas/_database.ts \
  -s public \
  --table-operation-pattern "{table}{operation}" \
  --capitalize-names true

echo "✅ Schema generation complete!"