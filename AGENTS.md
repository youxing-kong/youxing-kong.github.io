This repository is the academic website of Youxing Kong.

Primary goal: Present a rigorous, minimal and internationally professional research identity.

Audience: Academic researchers, potential collaborators, postdoctoral supervisors and hiring committees.

## Content rules
- Never invent personal, academic, institutional, publication or research facts.
- Treat supplied content and CV as the source of truth.
- Never convert planned work into completed results.
- Clearly distinguish Published / Preprint / Ongoing / Research Direction.
- Never invent DOI, journal status, numerical results or collaborators.
- Missing links should display "Coming soon" or remain hidden.
- Do not rewrite scientific claims unless explicitly requested.
- Publication titles and authors come from the supplied Word CV, including its embedded hyperlinks. Do not enrich them from the web.
- Keep STAC-GNSS as the requested project identity; identify TRCQ-GNSS separately as the framework described in the 2026-08-26 progress report.

## Design rules
- Academic, minimal and research-first.
- Avoid startup aesthetics.
- Avoid excessive animation, gradients and decorative UI.
- Prioritize typography, spacing and scientific figures.
- Maintain excellent mobile responsiveness.
- Use supplied authentic imagery. Never generate scientific figures.

## Technical rules
- Separate content from presentation.
- Prefer static and maintainable implementations: Astro, TypeScript, native CSS.
- Avoid unnecessary dependencies, client frameworks, and local font files.
- Run build checks after every structural change.
- No broken links; run npm run check after building.
- Maintain accessibility and semantic HTML.
- All navigation and assets must respect BASE_PATH, including language switching.
- Keep English at / and Chinese at /zh/. Every project must have both languages.
- Do not publish materials/, tmp/, credentials, raw research reports, or source-extraction intermediates.
