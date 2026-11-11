# npm-package

Build an npm package in memory from a map of file paths, pack it to a `.tgz`, or read a tarball back into a package. Nothing here touches the filesystem, and nothing runs `npm`.

Requires Node.js 24 or later.

## Quick start

```ts
import { createPackage, packPackage } from '@systemfsoftware/npm-package'

const pkg = createPackage(
  {
    'package.json': JSON.stringify({ name: 'greeter', version: '1.0.0', main: './index.js' }),
    'index.js': 'module.exports.hi = () => "hi"',
  },
  'greeter',
  '1.0.0',
)

pkg.readFile('/node_modules/greeter/index.js') // 'module.exports.hi = () => "hi"'

const tgz = packPackage(pkg) // gzipped tarball bytes, entries under package/
```

The name and version are arguments to `createPackage`. It does not read them from `package.json`, which is kept exactly as you wrote it. Leave out the name and the package mounts under `/node_modules/test/`. The file map must include a `package.json`; without one, `createPackage` throws.

## Install

`@systemfsoftware` packages are not published to npm. They come from nix.systemfsoftware.com, the package registry for `@systemfsoftware` packages.

1. Add this repository as a flake input:

   ```nix
   inputs.npm-package.url = "github:systemfsoftware/npm-package";
   ```

2. Substitute from the cache:

   ```nix
   nixConfig = {
     extra-substituters = "https://nix.systemfsoftware.com";
     extra-trusted-public-keys = "nix-cache-1:wXA8I4DayNW9q6enUyQA/P/nT38pGSTLt374t3gsn7M=";
     fallback = true;
   };
   ```

3. Take the package tarball through the consumer route in [pnpm-release-management](https://github.com/systemfsoftware/pnpm-release-management). That repository provides `lib.mkProducerTarballs` and `lib.mkPnpmConsumerStore`.

4. Install the peer from npm. You bring `effect` yourself:

   ```bash
   pnpm add effect@^4
   ```

## API

The public exports are re-exported from [`src/index.ts`](packages/npm-package/src/index.ts).

| Export                                            | What it does                                                                                                                                                                                                |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createPackage(files, name?, version?)`           | Builds a `Package` from a map of paths to file bodies (strings or `Uint8Array`). Relative paths mount under `/node_modules/<name>/`. Without a name the package is `test`; without a version it is `1.0.0`. |
| `makePackage(files, name, version, resolvedUrl?)` | Like `createPackage`, with the name and version required and an optional `resolvedUrl` recorded on the package.                                                                                             |
| `packPackage(pkg)`                                | Packs a `Package` to gzipped ustar bytes. Entries sit under `package/`, sorted by name, with a zeroed mtime, so the same input gives the same bytes.                                                        |
| `packTree(files, name)`                           | Returns the same bytes as `packPackage(createPackage(files, name))` without building a `Package`.                                                                                                           |
| `createPackageFromTarballData(bytes)`             | Reads tarball bytes into a `Package`. The name and version come from the archive's own `package.json`.                                                                                                      |
| `toDirectoryJSON(files, name?)`                   | Keys the same tree as `/node_modules/<name>/…` for an in-memory filesystem such as memfs.                                                                                                                   |

A `Package` is a read-only view of its file map. `readFile(path)` throws when the path is missing. `tryReadFile` and `tryReadBytes` return `undefined` instead. `fileExists`, `directoryExists`, `listFiles(directory?)` and `withOverlay(other)` complete the set.

## What it does not do

It models one package's files. It has no dependency graph, no `node_modules` install, no type resolution and no registry access. Packing reads only the file map you pass in, so it never runs lifecycle scripts or spawns `npm pack`.

## Contributing

Development setup and workflow are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Support

Report bugs and ask questions in the [issue tracker](https://github.com/systemfsoftware/npm-package/issues).

## License

[Apache-2.0](packages/npm-package/LICENSE)
