#!/bin/sh
set -eu

cat <<EOF >/usr/share/nginx/html/runtime-config.js
window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};
window.__APP_CONFIG__.API_BASE_URL = "${APP_API_BASE_URL:-http://localhost:5270/api}";
EOF

exec nginx -g 'daemon off;'
