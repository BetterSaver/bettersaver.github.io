#!/usr/bin/env bash

# open config.toml and set baseURL to https://bettersaver-staging.zac-40e.workers.dev/

sed -i -E "s|^baseURL\s*=\s*['\"][^'\"]+['\"]|baseURL = 'https://bettersaver-staging.zac-40e.workers.dev/'|" config.toml

