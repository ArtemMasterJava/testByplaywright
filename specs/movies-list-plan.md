## Movies List Management - Test Plan

### Scope
Validate end-to-end workflows for managing user movie lists: list creation, adding movies, attaching images, navigating to list views, editing and deleting, and ensuring data persistence and basic non-functional qualities.

Target site: `https://iscreeningroom.com/` ([link](https://iscreeningroom.com/))

### Assumptions
- App provides a way to create named lists and add movie items with title, optional year, and optional image.
- If UI hooks are not available, tests can seed data via `localStorage` as a fallback.
- Custom Playwright fixture `listPage` initializes a page, seeds lists, adds images, and opens the list page.

### Out of Scope
- Back-end API contract testing beyond UI-visible effects.
- DRM/watermarking behavior and authentication flows specific to secure screenings.

### Environments
- Desktop browsers: Chromium, Firefox, WebKit (per `playwright.config.js`).
- Base URL configurable via `MOVIE_SITE_URL` env; default `https://iscreeningroom.com/`.

### Test Data
- Lists: `Favorites`, `Watch Later`.
- Movies: `The Avengers (2012)`, `Inception (2010)`, `Interstellar (2014)`, `Dune (2021)`.
- Poster URL: `https://via.placeholder.com/300x450.png?text=Poster`.

### Pre-requisites
- Playwright installed and browsers set up (`npm run test:install`).
- Custom fixture `tests/fixtures/listPage.ts` available.

### Risks
- Public site UI may not expose list management features; tests rely on best-effort selectors and `localStorage` fallback.

---

### Test Cases

1. Seed and Navigate via Fixture
- Steps:
  - Use `listPage` fixture to initialize and navigate.
  - Verify URL matches base domain.
- Expected:
  - Page loads without errors.

2. Create List via UI (if available)
- Steps:
  - Click Create List.
  - Enter name `Favorites` and submit.
- Expected:
  - `Favorites` appears in lists.

3. Add Movies to List via UI (if available)
- Steps:
  - In `Favorites`, add `The Avengers (2012)` and `Inception (2010)`.
- Expected:
  - Movies appear under `Favorites` with correct titles.

4. Seed Lists via LocalStorage (fallback)
- Steps:
  - If UI controls missing, inject `e2e.movieLists` with two lists and movies.
  - Reload page.
- Expected:
  - Lists and movies present based on seeded data.

5. Attach Image to First Movie in Each List
- Steps:
  - For each list, set image URL on the first movie.
  - Save/confirm.
- Expected:
  - First movie shows image thumbnail or stored image URL field retains value.

6. Open Lists Page/Section
- Steps:
  - Navigate to `/lists` or open Lists section.
- Expected:
  - Lists overview visible with `Favorites` and `Watch Later` populated.

7. Edit Movie Details
- Steps:
  - Edit `Inception` year to `2011` (or change title casing).
- Expected:
  - Updated value persists and is displayed.

8. Remove Movie From List
- Steps:
  - Delete `Dune` from `Watch Later`.
- Expected:
  - `Dune` no longer appears; list count decrements.

9. Delete Entire List
- Steps:
  - Delete `Watch Later` list.
- Expected:
  - List removed from overview.

10. Persistence Across Reload
- Steps:
  - Reload page after modifications.
- Expected:
  - Lists and movies reflect latest state.

11. Validation and Edge Cases
- Steps:
  - Attempt to create list with empty name.
  - Attempt to add movie with empty title.
  - Add duplicate movie titles.
- Expected:
  - Appropriate validation messages; app-defined behavior on duplicates (allow with dedupe/allow multiples or prevent).

12. Accessibility Smoke
- Steps:
  - Verify key interactive controls have accessible names/roles (create list, add movie, edit, delete).
- Expected:
  - Elements are discoverable by role/name queries.

13. Responsive Smoke (Optional)
- Steps:
  - Resize viewport to common widths.
- Expected:
  - Primary list and movie operations remain usable.

14. Performance/Resilience Smoke
- Steps:
  - Add 50+ movies to a list (scripted loop).
- Expected:
  - UI remains responsive; no crashes.

---

### Automation Mapping (Playwright)
- Fixture: `tests/fixtures/listPage.ts` provides `listPage` seeded with two lists and images on first item.
- Spec suggestions:
  - `tests/movies-list.create.spec.ts` – covers cases 2–3.
  - `tests/movies-list.seed-fallback.spec.ts` – covers 4–6.
  - `tests/movies-list.edit-delete.spec.ts` – covers 7–9.
  - `tests/movies-list.persistence.spec.ts` – covers 10.
  - `tests/movies-list.validation.spec.ts` – covers 11–13.
  - `tests/movies-list.performance.spec.ts` – covers 14.

### Reporting
- Use Playwright HTML report (`npm run test:report`).
- Capture screenshots on failure; enable trace on first retry per config.

### Exit Criteria
- All critical cases (1–10) pass on Chromium; major flows green on Firefox/WebKit.

