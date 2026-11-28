# Contributing

## Requirements

- Nix with flakes
- Node.js 24
- pnpm (the version pinned in `package.json`'s `packageManager`)
- dprint, from the systemfsoftware/dprint flake

The dev shell (`nix develop`, or direnv) puts every tool on PATH, dprint included.

## Dependencies on core

`@systemfsoftware` packages come from npm like any other dependency: package manifests and catalogs name caret ranges and `pnpm-lock.yaml` holds the exact versions. Run `pnpm update '@systemfsoftware/*'` to take newer ones.

`flake.nix` pins core at a full commit (input `core`) only for its nixpkgs.

## Setup and workflow

```bash
nix develop   # then run the rest inside it
pnpm install
pnpm format
pnpm check:local
```

`pnpm check:local` runs what the required CI checks run: dprint, build, lint, typecheck, type tests, API reports,
attw and the tests. Run it before pushing.

## Pull requests

Open pull requests against `main` in systemfsoftware/npm-package. Commit messages follow Conventional Commits
(`commitlint.config.ts`).

## What CI checks

A pull request runs one job. It lints the squash message and runs `pnpm check:static`: dprint, build, lint, typecheck,
type tests, API reports and attw. A pull request that changes only documentation skips the dev shell and the static
checks, and still lints the squash message.

The merge queue's draft and a push to `main` run `pnpm check:ci`, which adds the whole test suite. A newer push to a
pull request cancels its older run.
