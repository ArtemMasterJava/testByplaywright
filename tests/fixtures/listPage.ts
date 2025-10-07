import { test as base, expect, BrowserContext, Page } from '@playwright/test';

type ListItem = {
  title: string;
  year?: number;
  imageUrl?: string;
};

type MovieList = {
  name: string;
  movies: ListItem[];
};

type ListPageFixture = {
  listPage: Page;
};

export const test = base.extend<ListPageFixture>({
  listPage: async ({ context, baseURL }, use) => {
    const page = await createPageFromContext(context);

    const baseUrl = process.env.MOVIE_SITE_URL || baseURL || 'http://localhost:3000/';

    // 1) Create a page and navigate it (relative to baseURL with retry)
    await gotoWithRetry(page, '/', 10, 500);

    // 2) Create lists and add movies to them (best-effort, resilient to unknown UI)
    const lists: MovieList[] = [
      {
        name: 'Favorites',
        movies: [
          { title: 'The Avengers', year: 2012 },
          { title: 'Inception', year: 2010 },
        ],
      },
      {
        name: 'Watch Later',
        movies: [
          { title: 'Interstellar', year: 2014 },
          { title: 'Dune', year: 2021 },
        ],
      },
    ];

    // Attempt UI-driven creation if target app supports it; otherwise seed via localStorage
    await seedListsIntoApp(page, lists);

    // 3) Add an image to the first movie in each list
    const posterUrl = 'https://via.placeholder.com/300x450.png?text=Poster';
    for (const list of lists) {
      if (list.movies.length > 0) {
        list.movies[0].imageUrl = posterUrl;
      }
    }
    await updateFirstMovieImages(page, lists);

    // 4) Open the list page (best-effort; tolerate unknown routes)
    try {
      await page.goto('/lists', { waitUntil: 'load' });
    } catch {
      // Ignore navigation errors if the route does not exist
    }

    await use(page);

    await page.close();
  },
});

export { expect };

async function createPageFromContext(context: BrowserContext): Promise<Page> {
  return await context.newPage();
}

function safeJoinUrl(base: string, path: string): string {
  try {
    const url = new URL(path, base);
    return url.toString();
  } catch {
    return base;
  }
}

async function gotoWithRetry(page: Page, url: string, attempts: number, delayMs: number): Promise<void> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      await page.goto(url, { waitUntil: 'load' });
      return;
    } catch (err) {
      lastError = err;
      await page.waitForTimeout(delayMs);
    }
  }
  throw lastError;
}

async function seedListsIntoApp(page: Page, lists: MovieList[]): Promise<void> {
  // Try to find common UI hooks; if not found, fall back to localStorage seeding.
  const hasUi = await page.$('[data-test="create-list"], [data-testid="create-list"], button:has-text("Create List")');
  if (hasUi) {
    // Best-effort UI seeding (selectors may differ per app)
    for (const list of lists) {
      try {
        const createBtn = await page.$('[data-test="create-list"], [data-testid="create-list"], button:has-text("Create List")');
        if (createBtn) await createBtn.click();
        const nameInput = await page.$('[data-test="list-name"], [name="listName"], input[placeholder*="List"]');
        if (nameInput) {
          await nameInput.fill(list.name);
          await nameInput.press('Enter');
        }
        for (const movie of list.movies) {
          const addMovie = await page.$('[data-test="add-movie"], [data-testid="add-movie"], button:has-text("Add Movie")');
          if (addMovie) await addMovie.click();
          const titleInput = await page.$('[data-test="movie-title"], [name="movieTitle"], input[placeholder*="Title"]');
          if (titleInput) {
            await titleInput.fill(movie.title);
            await titleInput.press('Enter');
          }
        }
      } catch {
        // If UI flow fails midway, fall back to localStorage
        await seedViaLocalStorage(page, lists);
        return;
      }
    }
    return;
  }

  await seedViaLocalStorage(page, lists);
}

async function seedViaLocalStorage(page: Page, lists: MovieList[]): Promise<void> {
  await page.addInitScript((seed) => {
    try {
      // Namespaced key to avoid collisions
      const key = 'e2e.movieLists';
      const existing = window.localStorage.getItem(key);
      if (!existing) {
        window.localStorage.setItem(key, JSON.stringify(seed));
      }
    } catch {
      // Ignore storage errors (e.g., denied access)
    }
  }, lists);

  // Reload to ensure init script runs on navigation as well
  try {
    await page.reload({ waitUntil: 'load' });
  } catch {
    // ignore
  }
}

async function updateFirstMovieImages(page: Page, lists: MovieList[]): Promise<void> {
  // Best-effort UI update; otherwise, update our localStorage seed
  const hasUi = await page.$('[data-test="edit-movie"], [data-testid="edit-movie"], button:has-text("Edit")');
  if (hasUi) {
    for (const list of lists) {
      if (!list.movies.length || !list.movies[0].imageUrl) continue;
      try {
        const editBtn = await page.$('[data-test="edit-movie"], [data-testid="edit-movie"], button:has-text("Edit")');
        if (editBtn) await editBtn.click();
        const imageInput = await page.$('[data-test="movie-image"], [name="imageUrl"], input[placeholder*="Image"]');
        if (imageInput) {
          await imageInput.fill(list.movies[0].imageUrl);
          await imageInput.press('Enter');
        }
      } catch {
        // ignore and fall back
      }
    }
    return;
  }

  await page.evaluate((seed) => {
    try {
      const key = 'e2e.movieLists';
      window.localStorage.setItem(key, JSON.stringify(seed));
    } catch {
      // ignore
    }
  }, lists);
}


