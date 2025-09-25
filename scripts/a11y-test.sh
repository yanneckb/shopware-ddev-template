#!/bin/bash

# a11ywatch Test Script für Shopware
# Verwendung: ./scripts/a11y-test.sh [URL]

A11Y_API="http://127.0.0.1:3282/graphql"
DEFAULT_URL="https://shopware-ddev-app.ddev.site"
URL=${1:-$DEFAULT_URL}

echo "🔍 a11ywatch Test für: $URL"
echo "=================================="

# Funktion für GraphQL-Abfragen
graphql_query() {
    local query="$1"
    curl -s -X POST "$A11Y_API" \
        -H "Content-Type: application/json" \
        -d "{\"query\": \"$query\"}"
}

# 1. Einzelne Seite scannen
echo "📊 Starte Scan für: $URL"
SCAN_RESULT=$(graphql_query "mutation { scanWebsite(url: \"$URL\") { ... on MutationResponse { success message } } }")
echo "Scan Ergebnis: $SCAN_RESULT"

# 2. Website crawlen (mehrere Seiten)
echo ""
echo "🕷️  Starte Website-Crawl für: $URL"
CRAWL_RESULT=$(graphql_query "mutation { crawlWebsite(url: \"$URL\") { ... on MutationResponse { success message } } }")
echo "Crawl Ergebnis: $CRAWL_RESULT"

# 3. Verfügbare Websites anzeigen
echo ""
echo "📋 Verfügbare Websites:"
WEBSITES=$(graphql_query "{ websites { url domain } }")
echo "$WEBSITES"

# 4. Issues abfragen (falls vorhanden)
echo ""
echo "⚠️  Barrierefreiheits-Issues:"
ISSUES=$(graphql_query "{ issues { pageUrl domain } }")
echo "$ISSUES"

echo ""
echo "✅ Test abgeschlossen!"
echo "💡 Tipp: Verwende 'ddev status' um alle verfügbaren Services zu sehen"
