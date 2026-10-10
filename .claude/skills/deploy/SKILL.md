---
name: deploy
description: Deploy the current commit to staging - run the tests, build the production bundle, then push to the `staging` branch on origin. Use when the user runs /deploy or asks to deploy or ship to staging.
disable-model-invocation: true
---

# Deploy to staging

Deploying means: the checks pass, the production bundle builds, and the current
commit lands on `origin/staging`. Run the steps in order and **stop at the first
failure** - report what failed with the relevant output, and don't push. A broken
commit on staging is worse than no deploy.

## 1. Preflight

Run `git status --porcelain`. The push in step 4 sends the current commit (`HEAD`),
not the working tree, so uncommitted changes would silently be left out of the
deploy. If the tree is dirty, stop and list the changed files; ask the user whether
to commit them first or deploy `HEAD` as it is.

Note the branch and short SHA being deployed (`git rev-parse --abbrev-ref HEAD`,
`git rev-parse --short HEAD`) for the final report.

## 2. Run all tests

Check `package.json` for a `test` script.

- If there is one, run `npm test`. All tests must pass.
- If there isn't (this project currently ships without a test runner), say so
  plainly in the report - don't present it as "tests passed". Run `npm run lint`
  as the available check instead; it must exit cleanly.

## 3. Build the production bundle

Run `npm run build`. It must succeed. A chunk-size warning from Vite is not a
failure, but mention it in the report.

`dist/` is gitignored, so the bundle is not committed or pushed - this step proves
the commit produces a working production build before it goes to staging. Don't
force-add `dist/`.

## 4. Push to staging

```bash
git fetch origin
git push origin HEAD:staging
```

This creates `staging` on the first deploy and fast-forwards it after that.

If the push is rejected as non-fast-forward, `origin/staging` has commits that
aren't in `HEAD` (someone else deployed, or staging was edited directly). Stop and
show what's there (`git log --oneline HEAD..origin/staging`). **Never force-push** -
that would erase those commits from staging; let the user decide how to reconcile.

## 5. Report

Keep it short:

- Deployed: `<branch>` @ `<short sha>` -> `origin/staging`
- Tests: passed / no test suite (lint passed instead)
- Build: succeeded (plus any warnings)
- Link to the staging branch, built from the `origin` remote URL
  (e.g. `https://github.com/<owner>/<repo>/tree/staging`)

If any step failed, say which step, show the error, and state that nothing was pushed.
