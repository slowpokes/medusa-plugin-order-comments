# Contributing

Bug reports and focused pull requests are welcome.

1. Open an issue for behavior changes or substantial work.
2. Fork the repository and create a small branch.
3. Add or update tests with the change.
4. Run `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, and `pnpm build`.
5. For persistence changes, also run `pnpm test:integration:modules` against
   PostgreSQL and include a generated Medusa migration.
6. Open a pull request explaining the behavior and verification performed.

By participating, you agree to follow the project's Code of Conduct.
