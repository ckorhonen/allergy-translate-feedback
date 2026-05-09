# Agent Instructions

## Project Facts

This is a Cloudflare Worker that processes Allergy Translate email feedback and generates replies through WorkflowAI. Runtime configuration lives in `wrangler.toml`; the Worker entry point is `src/worker.js`.

## Commands

- `npm install`: install dependencies.
- `npm run dev`: run `wrangler dev`.
- `npm run start`: alternate local Wrangler dev command.
- `npm run deploy`: deploy with Wrangler.

## Repository Map

- `src/worker.js`: email-processing Worker.
- `wrangler.toml`: Worker name, entry point, compatibility date, and default vars.
- `package.json`: npm scripts.

## Agent Workflow

- Do not commit API keys or email credentials. Use `wrangler secret put` for `WORKFLOW_API_KEY`, `REPLY_FROM`, and optional `BCC`.
- Keep Cloudflare Email behavior and WorkflowAI request/response handling easy to audit.
- Validate syntax and behavior with Wrangler commands before deployment-oriented changes.
