# PostgreSQL Connection Setup

The Vercel Node.js function in `api/health.js` checks PostgreSQL connectivity using the shared pool in `api/db.js`. The pool is created lazily and limited to one connection per warm serverless instance. It does not create tables, run migrations, or perform CMS queries.

## Create the Database

Create a PostgreSQL 13+ database with a managed PostgreSQL provider. Use the provider's pooled connection URL when available and require TLS/SSL according to the provider's connection instructions. Keep the connection URL private.

## Configure `DATABASE_URL`

For Vercel, open the project settings, choose **Environment Variables**, and add `DATABASE_URL` with the connection URL provided by the database provider. Select the deployment environments that should connect, then redeploy so the function receives the variable.

For local development, copy `.env.example` to `.env.local` and set `DATABASE_URL` locally. The ignore rules exclude `.env`, `.env.local`, and `.env.*.local`; never commit a populated environment file or paste the value into source code.

## Apply the Schema

Apply the schema to a new, empty database with `psql`. Supply the URL through a secure environment variable rather than placing credentials in a committed file:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/schema.sql
```

In PowerShell, once `DATABASE_URL` is set in the current secure environment:

```powershell
psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f database/schema.sql
```

The schema is not run by the application or by the health check. Review `database/README.md` before applying it; it is intended for a new database.

## Test Connectivity

Install project dependencies with `npm install`. Locally, run the Vercel development server (`vercel dev`) with `DATABASE_URL` available, then request `http://localhost:3000/api/health`. After deployment, request `https://<your-domain>/api/health`.

A successful database check returns HTTP 200:

```json
{"success":true,"database":"connected"}
```

A failed or unconfigured database connection returns HTTP 503 without exposing the connection URL, credentials, or exception details:

```json
{"success":false,"database":"disconnected"}
```
