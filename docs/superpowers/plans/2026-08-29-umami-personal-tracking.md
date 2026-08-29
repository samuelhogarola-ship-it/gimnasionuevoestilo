# Gimnasio Nuevo Estilo Umami Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Measure every Gimnasio Nuevo Estilo page in the personal Umami instance without cookies.

**Architecture:** The shared `assets/js/site.js`, already present in all 31 HTML entries, injects one local bootstrap. The bootstrap fetches a same-origin JSON configuration and only loads the personal Umami script when the website ID is valid.

**Tech Stack:** Static HTML, modern browser JavaScript, JSON, Node.js built-in test runner.

**Spec:** https://github.com/samuelhogarola-ship-it/webfuengirola/blob/main/docs/superpowers/specs/2026-08-29-umami-all-panels-design.md

## Global Constraints

- Use only `https://analytics.187.124.55.36.sslip.io`.
- Tracking is anonymous and cookieless and does not wait for consent.
- Missing, malformed, or wrong-host configuration fails closed.
- All 31 HTML entries remain covered through `/assets/js/site.js`.
- Preserve the existing cookie-banner behavior and local work on `main`.

---

### Task 1: Shared personal Umami bootstrap

**Files:**

- Create: `assets/js/umami-analytics.js`
- Create: `umami-config.json`
- Create: `tests/umami-analytics.test.mjs`
- Modify: `assets/js/site.js`

**Interfaces:**

- Consumes: `GET /umami-config.json` with `{ hostUrl: string, websiteId: string }`.
- Produces: `window.NuevoEstiloUmami.init()` and one external tracker element.

- [x] **Step 1: Write the failing test**

```js
test("loads personal Umami and covers every HTML entry", async () => {
  assert.equal(htmlFiles.length, 31);
  assert.deepEqual(htmlWithoutSiteJs, []);
  assert.equal(
    tracker.src,
    "https://analytics.187.124.55.36.sslip.io/script.js",
  );
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/umami-analytics.test.mjs`

Expected: FAIL because `assets/js/umami-analytics.js` does not exist.

- [x] **Step 3: Implement the bootstrap and shared loader hook**

```js
const tracker = document.createElement("script");
tracker.defer = true;
tracker.dataset.hostUrl = PERSONAL_HOST;
tracker.dataset.websiteId = websiteId;
tracker.src = `${PERSONAL_HOST}/script.js`;
document.head.appendChild(tracker);
```

`assets/js/site.js` injects `/assets/js/umami-analytics.js` once and independently of its cookie banner.

- [x] **Step 4: Run verification**

Run: `node --test tests/umami-analytics.test.mjs`

Run: `node scripts/check-html.mjs`

Run: `git diff --check`

Expected: tests and HTML checks PASS with no whitespace errors.

- [x] **Step 5: Commit**

```bash
git add assets/js/site.js assets/js/umami-analytics.js umami-config.json tests/umami-analytics.test.mjs docs/superpowers/plans/2026-08-29-umami-personal-tracking.md
git commit -m "feat: add personal Umami tracking"
```
