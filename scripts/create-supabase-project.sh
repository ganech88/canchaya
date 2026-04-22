#!/usr/bin/env bash
# Crea el proyecto Supabase `canchaya` en la org DSF (vionvpxmostbmsplwcup) en sa-east-1.
# Requiere pausar/borrar antes uno de los proyectos free-tier (consorcio, legalia) o upgrade a Pro.
#
# Uso:
#   export SUPABASE_PAT=sbp_xxx
#   ./scripts/create-supabase-project.sh

set -euo pipefail

: "${SUPABASE_PAT:?SUPABASE_PAT env var required}"

DB_PASS=$(openssl rand -base64 24 | tr -d '/+=' | cut -c1-24)
echo "Generated DB password (guardalo ya en tu password manager):"
echo "  $DB_PASS"
echo

response=$(curl -s -X POST "https://api.supabase.com/v1/projects" \
  -H "Authorization: Bearer $SUPABASE_PAT" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"canchaya\",\"organization_id\":\"vionvpxmostbmsplwcup\",\"db_pass\":\"$DB_PASS\",\"region\":\"sa-east-1\",\"plan\":\"free\"}")

echo "$response" | jq .

ref=$(echo "$response" | jq -r '.ref // .id // empty')
if [[ -n "$ref" ]]; then
  echo
  echo "✓ Proyecto creado. Linkear con:"
  echo "  pnpm supabase link --project-ref $ref"
  echo "  pnpm db:push"
  echo
  echo "URL: https://$ref.supabase.co"
fi
