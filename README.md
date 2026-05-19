# Love Court 🏛️

The ultimate couples dispute resolution app. When you can't agree, let Love Court decide.

Two partners each submit their side of the dispute, and Love Court renders a verdict. Simple, fair, final.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** localStorage
- **Deployment:** Vercel-ready

## Features

- **Landing Page** — Enter your names and start a case
- **Submit Side A** — Partner A submits their argument
- **Submit Side B** — Partner B submits their counter-argument  
- **Verdict** — Love Court renders a final ruling
- **Case History** — View all past cases and verdicts

## Project Structure

```
love-court/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Landing page
│   │   ├── submit-a/     # Partner A submission
│   │   ├── submit-b/     # Partner B submission
│   │   ├── verdict/      # Verdict display
│   │   ├── history/     # Case history
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── components/       # Shared React components
├── public/               # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Setup

```bash
cd love-court
npm install
```

## Running

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start settling disputes.

## How It Works

1. Enter both partners' names on the landing page
2. Partner A submits their argument (why they're right)
3. Partner B submits their argument (why they're right)
4. Love Court reviews both sides and delivers a verdict
5. Both partners see the ruling — no more arguing

All cases are stored locally in your browser so you can reference them later.

## License

MIT