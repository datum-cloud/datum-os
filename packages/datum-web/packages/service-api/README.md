# Repo Service API

Packages functions from the `datum-service` repo for use in NextJS applications. To implement this, just add a route `/api/actions/[name]/route.ts` with the following code:

```
import { apiHandler } from '@repo/service-api/server'

export const POST = apiHandler

```
