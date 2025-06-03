# planit

Planit is an AI-driven agentic scheduler that drafts, critiques, and perfects your daily plans.

## Prerequisites

- **Node.js** 18+
- **Python** 3.11+

## Setup

1. Install client dependencies:

   ```bash
   cd client && npm install
   ```

2. Install server dependencies:

   ```bash
   cd ../server && pip install -r requirements.txt
   ```

3. Copy the example environment file and adjust if needed:

   ```bash
   cp ../client/.env.local.example ../client/.env.local
   ```

   `NEXT_PUBLIC_API_URL` controls the base URL for API requests.

## Development

Start the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```

Then in another terminal start the Next.js app:

```bash
cd client && npm run dev
```

Run lints with:

```bash
cd client && npm run lint
```
