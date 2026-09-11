# Youxing Kong · Academic Research Portfolio

Public website: https://shiningnick.github.io/
Chinese: https://shiningnick.github.io/zh/

This repository contains the maintained Astro source on `main` and the published static website on `gh-pages`.

## Update content

Edit the bilingual JSON files under `src/content/`. Publications share the original bibliography. CV PDFs are in `public/cv/`; regenerate them with `scripts/build_cv_pdfs.py` after updating the corresponding CV JSON.

## Build and publish

Use Node.js 22.12 or later. Run `npm ci`, `npm run build`, then `npm run check`. Publish the contents of `dist/` to the `gh-pages` branch with an empty `.nojekyll` file. GitHub Settings → Pages must use Deploy from a branch → gh-pages → / (root).

A source-only commit on `main` does not publish automatically. Publish the rebuilt static files after each content update.

Raw research reports, source-extraction intermediates, local credentials and private working materials are excluded from this repository.
