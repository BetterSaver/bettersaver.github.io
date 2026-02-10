#!/usr/bin/env bash

# open config.toml and set baseURL to https://bettersaver-staging.zac-40e.workers.dev/

sed -i -E "s|^baseURL\s*=\s*['\"][^'\"]+['\"]|baseURL = 'https://bettersaver-staging.zac-40e.workers.dev/'|" config.toml

# update links to staging site in content files
find . -type f -name "*.md" -exec sed -i 's|http://localhost:4200|https://bettersaver-dev.web.app|g' {} +