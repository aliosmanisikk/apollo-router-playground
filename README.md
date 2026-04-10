# Apollo Router Playground (Docker Only)

This project runs fully with Docker Compose.

Stack:

- Apollo Router
- 3 federated subgraphs
- Rover supergraph compose
- Redis (response cache backend)
- Jaeger (tracing)

The composed supergraph (`playground.graphql`) is stored in a Docker named volume, not in your host workspace.

## Prerequisites

- Docker
- Docker Compose

## Environment

Set these variables in `.env`:

- `APOLLO_GRAPH_REF`
- `APOLLO_KEY`
- `ROUTER_IMAGE` (example: `ghcr.io/apollographql/router:v2.12.1`)
- `APOLLO_ROUTER_LOG_LEVEL` (example: `info`)

## Quick Start

```bash
yarn docker:up
```

Check status:

```bash
yarn docker:status
```

Stop everything:

```bash
yarn docker:down
```

## Script Shortcuts

All scripts use direct `docker compose` commands.

Core:

- `yarn docker:up`
- `yarn docker:down`
- `yarn docker:build`
- `yarn docker:rebuild`
- `yarn docker:restart`
- `yarn docker:status`
- `yarn docker:clean`

Logs:

- `yarn docker:logs`
- `yarn docker:logs:router`
- `yarn docker:logs:subgraphs`
- `yarn docker:logs:rover`
- `yarn docker:logs:redis`
- `yarn docker:logs:jaeger`

Shell and tools:

- `yarn docker:shell:router`
- `yarn docker:shell:subgraphs`
- `yarn docker:shell:redis`
- `yarn docker:routes`
- `yarn docker:redis-cli`

## Endpoints

- Router GraphQL: http://localhost:4000/graphql
  - Enable `Request query plans from router` in settings to be able to see query plans
- Router health: http://localhost:4000/health
- Jaeger UI: http://localhost:16686
- Subgraph A: http://localhost:3001/graphql
- Subgraph B: http://localhost:3002/graphql
- Subgraph C: http://localhost:3003/graphql

## Redis

Redis backs Apollo Router response cache. Most important commands:

```bash
# open interactive Redis CLI
docker compose exec redis redis-cli

# list cache keys
docker compose exec redis redis-cli --scan --pattern 'local:router-service:*'

# read one key (replace <key>)
docker compose exec redis redis-cli GET '<key>'

# check key TTL in seconds
docker compose exec redis redis-cli TTL '<key>'
```

## Jaeger UI

Jaeger is used for distributed tracing from Apollo Router and subgraphs.

```bash
# open Jaeger UI
open http://localhost:16686
```

In Jaeger UI:

- Select service: `apollo-router-playground` (or available router service)
- Click `Find Traces`
- Run a GraphQL query against `http://localhost:4000/graphql`
- Refresh traces if needed
