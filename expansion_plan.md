# taberickson.com — Tech Hub Feature Overview

Summary of everything discussed for evolving the portfolio into a tech hub: blog, events, email subscriptions, and reviews. Written as a reference for planning and for handing to a coding agent later — not a build spec yet.

---

## The shape of the whole system

Four features, three different data needs — don't reach for one database to do all of it:

| Feature | Data shape | Where it lives | Why |
|---|---|---|---|
| Blog | Author-written content | Sanity | Rich text editor, images, multi-author — all built in, nothing to build |
| Events | Author-written content | Sanity | No RSVP means no user data to store — an event is just content, same as a blog post |
| Email subs | Third-party managed list | Buttondown / Mailchimp | Sending capability included, not just storage |
| Reviews | Visitor-submitted data | Firestore | The only feature where a stranger writes data into your system |

**Worth noting explicitly:** this is a simplification from earlier in the conversation. Once events dropped RSVP, they stopped needing a database — Firestore's job shrinks down to just reviews. Two hosted services (Sanity + an ESP) plus one lightweight database (Firestore) covers everything, and none of it requires you to run or maintain a backend server.

---

## 1. Blog

**Purpose:** the actual growth engine — FAQ-style posts answering common tech questions, positioned to drive search and AI-citation traffic, not just showcase work.

**How it works:**
- Content authored in Sanity Studio using Portable Text (Sanity's built-in rich text editor) — headings, images, code blocks, links, no custom editor built by you.
- Rendered on the frontend at `/blog/[slug]`, same static-generation pattern as your existing `/projects/[slug]` pages.
- Multi-author ready from day one — inviting a second writer is a Sanity project setting, not a feature you build. (Free tier caps at 2 non-admin editors — a real limit if you bring on more than one co-writer, but not a concern to solve now.)
- SEO treatment matches what's already planned for projects: `generateMetadata` per post, JSON-LD `BlogPosting` schema, entries added to `sitemap.ts`.

**Content direction:** lead with real, specific questions ("How do I fix hydration errors in Next.js," "What's the difference between Supabase and Firebase for a side project") rather than generic explainer posts — this is what actually earns both search ranking and AI citation, per everything already covered on EEAT and content depth.

---

## 2. Events

**Purpose:** promote physical and online events you're hosting or speaking at, with the lowest possible friction to join.

**How it works:**
- Each event is a content entry in Sanity (same Studio you're already using for the blog) — title, description, date/time, physical or online flag, location or platform, cover image, and a WhatsApp group invite link.
- No RSVP, no attendee tracking, no auth — a visitor clicks "Join WhatsApp Group" and leaves your site. Nothing to store about them.
- Rendered as an `/events` index and possibly `/events/[slug]` pages if individual events warrant their own SEO-indexable page (worth doing if you're speaking at named community events like GDGOC sessions — same logic as project pages: a named, specific event page can rank for its own name).

**Why this stays simple on purpose:** the moment you add RSVP or attendee lists, this becomes a real backend feature (data storage, capacity limits, confirmation emails). Deliberately not doing that now keeps this a content feature, not an engineering project.

---

## 3. Email subscriptions

**Purpose:** notify subscribers when you publish a new blog post or ship a new project.

**How it works:**
- Signup form embedded on the site, but the list itself lives in a dedicated email service (Buttondown or Mailchimp), not a custom database — because storing an email address only gets you a list, not the ability to send anything to it.
- **Simplest version (recommended to start):** publish a post or project in Sanity, then manually trigger a campaign send in Buttondown/Mailchimp referencing that new content. A few minutes of manual work per post, zero automation to build or maintain.
- **Later, optional automation:** Sanity supports webhooks on publish, which could trigger an API call to your ESP to send automatically. Worth doing once publishing frequency justifies it — not worth building on day one for occasional posts.

---

## 4. Reviews

**Purpose:** visitor-submitted testimonials/reviews displayed on the site — the one feature actually requiring your own database, since it's the only place a stranger writes data into your system.

**How it works:**
- Firestore `reviews` collection — a visitor submits a form (name, review text, maybe a rating), it writes directly to Firestore from the client, no server code to deploy.
- Security rules control what an anonymous visitor is allowed to write (e.g., can create a review, cannot edit or delete others'), and whether new reviews need your manual approval before appearing publicly (recommended, to avoid spam/abuse showing up immediately).
- Never hibernates — this was the original problem with the Supabase setup on the old portfolio, and Firestore's always-on model directly fixes it.

---

## What this deliberately leaves out for now

- RSVP/attendee tracking for events
- Automated email sending on publish (manual send is fine to start)
- Comment sections on blog posts (a bigger moderation surface than reviews — not discussed, don't build without deciding on it separately)
- Review moderation dashboard (start with manual approval via the Firestore console directly; a proper admin UI is a later project if review volume grows)