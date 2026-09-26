#!/usr/bin/env bash
set -e
for port in 3000 4000; do
  pid=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [ -n "$pid" ]; then
    kill -9 $pid
  fi
done
docker compose up --build
