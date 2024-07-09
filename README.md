# Meatbag Chess
Self-hosted chess server to play against your friends, no AI allowed

```yaml
services:
  app:
    image: ghcr.io/knrdl/meatbagchess:edge
    hostname: meatbagchess
    restart: always
    ports:
      - 8000:8000
    cpus: 2
    mem_limit: 750mb
    memswap_limit: 1gb
```