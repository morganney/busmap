#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  INSERT INTO "sso_provider" ("name", "client_id", "client_secret") VALUES
  ('Google OAuth', '$SSO_GOOG_CLIENT_ID', '$SSO_GOOG_CLIENT_SECRET');
EOSQL
