## How To Install The Development SSL Certificate

1. Install [mkcert](https://github.com/FiloSottile/mkcert#installation).
2. `mkcert -install`.
3. `mkcert busmap.localhost`.

That should install a CA in your OS trust store and produce two files:

- busmap.localhost-key.pem (key)
- busmap.localhost.pem (cert)

Now copy the `*.pem` files into the web package certs directory (`packages/web/certs`).
