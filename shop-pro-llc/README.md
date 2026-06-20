# Shop Pro LLC — website

Full source for the Shop Pro LLC site: a 3-page marketing/trust site (Home,
About, Contact) backed by a small Node.js + Express server that captures
contact-form inquiries.

## What's inside
- `public/` — the front end (HTML, CSS, vanilla JS, favicon). No build step.
- `server.js` — Express server. Serves the front end and the `/api/contact` endpoint.
- `store.js` — a tiny, dependency-free JSON file store for inquiries.
  No database server to install or configure — it's just a folder and a file.
- `data/` — created automatically the first time the server runs. Holds
  `inquiries.json`. Not included in this package, so you're starting clean.

## Why a JSON file instead of a "real" database
For the volume a contact form gets, a JSON file is genuinely enough, and it
has one big advantage: zero native dependencies. SQLite-style packages
need to be compiled for whatever machine they run on, which can quietly
break when you move from your laptop to a host. This avoids that
entirely — it's just plain Node, so it runs the same everywhere. If
inquiries ever pick up enough volume to need real concurrency or
querying, swapping in Postgres later is a contained change (just `store.js`
and the two functions it exports).

## Running it locally
1. Install Node.js 18+ if you don't already have it.
2. In this folder: `npm install`
3. Then: `npm start`
4. Open http://localhost:3000

You can also just open `public/index.html` directly in a browser to preview
the design without running anything — the contact form just won't submit
anywhere until the server is running.

## Viewing submitted inquiries
Every submission is saved to `data/inquiries.json` — you can open that file
directly, or visit:

`http://localhost:3000/api/submissions?key=YOUR_ADMIN_KEY`

Set `ADMIN_KEY` as an environment variable before deploying. The default is
`changeme` — **change this before the site is live**, or anyone can read
your inquiries.

## Deploying it for real
This needs a host that keeps a Node process running continuously with a
persistent disk — not a pure serverless platform (plain Vercel functions,
for example), since those reset their filesystem between requests and your
saved inquiries would disappear.

Straightforward options: Render.com or Railway.app (both have a free or
low-cost tier for a small Node web service with persistent disk), or a small
VPS (DigitalOcean, Hetzner). General steps on any of them:

1. Push this folder to a GitHub repo.
2. Connect the repo to the host.
3. Set the start command to `npm start`.
4. Set the `ADMIN_KEY` environment variable to something private.
5. Point your domain (shopprollc.com) at the host using their custom domain
   instructions.

Happy to walk through any of these step by step once a host is picked.

## Things to finish
- Add your LLC's state of formation — it's currently a placeholder in
  `public/about.html` and `public/contact.html` (search for `[Add state]`).
- A logo image isn't required — the current mark is built with CSS/SVG, no
  image file needed. If you make a graphic logo later (Canva or otherwise),
  drop it in `public/assets/` and swap the two `.brand-mark` elements in
  each HTML file for an `<img>` tag.
- Consider email notifications when a new inquiry comes in — needs an email
  service (e.g. Resend, SendGrid) and an API key, easy to add once you pick one.
- Consider a CAPTCHA (e.g. Cloudflare Turnstile) if spam becomes a problem —
  the form already has a basic honeypot field, which stops simple bots but
  not more sophisticated ones.
