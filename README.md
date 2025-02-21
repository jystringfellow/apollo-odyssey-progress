# Apollo Odyssey Progress Tracker

A bookmarklet to track your progress through Apollo GraphQL's Odyssey courses.

## Features

- 📊 Track progress across customezed Apollo Odyssey curriculum
- 🔍 Filter courses by track (e.g., Everyone, Advanced, Android, Backend, Frontend, iOS)
- 🎯 See course status (Not Started, In Progress, Completed)
- 🔗 Direct links to course content

## Development

```bash
# Install dependencies
pnpm install

# Build bookmarklet
pnpm build

# Development mode (watch)
pnpm dev
```

## Usage

1. Build the project
2. Copy the contents of `dist/bookmarklet.txt`
3. Create a new bookmark in your browser
4. Paste the contents as the URL
5. Click the bookmark while on authenticated on apollographql.com to see your course progress

## Customization

To update which courses are included in your custom curriculum, edit the `src/courses.ts` file.

_Note_: You will have to make sure that the course IDs are correct and that the courses are part of the Apollo Odyssey curriculum.

## Tech Stack

- TypeScript
- esbuild
- Apollo GraphQL API

