CREATE TABLE IF NOT EXISTS "sso_provider" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "name" varchar(32) NOT NULL,
  "client_id" varchar(128) NOT NULL,
  "client_secret" varchar(128) NOT NULL
) WITH (oids = false);

CREATE TABLE IF NOT EXISTS "user" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "sso_provider" integer NOT NULL,
  "email" varchar(128) NOT NULL,
  "given_name" varchar(32) NOT NULL,
  "family_name" varchar(32),
  "last_login" timestamptz NOT NULL,
  UNIQUE("sso_provider", "email"),
  FOREIGN KEY (sso_provider) REFERENCES sso_provider(id) ON UPDATE CASCADE ON DELETE CASCADE
) WITH (oids = false);
