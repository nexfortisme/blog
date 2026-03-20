# dharrison.dev (personal site + blog)

This repository contains a Vue 3 single-page app (SPA) that serves as my personal site and blog.

## What the app does

- Home page (`/`) with a recent posts section and contact links.
- Posts index (`/posts`) loads posts and available tags from `index.json` and `tag_index.json`.
- Posts index (`/posts`) lets you filter posts by clicking tags (filter state is stored in the URL query params as `tags`).
- Post detail page (`/posts/:postId`) loads the post from `index.json` and fetches its markdown from the post's `githubPath`.
- Post detail page (`/posts/:postId`) strips the frontmatter block (between `----` delimiters) and renders the remaining markdown.
- About page (`/about-me`).
- Resume page (`/about-me/resume`) is rendered from in-code data by default (and shows a PDF link button).
- Resume page (`/about-me/resume`) includes tabbed sections (Experience, Skills, Education, Projects, Activities).
- Projects page (`/about-me/projects`) with a small curated project list.
- Theme toggle (dark/light) is controlled via a local `theme` value in `localStorage` and toggles `dark`/`light` classes on `document.documentElement`.

## Tech stack

- Frontend: Vue 3 + Vue Router + Vite
- Head/meta tags: `@unhead/vue`
- Icons: FontAwesome (`@fortawesome/vue-fontawesome`)
- Content rendering: a small custom markdown renderer (headings, links, lists, paragraphs)
- Content index generator: Go (`content/scripts/main.go`)

## Running locally

Prereqs:

- Bun (this repo uses `bun` scripts)

Commands:

```sh
bun install
bun dev
```

- App dev server: visit the URL Vite prints in your terminal.

Build/preview:

```sh
bun run build
bun run preview
```

Note on post content in local development:

- The posts UI fetches `index.json`, `tag_index.json`, and markdown from GitHub raw URLs (the `nexfortisme/content` repo). If you want to test with local post markdown, you will need to change those fetch URLs in the relevant views/components.

## Post content format (what the Go generator expects)

Posts live under a `posts/` directory in the separate content repo (the one this app fetches from).

Each markdown file uses a frontmatter block delimited by `----`:

```md
----
title: My Post Title
description: Short description shown in the UI
descriptionImage: https://example.com/image.png
tags: [tag1, tag2, tag3]
----

This is the markdown body.
```

Supported fields:

- `title:` -> post title
- `description:` -> short description on the index card
- `descriptionImage:` -> used for social card meta tags (`ogImage` / `twitter:image`)
- `tags:` -> a bracketed comma-separated list (whitespace is trimmed)

Frontmatter parsing is done line-by-line by `content/scripts/main.go`, and the UI removes the frontmatter by stripping the first `---- ... ----` block before rendering.

## How posts get indexed (Go + GitHub Actions)

`content/scripts/main.go` generates two JSON files:

- `index.json` (list of posts with stable numeric IDs)
- `tag_index.json` (unique tag list)

The GitHub workflow in `content/.github/workflows/run-main.yml` runs on pushes to regenerate those files:

```sh
CONTENT_ROOT=<path-to-content>/posts go run scripts/main.go
```

The generator writes `index.json` and `tag_index.json` into the directory you run it from (in the workflow, that is the content repo root).
If an `index.json` already exists, it will reuse IDs based on post paths to keep numeric IDs stable across regenerations.

The SPA expects these files to exist in the content repo (under the same paths it fetches from via GitHub raw URLs).

## Deployment

The repo includes a Cloudflare Pages-style Wrangler config (`wrangler.jsonc`) that points Pages at the Vite build output directory (`./dist`) and uses single-page-application history handling.

Typical deployment flow:

```sh
bun run build
wrangler pages deploy dist
```

If you need the exact Pages project/branch flags for your Cloudflare setup, consult your Wrangler configuration/environment for `wrangler pages deploy`.
