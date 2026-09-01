# test-progress-tracker

## 2.0.8

### Patch Changes

- 8b9abd5: Rebuild with tsdown, and move the runtime `unpartial` dependency to `^1.0.7`.
  
  No API changes. `init`, `append`, `load`, `monitor` and the `TestResults` /
  `CoverageSummary` / `FSContext` types are all unchanged, and the package stays
  CommonJS at `cjs/index.js` with `typings` at `cjs/index.d.ts`, so
  `jest-progress-tracker`'s `^2.0.6` range keeps resolving and keeps working.
  
  What does change is the emitted JavaScript:
  
  - `tsdown` replaces the `tsc -p tsconfig.cjs.json` build. The per-module CommonJS
    shape is preserved (`unbundle`), as are the `.js`, `.d.ts` and `.js.map` paths.
  - The build target moves from ES2015 to ES2022, and `lib` from `es2015` to `es2023`.
    An explicit `lib` replaces the default set rather than adding to it, so the old
    value was silently withholding `Error.cause` and `AggregateError`.
  - Node builtins are imported through the `node:` protocol, which reaches the
    published `.d.ts` files. Consumers need `@types/node` 16 or newer to typecheck
    against them.
  - Four declaration files for internal-only modules (`compress`, `constants`,
    `minify`, `store`), plus the type-only `interface.js`, are no longer emitted:
    nothing reachable from the entry point referenced them. `cjs/index.js` and the
    declarations it re-exports are unaffected.

## 2.0.7

### Patch Changes

- 941f3ad: Stop shipping test files in the published tarball. `files` was `["cjs", "ts"]`, which
  included the five `ts/*.spec.ts` sources; it is now scoped with a negative glob
  covering every test suffix the jest config matches.
  
  Move the release pipeline to changesets publishing over GitHub OIDC (npm trusted
  publishing), so the package publishes with no repository secrets. Converts the
  toolchain from yarn to pnpm and points repository metadata at the `cyberuni` org.
