# Allergy Translate Feedback Handler

A Cloudflare Worker that processes email feedback for Allergy Translate, automatically generating responses using WorkflowAI.

## Technical Stack

- Cloudflare Workers - Serverless email processing
- WorkflowAI - Automated response generation
- Cloudflare Email - Email handling and routing

## Setup Instructions

### Prerequisites

- Node.js installed
- Cloudflare Wrangler CLI (`npm install -g wrangler`)
- A Cloudflare account with Workers enabled
- WorkflowAI API access

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Set up the following secrets using `wrangler`:

```bash
wrangler secret put WORKFLOW_API_KEY  # Your WorkflowAI API key
wrangler secret put REPLY_FROM        # Email address for replies (e.g., feedback@allergytranslate.app)
wrangler secret put BCC               # (Optional) BCC address for responses
```

## Configuration

The worker is configured via `wrangler.toml`:

```toml
name = "allergy-translate-feedback"
main = "src/worker.js"
workers_dev = true
compatibility_date = "2000-01-01"

[vars]
REPLY_FROM = "feedback@allergytranslate.app"
```

## Development Commands

- `npm run dev` - Run the worker locally for development
- `npm run start` - Alternative command for local development
- `npm run deploy` - Deploy the worker to Cloudflare

## Email Processing Flow

1. **Incoming Email Processing**
   - Worker receives incoming email via Cloudflare Email
   - Extracts sender, subject, and body content

2. **Response Generation**
   - Forwards email content to WorkflowAI
   - Receives generated response
   - Formats reply with proper email headers

3. **Reply Handling**
   - Sends response back to original sender
   - Includes BCC for tracking (if configured)
   - Maintains email thread via proper headers (Message-ID, In-Reply-To)

## Project Structure

```
.
├── src/
│   └── worker.js      # Main worker code for email processing
├── wrangler.toml      # Cloudflare Worker configuration
├── package.json       # Project dependencies and scripts
├── .gitignore        # Git ignore rules
└── .prettierrc       # Code formatting rules
```

## Development

The worker uses modern JavaScript and Cloudflare's email handling APIs. Key features:

- Email parsing and response formatting
- Integration with WorkflowAI for automated responses
- RFC-822 compliant email handling
- Proper email threading support

## License

Private - All rights reserved

