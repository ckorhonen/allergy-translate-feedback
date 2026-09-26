# Agent Instructions

## Project Facts

This is a Cloudflare Worker that processes Allergy Translate email feedback and generates replies through WorkflowAI. Runtime configuration lives in `wrangler.toml`; the Worker entry point is `src/worker.js`.

## Commands

- Node.js and npm with the committed `package-lock.json` are required; use `npm ci`.
- `npm run dev`: run `wrangler dev`.
- `npm run start`: alternate local Wrangler dev command.
- `npm run deploy`: deploy with Wrangler.
- There is no configured lint or test command. `node --check src/worker.js` is the local syntax check; for an email-flow change, add or run a Worker-compatible test that mocks `EmailMessage` and `message.reply()` rather than sending an email.

## Repository Map

- `src/worker.js`: email-processing Worker.
- `wrangler.toml`: Worker name, entry point, compatibility date, and default vars.
- `package.json`: npm scripts.

## Agent Workflow

- Do not commit API keys or email credentials. Use `wrangler secret put` for `WORKFLOW_API_KEY`, `REPLY_FROM`, and optional `BCC`.
- `src/worker.js` sends the inbound email body to WorkflowAI with a POST request, then calls `message.reply()`; a live email event can therefore contact a provider and send email. Treat live email and remote Worker validation as an operational boundary, and use local/source checks by default for instruction-only work.
- Keep Cloudflare Email behavior and WorkflowAI request/response handling easy to audit. Complete authorized changes through the syntax check and relevant mocked flow coverage, repair failures caused by the change, and report baseline blockers and actual checks.
