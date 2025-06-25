# Specification Template

> Ingest the information from this file, implement the Low-Level Tasks, and generate the code that will satisfy the High and Mid-Level Objectives.

## High-Level Objective

Configure ESLint to enforce code practices.

## Mid-Level Objective

- [ ] lint before building
- [ ] use next js recommended config

## Implementation Notes

- [ ] Install ESLint + any other necessary dependencies
- [ ] use flat config
- [ ] create a `scripts/build.sh` script that lints first then builds

## Context

### Beginning context

- `package.json`
- `next.config.ts`

### Ending context

- `package.json`
- `next.config.ts`
- `scripts/build.sh`

## Low-Level Tasks
> Ordered from start to finish

1. Use context7 to research how to integrate ESLint flat config with Next.js
2. Create a `eslint.config.js` file that uses the flat config with next.js recommended config
3. Create a `lint` script in `package.json`
4. Create a `scripts/build.sh` script that lints first then builds
5. Update the `build` script in `package.json` to use the `scripts/build.sh` script