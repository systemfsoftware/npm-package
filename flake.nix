{
  description = "An npm package as an in-memory file tree: build one from an authored file map, pack it to tarball bytes, and read one back — without touching the filesystem.";

  nixConfig = {
    extra-substituters = "https://nix.systemfsoftware.com";
    extra-trusted-public-keys = "nix-cache-1:wXA8I4DayNW9q6enUyQA/P/nT38pGSTLt374t3gsn7M=";
  };

  inputs = {
    # Core at a full commit, for its dprint build and its nixpkgs.
    core.url = "github:systemfsoftware/systemfsoftware/3ef6c21c36f19a539078b6817b495df3039cc163";
    nixpkgs.follows = "core/nixpkgs";
    pnpm-release-management.url = "github:systemfsoftware/pnpm-release-management";
  };

  outputs = { self, nixpkgs, core, pnpm-release-management }:
    let
      lib = nixpkgs.lib;
      systems = [ "x86_64-linux" "aarch64-linux" ];
      forEachSystem = fn: lib.genAttrs systems (system: fn nixpkgs.legacyPackages.${system});

      # This repository's own public packages, as tarballs downstream flakes consume the same way.
      workspaceOf = pkgs:
        pnpm-release-management.lib.mkPnpmWorkspacePackages {
          inherit pkgs;
          src = self;
          pname = "npm-package";
          pnpm = pkgs.pnpm_12;
        };
    in
    {
      packages = forEachSystem (pkgs:
        let system = pkgs.stdenv.hostPlatform.system; in
        workspaceOf pkgs // {
          inherit (core.packages.${system}) dprint;
        });

      devShells = forEachSystem (pkgs: {
        default = pkgs.mkShell {
          packages = [
            core.packages.${pkgs.stdenv.hostPlatform.system}.dprint
            pkgs.nodejs_24
            pkgs.pnpm_12
          ];
        };
      });
    };
}
