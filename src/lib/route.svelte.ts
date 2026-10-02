// Two kinds of page: the wall (/) and an app's own page (/clinch). An app's page is a page, not
// an overlay: it scrolls like one, Back works, and the link can be shared.

const SLUG = /^\/([a-z0-9-]+)\/?$/;
const slugOf = (path: string) => SLUG.exec(path)?.[1] ?? null;

export const route = $state({ slug: slugOf(location.pathname) });

/** Where the wall was scrolled to before an app's page opened, to return to it. */
let wallScroll = 0;

export function go(slug: string | null) {
  const path = slug ? `/${slug}` : '/';
  if (route.slug === null) wallScroll = scrollY;
  if (location.pathname !== path) history.pushState(null, '', path);
  route.slug = slug;
}

/** The scroll position to restore when the wall comes back. */
export const wallPosition = () => wallScroll;

addEventListener('popstate', () => {
  if (route.slug === null) wallScroll = scrollY;
  route.slug = slugOf(location.pathname);
});
