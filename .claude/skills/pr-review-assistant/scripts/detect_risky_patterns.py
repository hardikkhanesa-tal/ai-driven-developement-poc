#!/usr/bin/env python3
"""
Scan a code diff for risky patterns.
Usage: python3 detect_risky_patterns.py <diff_file>
       cat file.diff | python3 detect_risky_patterns.py -
"""

import re
import sys
from dataclasses import dataclass
from typing import List


@dataclass
class Finding:
    severity: str  # CRITICAL | WARNING | INFO
    pattern: str
    file: str
    line_num: int
    line_content: str
    reason: str


PATTERNS = [
    # CRITICAL
    (
        "CRITICAL",
        "eval(",
        r"\beval\s*\(",
        "Arbitrary code execution — user-controlled input to eval() enables RCE.",
    ),
    (
        "CRITICAL",
        "exec(",
        r"\bexec\s*\(",
        "Arbitrary code execution — exec() with untrusted input is an RCE vector.",
    ),
    (
        "CRITICAL",
        "hardcoded_password",
        r'(?i)(password|passwd|pwd|secret|api_key|apikey|token)\s*=\s*["\'][^"\']{4,}["\']',
        "Hardcoded credential — secrets in source code leak via version control and logs.",
    ),
    (
        "CRITICAL",
        "hardcoded_private_key",
        r"-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----",
        "Private key embedded in source — immediate credential exposure risk.",
    ),
    (
        "CRITICAL",
        "raw_sql_format",
        r'(execute|cursor\.execute)\s*\(\s*[f"\'](SELECT|INSERT|UPDATE|DELETE|DROP)',
        "Raw SQL with string formatting — SQL injection risk if any part is user-supplied.",
    ),
    (
        "CRITICAL",
        "raw_sql_percent",
        r'(execute|cursor\.execute)\s*\(\s*["\'].*%[s|d]',
        "SQL query with %-interpolation — SQL injection risk.",
    ),
    (
        "CRITICAL",
        "pickle_loads",
        r"\bpickle\.loads?\s*\(",
        "Deserialization of untrusted data with pickle enables arbitrary code execution.",
    ),
    (
        "CRITICAL",
        "yaml_load_unsafe",
        r"\byaml\.load\s*\([^)]*\)",
        "yaml.load() without Loader=yaml.SafeLoader can execute arbitrary Python.",
    ),
    (
        "CRITICAL",
        "subprocess_shell_true",
        r"subprocess\.(run|Popen|call|check_output)\s*\([^)]*shell\s*=\s*True",
        "subprocess with shell=True and user input enables shell injection.",
    ),
    # WARNING
    (
        "WARNING",
        "blocking_sleep",
        r"\btime\.sleep\s*\(",
        "Blocking sleep in production code — stalls event loop or thread pool under load.",
    ),
    (
        "WARNING",
        "bare_except",
        r"except\s*:",
        "Bare except swallows all exceptions including KeyboardInterrupt and SystemExit.",
    ),
    (
        "WARNING",
        "silent_except_pass",
        r"except.*:\s*\n\s*pass",
        "Exception silently swallowed — errors hidden, debugging becomes very hard.",
    ),
    (
        "WARNING",
        "os_system",
        r"\bos\.system\s*\(",
        "os.system() with any dynamic content is a shell injection vector.",
    ),
    (
        "WARNING",
        "print_debug",
        r"\bprint\s*\(.*(?:password|token|secret|key|auth)",
        "Sensitive value printed to stdout — may appear in logs or container output.",
    ),
    (
        "WARNING",
        "open_redirect",
        r'redirect\s*\([^)]*request\.(args|form|params|GET|POST)',
        "Open redirect — user-supplied URL in redirect enables phishing.",
    ),
    (
        "WARNING",
        "path_traversal",
        r'open\s*\(\s*(os\.path\.join\s*\(|f["\'])',
        "File open with dynamic path — check for path traversal if input is user-controlled.",
    ),
    # INFO
    (
        "INFO",
        "todo_fixme",
        r"\b(TODO|FIXME|HACK|XXX)\b",
        "Unresolved TODO/FIXME — may indicate incomplete or known-broken logic being merged.",
    ),
    (
        "INFO",
        "hardcoded_localhost",
        r'["\']https?://(localhost|127\.0\.0\.1)',
        "Hardcoded localhost URL — will fail in non-local environments.",
    ),
    (
        "INFO",
        "commented_out_code",
        r"^[+\s]*#\s*(def |class |import |from |if |for |while |return )",
        "Commented-out code — adds noise and may confuse future readers.",
    ),
    (
        "INFO",
        "magic_number",
        r"(?<!['\"\w])\b(?!0\b|1\b)\d{3,}\b(?!['\"\w])",
        "Magic number — unnamed numeric constant, intent unclear without context.",
    ),
]


def parse_diff(content: str):
    """Yield (filename, line_number, line_content) for added lines only."""
    current_file = "<unknown>"
    current_line = 0

    for raw_line in content.splitlines():
        # Track current file from diff header
        if raw_line.startswith("+++ "):
            path = raw_line[4:].strip()
            if path.startswith("b/"):
                path = path[2:]
            current_file = path
            current_line = 0
            continue

        # Track line numbers from hunk headers: @@ -a,b +c,d @@
        hunk_match = re.match(r"^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@", raw_line)
        if hunk_match:
            current_line = int(hunk_match.group(1)) - 1
            continue

        if raw_line.startswith("+") and not raw_line.startswith("+++"):
            current_line += 1
            yield current_file, current_line, raw_line[1:]
        elif not raw_line.startswith("-"):
            current_line += 1


def scan(diff_content: str) -> List[Finding]:
    findings = []
    compiled = [(sev, name, re.compile(pat), reason) for sev, name, pat, reason in PATTERNS]

    for filename, lineno, line in parse_diff(diff_content):
        for severity, name, regex, reason in compiled:
            if regex.search(line):
                findings.append(
                    Finding(
                        severity=severity,
                        pattern=name,
                        file=filename,
                        line_num=lineno,
                        line_content=line.strip(),
                        reason=reason,
                    )
                )

    return findings


def print_findings(findings: List[Finding]) -> None:
    if not findings:
        print("No risky patterns detected.")
        return

    order = {"CRITICAL": 0, "WARNING": 1, "INFO": 2}
    findings.sort(key=lambda f: (order.get(f.severity, 9), f.file, f.line_num))

    current_severity = None
    for f in findings:
        if f.severity != current_severity:
            current_severity = f.severity
            print(f"\n[{f.severity}]")
        print(f"  {f.file}:{f.line_num}  pattern={f.pattern}")
        print(f"    Code: {f.line_content[:120]}")
        print(f"    Why:  {f.reason}")

    counts = {}
    for f in findings:
        counts[f.severity] = counts.get(f.severity, 0) + 1
    print("\n--- Summary ---")
    for sev in ["CRITICAL", "WARNING", "INFO"]:
        if sev in counts:
            print(f"  {sev}: {counts[sev]}")
    print(f"  TOTAL: {len(findings)}")


def main():
    if len(sys.argv) < 2 or sys.argv[1] == "-":
        content = sys.stdin.read()
    else:
        with open(sys.argv[1], "r", encoding="utf-8", errors="replace") as f:
            content = f.read()

    findings = scan(content)
    print_findings(findings)
    # Exit 1 if any CRITICAL found — useful for CI gating
    sys.exit(1 if any(f.severity == "CRITICAL" for f in findings) else 0)


if __name__ == "__main__":
    main()
