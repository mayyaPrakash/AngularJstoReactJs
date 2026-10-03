# Legacy Source Directory

Place your AngularJS source files here for migration. The agent expects to find the following files at minimum:

## Required Files
- `app.js` — Main application (controllers, services, route config)
- `renew.html` — Renewal form template
- `package.json` — Project manifest with AngularJS dependencies
- `karma.conf.js` — Test runner configuration (if available)

## Optional / Host Files
- `index.html` — Application bootstrap / entry point
- Global CSS stylesheets
- Additional controllers, services, directives
- Test files (`*.spec.js`)
- Environment configuration

## Instructions
1. Copy your complete AngularJS application source into this directory
2. The agent will create a snapshot in `evidence/baseline/` before making any changes
3. The original source here remains the reference for behavior comparison
