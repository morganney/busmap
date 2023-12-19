CREATE TABLE IF NOT EXISTS "sso_provider" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "name" varchar(32) NOT NULL,
  "client_id" varchar(128) NOT NULL,
  "client_secret" varchar(128) NOT NULL
) WITH (oids = false);

CREATE TABLE IF NOT EXISTS "rider" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "sub" varchar(128) UNIQUE NOT NULL,
  "email" varchar(128) UNIQUE NOT NULL,
  "sso_provider" integer NOT NULL,
  "given_name" varchar(32) NOT NULL,
  "family_name" varchar(32),
  "full_name" varchar(64) NOT NULL,
  "last_login" timestamptz NOT NULL DEFAULT now(),
  "settings" jsonb NOT NULL DEFAULT '{}'::jsonb,
  FOREIGN KEY (sso_provider) REFERENCES sso_provider(id) ON UPDATE CASCADE ON DELETE CASCADE
) WITH (oids = false);

CREATE TABLE IF NOT EXISTS "favorite" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "agency_id" varchar(64) NOT NULL,
  "route_id" varchar(32) NOT NULL,
  "stop_id" varchar(32) NOT NULL,
  "ui" jsonb NOT NULL,
  UNIQUE (agency_id, route_id, stop_id)
) WITH (oids = false);

CREATE TABLE IF NOT EXISTS "rider_favorite" (
  "rider" integer NOT NULL,
  "favorite" integer NOT NULL,
  "rank" smallint NOT NULL DEFAULT 1,
  "created" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (rider, favorite),
  FOREIGN KEY (rider) REFERENCES rider(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (favorite) REFERENCES favorite(id) ON UPDATE CASCADE ON DELETE CASCADE
) WITH (oids = false);
