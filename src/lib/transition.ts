// A tile grows into its app's page and shrinks back into place, with the View Transitions API
// where the browser has it. Without it, or with reduced motion, the page simply changes.

import { flushSync } from 'svelte';

const NAME = 'pick';

function inView(el: Element) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight && r.width > 0;
}

/**
 * @param from    the element on screen now (a tile, or the page's stage)
 * @param update  changes the page; runs synchronously inside the transition
 * @param to      finds the matching element once the page has changed
 */
export function morph(from: HTMLElement | null, update: () => void, to: () => HTMLElement | null) {
  const run = () => {
    update();
    flushSync();
  };
  if (!from || !document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches || !inView(from)) {
    run();
    return;
  }
  from.style.viewTransitionName = NAME;
  let target: HTMLElement | null = null;
  const transition = document.startViewTransition(() => {
    from.style.viewTransitionName = '';
    run();
    target = to();
    // Only one element may carry the name, and only if it's actually on screen.
    if (target && inView(target)) target.style.viewTransitionName = NAME;
  });
  // A transition the browser skips (a hidden tab, a second one starting) rejects these; the page
  // has changed either way.
  transition.ready.catch(() => {});
  transition.finished.finally(() => {
    if (target) target.style.viewTransitionName = '';
  });
}
