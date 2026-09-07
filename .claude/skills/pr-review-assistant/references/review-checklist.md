# PR Review Checklist

Use this checklist systematically during Step 3 of the review workflow.
Check each item against the diff. Only flag items with direct evidence.

---

## Security

- [ ] **Injection vectors** — Does any input from a request, env var, or external source flow into `eval()`, `exec()`, `subprocess`, shell commands, or SQL queries without sanitization?
- [ ] **Hardcoded secrets** — Are passwords, API keys, tokens, or private keys written directly in source code or config files?
- [ ] **Insecure deserialization** — Does the code deserialize untrusted data with `pickle`, `yaml.load()` (non-safe), or `marshal`?
- [ ] **Auth bypass** — Are authentication or authorization checks removed, weakened, or skipped under certain conditions?
- [ ] **Sensitive data exposure** — Is PII, credentials, or internal stack traces logged or returned in API responses?
- [ ] **Path traversal** — Does user input influence file paths without normalization (e.g., `open(user_input)`, `os.path.join` with unvalidated parts)?
- [ ] **SSRF / open redirect** — Does user input control outbound HTTP request targets?
- [ ] **Dependency changes** — Are new third-party packages added? Check for known-malicious or unmaintained packages.

---

## Performance

- [ ] **N+1 queries** — Are database queries inside loops where a single bulk query would work?
- [ ] **Blocking I/O in async context** — Does synchronous `sleep()`, blocking network calls, or blocking file I/O appear in async handlers?
- [ ] **Unbounded loops or recursion** — Are there loops or recursive calls with no clear upper bound on iterations?
- [ ] **Missing indexes** — Does new query logic filter or join on columns likely to lack database indexes?
- [ ] **Large in-memory loads** — Does the code load entire tables or large files into memory at once?
- [ ] **Missing caching** — Is expensive computation or repeated I/O being done per-request without caching?
- [ ] **Synchronous calls in critical path** — Are slow external calls (HTTP, DB) made synchronously in a request handler without timeouts?

---

## Maintainability

- [ ] **TODO/FIXME comments** — Are unresolved TODO or FIXME comments being merged that indicate known incomplete or broken logic?
- [ ] **Dead code** — Is commented-out code or unreachable branches being added?
- [ ] **Magic numbers/strings** — Are raw literals used where named constants would make intent clear?
- [ ] **Long functions** — Are new functions added that are excessively long and do multiple unrelated things?
- [ ] **Missing error handling** — Are errors silently swallowed (`except: pass`, unchecked return values)?
- [ ] **Tight coupling** — Does new code introduce hard dependencies on internal implementation details of other modules?
- [ ] **Test coverage** — Are critical new code paths covered by tests? Are tests meaningful (not just asserting trivially true things)?
- [ ] **Config hardcoding** — Are values that should come from config or env vars hardcoded instead?
