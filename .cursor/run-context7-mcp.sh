#!/usr/bin/env bash
# Load CONTEXT7_API_KEY from .env.local (project root).
# Usage: run from project root; Cursor runs MCP from project root when using .cursor/mcp.json.

set -e

# Resolve project root from script location (works when script path is absolute or relative from project root).
SCRIPT_PATH="${BASH_SOURCE[0]}"
if [[ "$SCRIPT_PATH" != /* ]]; then
  SCRIPT_PATH="$(pwd)/$SCRIPT_PATH"
fi
PROJECT_ROOT="$(cd "$(dirname "$SCRIPT_PATH")/.." && pwd)"
cd "$PROJECT_ROOT"

if [ ! -f .env.local ]; then
  echo "CONTEXT7_API_KEY is not set: .env.local not found in $PROJECT_ROOT." >&2
  exit 1
fi

set -a
# shellcheck source=/dev/null
source .env.local
set +a

if [ -z "${CONTEXT7_API_KEY:-}" ]; then
  echo "CONTEXT7_API_KEY is not set after sourcing .env.local. Check:" >&2
  echo "  - Variable name is exactly CONTEXT7_API_KEY (no spaces around =)." >&2
  echo "  - Line is not commented out." >&2
  exit 1
fi

# Run with --check to only verify env and key are loaded (for testing).
if [ "${1:-}" = "--check" ]; then
  echo "OK: CONTEXT7_API_KEY is set (length ${#CONTEXT7_API_KEY} chars)."
  exit 0
fi

exec npx -y @upstash/context7-mcp --api-key "$CONTEXT7_API_KEY"
