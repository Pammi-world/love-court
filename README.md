# Love Court

A couples dispute resolution webapp built with Next.js.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** localStorage
- **Deployment:** Vercel-ready

## Project Structure

```
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/    # React components
├── public/           # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

## Running

Development server:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## License

MIT