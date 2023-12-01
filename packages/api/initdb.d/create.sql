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
  "last_login" timestamptz NOT NULL,
  FOREIGN KEY (sso_provider) REFERENCES sso_provider(id) ON UPDATE CASCADE ON DELETE CASCADE
) WITH (oids = false);
