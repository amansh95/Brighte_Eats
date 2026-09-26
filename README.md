## How to run

You only need Docker installed.

**Install Docker**

- **macOS (Homebrew):**
  ```bash
  brew install --cask docker
  ```
  Then open the Docker app once from Applications so it finishes starting up.
- **Windows (winget):**
  ```powershell
  winget install Docker.DockerDesktop
  ```
  Or follow steps at https://docs.docker.com/desktop/setup/install/windows-install/

  Then launch Docker Desktop once from the Start menu so it finishes starting up.

**Run the project**

```bash
git clone <this repo>
cd "Brighte_Eats"
```

- **macOS/Linux:** `./scripts/up.sh`
- **Windows (PowerShell):** `docker compose up --build`

Either script frees ports 3000 and 4000 on your machine if something else is already using them, then runs `docker compose up --build`. If you'd rather run Compose directly and skip the port-clearing step, `docker compose up --build` works the same way.

This starts three containers: Postgres, the backend, and the frontend. The backend automatically applies the database migration and seeds the three service types on startup — no manual setup step.

- Frontend: http://localhost:3000

Stop everything with `Ctrl+C`, then `docker compose down`. Your data persists in a Docker volume between runs; add `-v` to `docker compose down` if you want a completely clean database next time.

Run tests with `npm test` inside both `frontend` and `backend`.

## Why I chose [database / framework / frontend library]

- PostgresQL - I was familiar with it and it's easy to use. Any relational database is fine.
- Prisma ORM - I've used it previously and its one of the most supported ones out there
- Frontend - React/Next.js - Easier to build a full stack app with it and since its a framework for React, it's easy to pick up.
- Backend - GraphQL was a requirement for this project. I had not used it previously but it was not too hard to pick up.

## Data modelling trade-offs

- Since adding new service types was a requirement, i did not go forward with Enum. Adding to an enum would have required a schema migration. 
- JSON was not really a good option as we cannot enforce / reject if a service type is incorrect.
- I went with a lookup table plus join.
  - Each service type has a unique ID and is stored in a lookup table.
  - The join table, lead_services has one row for each service a user is interested in. So many to many is easily supported by just adding a new line. We can ensure no duplicated as the PK is the lead id + service type id. If this this already exists, it wont be added
- Each lead has a unique email so if the lead already exists, they can be updated and not replaced

## Validation strategy — client vs server

- Data is validated on both the client and server side.
- Client side validation so that a user cannot send bad data
- Server side validation so that if I make a manual API request, bad data will still be filtered at an API level and prevents database errors

## Idempotency approach

- Each lead has a unique email so if the lead already exists, they can be updated and not replaced. 

## What I'd change at 10x scale

- **Caching the service types:** `serviceTypes` barely ever changes but is queried on every registration and every dashboard load. I'd cache it in memory or Redis with a short TTL instead of hitting Postgres each time.
- **Connection pooling:** a single Postgres instance with each backend replica opening its own connections doesn't scale past a handful of instances. I'd a DB pooling in front of it, and add a read replica for the dashboard's read-heavy `leads` query.
- **Horizontal scaling the backend:** it's already stateless, so running several replicas behind a load balancer is straightforward — Postgres would become the bottleneck first, which the two points above address.
- **Rate limiting `register`:** nothing stops one client from submitting repeatedly right now; the brief calls this out as an optional stretch goal, and at real scale it stops being optional.
- **Observability:** there's no structured observability in the form of logging, error tracking, or query performance monitoring. At 10x traffic, finding a slow query or a spike in failed registrations would mean guessing. There is also no alerting which is needed for prod.

## TODOs / known gaps

- **`register`'s validation stops at the first invalid field** instead of reporting all of them at once, so a request with three bad fields only ever tells you about one.
- **Validation logic is duplicated, not shared,** between `frontend/lib/validation.ts` and `backend/src/validation.ts`. They currently agree, but nothing enforces that — a rule change in one won't be caught by the other.
- **An unrecognized service code is silently dropped**, not rejected, by the `register` mutation. That's a deliberate choice for a changing list of service types, but it does mean a typo in a service code fails silently rather than with an error.
- **No frontend tests yet** — only the backend has an automated suite. The form's error-on-API-failure case from the brief has been checked manually, not automated.
- **No CI.** Tests only run locally; nothing runs them automatically on push.

## AI Assistance

- Initial project scaffolding
- Writing seed and dummy data scripts
- A lot of help with GraphQL as I am unfamiliar with it
- I described all the test cases and the bodies were filled by Claude
- Script setup to clear ports so that apps can run uninterrupted
- FE CSS
- Windows deploy script since I do not have a windows machine
