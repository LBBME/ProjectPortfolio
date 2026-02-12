# Dennis CFD Portfolio

CFD-only recruiter portfolio built with Next.js App Router, TypeScript, Tailwind, and MDX-driven project content.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Information architecture

- `/` Home: short hero, focus areas, featured projects
- `/projects` Project index: tag filters + search
- `/projects/[slug]` Project detail: results-at-a-glance, TOC, validation + reproducibility
- `/resume` Resume summary + download placeholder
- `/about` Short background and role focus

## Content model

Projects are MDX files in `content/projects/` with YAML frontmatter:

- `title`, `slug`, `summary`, `domain`
- `tools[]`, `tags[]`
- `featured`, `status`, `updatedAt`, `readingMinutes`
- `results[]` (label/value/note)
- `validation[]` (check/status/note)
- `reproducibility[]` (step/detail)

Add a new project by creating one `.mdx` file; no UI code changes are required.
