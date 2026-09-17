# Medusa Order Comments

<img src="./assets/icon.svg" alt="Medusa Order Comments icon" width="64">

Add private, attributed comments to orders in the Medusa Admin. The plugin keeps
the complete comment history next to the order and highlights the latest entry.

[Medusa documentation](https://docs.medusajs.com) ·
[Report an issue](https://github.com/slowpokes/medusa-plugin-order-comments/issues)

## Features

- Adds an **Order comments** widget to the order details side column.
- Opens an inline textarea from the **Add comment** button.
- Shows every comment, newest first, without pagination.
- Shows the latest comment at the top and labels it **Latest**.
- Records the admin user's ID, name, email, and creation time.
- Preserves the author's display data if the admin account is later changed or
  removed.
- Stores comments in a dedicated module and database table; Medusa core files
  are not modified.
- Exposes authenticated Admin API endpoints for listing and creating comments.

Comments are internal to the Admin API. No Store API route is registered.

## Compatibility

- Medusa `>=2.17.2 <3`
- Node.js `>=20`
- PostgreSQL (the database supported by Medusa 2 production projects)

Medusa 2.17.2 is the minimum because this plugin uses the current
`order.details.side` layout injection zone.

## Installation

Install the plugin in the Medusa application's backend directory:

```bash
npm install medusa-plugin-order-comments
```

Register it in `medusa-config.ts`:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  plugins: [
    {
      resolve: "medusa-plugin-order-comments",
      options: {},
    },
  ],
})
```

Run the plugin migration and rebuild/start Medusa:

```bash
npx medusa db:migrate
npm run build
npm run start
```

During development, use `npm run dev` instead of the last two commands.

Open an order in Medusa Admin. The **Order comments** widget appears in the side
column. On Medusa versions with layout configuration, an administrator can move
the widget to another position on the order page.

## Admin API

Both routes use Medusa's standard admin authentication.

### List all comments for an order

```http
GET /admin/orders/{order_id}/comments
```

```json
{
  "comments": [
    {
      "id": "ordcom_...",
      "order_id": "order_...",
      "content": "Call the customer before shipping.",
      "author_id": "user_...",
      "author_email": "admin@example.com",
      "author_first_name": "Ada",
      "author_last_name": "Lovelace",
      "created_at": "2026-09-17T12:00:00.000Z",
      "updated_at": "2026-09-17T12:00:00.000Z"
    }
  ]
}
```

The endpoint deliberately returns the complete history, sorted from newest to
oldest.

### Add a comment

```http
POST /admin/orders/{order_id}/comments
Content-Type: application/json

{
  "content": "Call the customer before shipping."
}
```

Comments are trimmed, must not be empty, and can contain up to 5,000
characters. The author is always taken from the authenticated admin session;
clients cannot impersonate another author.

## Activity timeline

Medusa doesn't expose a supported extension point for inserting custom records
into the core order Activity timeline. This plugin therefore renders its own
complete history in the documented `order.details.side` widget zone. It does
not patch or import private Dashboard internals.

## Data model and behavior

Comments are append-only from the public plugin API. The plugin intentionally
doesn't expose edit or delete routes, which keeps the order's internal audit
trail understandable. Medusa's generated soft-delete support remains available
to custom server-side code using the module service.

The plugin stores a snapshot of the author's name and email with every comment.
This is useful for attribution, but it also means comment rows contain personal
data. Include this table in your organization's retention and data-access
policies.

## Local plugin development

```bash
corepack enable
pnpm install
pnpm test:unit
pnpm test:integration:modules
pnpm lint
pnpm typecheck
pnpm build
```

Module integration tests require PostgreSQL and the `DB_HOST`, `DB_PORT`,
`DB_USERNAME`, and `DB_PASSWORD` environment variables.

To test the package in another Medusa application with Medusa's local registry:

```bash
npx medusa plugin:publish
```

Then, in the target Medusa backend:

```bash
npx medusa plugin:add medusa-plugin-order-comments
npx medusa db:migrate
```

## License

[MIT](./LICENSE)
