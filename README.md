# npm-package

An npm package as an in-memory file tree: build one from an authored file map, pack it to tarball bytes and read it back, without touching the filesystem or spawning npm.

## Packages

- [`@systemfsoftware/npm-package`](packages/npm-package/README.md): An npm package as an in-memory file tree: build one from an authored file map, pack it to tarball bytes, and read one back — without touching the filesystem.

## Install

https://nix.systemfsoftware.com is the package registry for `@systemfsoftware` packages: a producer pushes its package tarballs there from `main`, a consumer substitutes them through its flake inputs, and nothing is published to npm.

## Usage

- [`@systemfsoftware/npm-package`](packages/npm-package/README.md)

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

[Apache-2.0](packages/npm-package/LICENSE)
