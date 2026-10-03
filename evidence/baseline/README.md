# Baseline Evidence Directory

This directory stores the immutable baseline snapshot of the legacy AngularJS source.

## Contents (populated during migration)
- Source file copies with preserved timestamps
- `baseline.sha256` — SHA-256 hashes of all baseline files
- `baseline.json` — Machine-readable baseline metadata
- `environment.json` — Node/npm versions and runtime details
- `command-results.json` — Results of baseline command execution
- Individual command logs (`syntax-check.txt`, `legacy-test.txt`, `legacy-start.txt`, etc.)
- `final-check.json` — Post-migration integrity verification

## Rules
- **Never modify files in this directory** after the baseline is established
- All source line references in migration docs point to this snapshot
- The baseline manifest hash is recorded in `STATE.md`
