# SEO Optimization Instructions — tabe-rickson-portfolio

Verified against the live repo (`rickytabe/Tabe-Rickson-Portfolio`, `master`) as of this writing. Domain: **taberickson.com**. Execute in priority order — later items assume earlier ones are done.

**Before implementing anything below: verify it against the current state of the codebase yourself.** These priorities were written from a point-in-time read of the repo and may be stale, incomplete, or wrong by the time you're executing this — the code may have changed, an assumption here may not hold, or a proposed change may turn out not to be worth doing once you see the fuller context. Don't implement an item just because it's listed here. Check the relevant files first, confirm the problem actually exists as described, and use your own judgment on whether the change is worth making and how it should be implemented given the rest of the codebase. If something below turns out to be wrong or unnecessary, skip it and note why.

---

## Priority 0 — Give every project its own indexable page

Projects currently only exist inside `ProjectsGallery.tsx` on the homepage, sourced from `portfolio-data.json`. No project has a unique URL, which means none can be individually indexed by search engines or cited by AI systems.

- Add a `slug` field to every project entry in `portfolio-data.json`.
- Create a `/projects` index route listing all projects with links to each.
- Create a dynamic `/projects/[slug]` route rendering a full page per project, statically generated at build time from the JSON data.
- Each project page needs its own `<h1>`, its own `generateMetadata` (title + description pulled from that project's data), and its own Open Graph/Twitter image using that project's `image` field.
- Expand each project's content beyond the current one-line `description` — the page should cover the problem being solved, the specific technical decisions made, the stack, and the outcome. The existing description is a teaser, not page content; AI citation and search ranking both depend on there being real substance here, not a repeated summary.
- Update `ProjectsGallery.tsx` so each card links through to its `/projects/[slug]` page, in addition to the existing live/code links.

---

## Priority 1 — Metadata refinement in `layout.tsx`

The existing root metadata (`metadataBase`, Open Graph, Twitter, icons) is already correctly configured against `taberickson.com` — don't rebuild it, just refine:

- Update the site title so it reflects AI development as part of the core positioning, not just "Website & Mobile App Developer." Confirm this against the actual content of the site first — check whether the About/Services sections genuinely support an AI-forward title before changing it.
- Check whether `opengraph-image.png` and `twitter-image.png` (the Next.js convention files present in `app/`) are properly designed social cards or just the logo. `layout.tsx` currently manually overrides Open Graph/Twitter images with a logo file, which suppresses those convention files. Only remove the manual overrides if the convention files are actually a better designed card — check them first.
- Add `robots: { index: false, follow: false }` to the metadata export on the `thank-you` page — it's a conversion confirmation page and shouldn't be indexed or cited.

---

## Priority 2 — Structured data (JSON-LD)

Confirm none exists yet before adding it.

- Add a site-wide `Person` schema (JSON-LD) rendered once in `layout.tsx`, using name, job title, location, and `sameAs` links pulled from the existing `socials` object in `portfolio-data.json`.
- Add a `CreativeWork` or `SoftwareApplication` JSON-LD block on each `/projects/[slug]` page, referencing that project's name, description, live URL, and code URL, with the author linked back to the site-wide Person schema.

---

## Priority 3 — Sitemap and robots

Confirm `app/sitemap.ts` and `app/robots.ts` don't already exist before creating them.

- Add `app/sitemap.ts` generating entries for the homepage, the `/projects` index, and every individual `/projects/[slug]` route, driven dynamically from `portfolio-data.json` so new projects are picked up automatically without manual edits.
- Add `app/robots.ts` that allows all crawlers by default, explicitly disallows `/thank-you`, and explicitly allows the major AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended) rather than leaving them to a default rule that might block them.
- Reference the sitemap URL inside `robots.ts`.

---

## Priority 4 — Fix heading hierarchy in `About.tsx`

`Hero.tsx` correctly owns the page's single `<h1>`. `Services.tsx`, `Experience.tsx`, and `Contact.tsx` correctly follow with `<h2>` section headings. `About.tsx` currently breaks this pattern — verify what heading level its section title actually uses, and if it skips a level (e.g. jumping straight to `<h4>` with nothing at `<h2>`/`<h3>`), correct it so heading order is sequential. Adjust styling as needed so it still looks visually correct — the fix is the semantic tag level, not the visual design. Search engines and AI parsers both use heading hierarchy to understand page structure, so a skipped level is a real (if minor) issue worth correcting.