# test-progress-tracker

## 2.0.7

### Patch Changes

- 941f3ad: Stop shipping test files in the published tarball. `files` was `["cjs", "ts"]`, which
  included the five `ts/*.spec.ts` sources; it is now scoped with a negative glob
  covering every test suffix the jest config matches.
  
  Move the release pipeline to changesets publishing over GitHub OIDC (npm trusted
  publishing), so the package publishes with no repository secrets. Converts the
  toolchain from yarn to pnpm and points repository metadata at the `cyberuni` org.
