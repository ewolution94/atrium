// The wall's layout, kept on the device: big tiles, or app icons like a home screen.

export type Layout = 'wall' | 'icons';
const KEY = 'atrium:layout';

function initial(): Layout {
  try {
    return localStorage.getItem(KEY) === 'icons' ? 'icons' : 'wall';
  } catch {
    return 'wall';
  }
}

export const prefs = $state({ layout: initial() });

export function setLayout(layout: Layout) {
  prefs.layout = layout;
  try {
    localStorage.setItem(KEY, layout);
  } catch {
    // not kept, still applied
  }
}
