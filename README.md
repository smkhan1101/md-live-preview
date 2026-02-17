# Markdown Live Preview

A minimal, embeddable Markdown editor with live preview. Built with Next.js 15, TypeScript, and Tailwind CSS. MIT licensed and open source.

## Live Demo

**[Try it live →](https://your-live-url.vercel.app)** *(Replace with your deployed URL after publishing.)*

## Features

- **Live preview** — Renders Markdown (GFM: tables, strikethrough, task lists) as you type
- **CodeMirror editor** — Line numbers, Markdown syntax highlighting, GitHub light/dark themes
- **Resizable split** — Drag the divider to resize editor and preview panes
- **Sync scroll** — Optional scroll sync between editor and preview
- **Dark / light theme** — Toggle with persistence in `localStorage`
- **Copy output** — Copy rendered output as HTML + plain text (paste with formatting in Word/Docs)
- **Copy Markdown** — Copy raw Markdown from the editor pane
- **Export PDF** — One-click PDF download via html2pdf (fallback: browser print)
- **Word, character & line count** — Live stats in the navbar
- **Expandable navbar** — Collapse the header for more editor/preview space (state persisted)
- **Mobile** — Editor/Preview tabs on small screens
- **Persist content** — Content and settings stored in `localStorage`
- **Toasts** — Feedback for reset, copy, and PDF export (sonner)
- **Embeddable** — Single full-height view; use in an iframe on your blog or tools page

## Setup

```bash
git clone https://github.com/your-username/md-live-preview.git
cd md-live-preview
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm run start`| Start production server  |
| `npm run lint` | Run ESLint               |

## Embedding

To embed in another site (e.g. a blog “Tools” page):

```html
<iframe
  src="https://your-live-url.vercel.app"
  title="Markdown Live Preview"
  style="width:100%;height:80vh;border:1px solid #eee;border-radius:8px;"
></iframe>
```

Replace the `src` with your deployed app URL.


## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS
- CodeMirror 6 (@uiw/react-codemirror, @codemirror/lang-markdown)
- react-markdown, remark-gfm, rehype-raw, rehype-sanitize
- html2pdf.js, sonner, lucide-react

## License

MIT
