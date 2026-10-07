// The background: a calm grid of dots that wakes up around the mouse and takes the colour of
// the tile under it. It only draws while the pointer moves or the dots are settling, so an idle
// page is still (no frames at all), and it never reacts to scrolling. Touch moves are ignored:
// on a phone they're scrolls.

const GAP = 26;
const RADIUS = 170;

let setTint: (color: string | null) => void = () => {};

/** The colour dots near the pointer take, e.g. the hovered tile's accent; null for none. */
export const tintField = (color: string | null) => setTint(color);

export function startField(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const dark = matchMedia('(prefers-color-scheme: dark)');

  let width = 0;
  let height = 0;
  let px = -1e4;
  let py = -1e4;
  let tx = -1e4;
  let ty = -1e4;
  let raf = 0;
  let ink = 'rgb(128 128 128)';
  let base = 0.1;
  let tint: string | null = null;

  /** The canvas's CSS colour is var(--ewo-fg), so reading it back gives the theme's ink as rgb(). */
  function readInk() {
    ink = getComputedStyle(canvas).color;
    const theme = document.documentElement.dataset.theme ?? (dark.matches ? 'dark' : 'light');
    // Quiet on purpose: at 0.12 / 0.09 the grid read as a pattern on top of the page (the user,
    // 2026-10-08, "too intense"). Schätzle's field uses the same values.
    base = theme === 'dark' ? 0.05 : 0.07;
  }

  function resize() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    ctx!.clearRect(0, 0, width, height);
    const r2 = 2 * RADIUS * RADIUS;
    const reach = 9 * RADIUS * RADIUS;
    for (let y = GAP / 2; y < height; y += GAP) {
      for (let x = GAP / 2; x < width; x += GAP) {
        const dx = x - px;
        const dy = y - py;
        const d2 = dx * dx + dy * dy;
        const k = d2 < reach ? Math.exp(-d2 / r2) : 0;
        const push = (k * 7) / (Math.sqrt(d2) || 1);
        const size = 0.9 + 1.3 * k;
        if (k > 0.04 && tint) {
          ctx!.fillStyle = tint;
          ctx!.globalAlpha = Math.min(1, 0.15 + 0.8 * k);
        } else {
          ctx!.fillStyle = ink;
          ctx!.globalAlpha = base + 0.3 * k;
        }
        ctx!.fillRect(x + dx * push - size, y + dy * push - size, size * 2, size * 2);
      }
    }
    ctx!.globalAlpha = 1;
  }

  function frame() {
    raf = 0;
    px += (tx - px) * 0.18;
    py += (ty - py) * 0.18;
    draw();
    if (Math.abs(tx - px) + Math.abs(ty - py) > 0.5) raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (reduced.matches) return;
    if (!raf) raf = requestAnimationFrame(frame);
  }

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    tx = event.clientX;
    ty = event.clientY;
    // Arriving from outside the window: start where the pointer is, not from far away.
    if (px < -1e3) {
      px = tx;
      py = ty;
    }
    wake();
  };
  const onLeave = () => {
    tx = ty = px = py = -1e4;
    draw();
  };
  const onTheme = () => {
    readInk();
    draw();
  };

  setTint = (color) => {
    tint = color;
    wake();
  };

  readInk();
  resize();
  addEventListener('resize', resize);
  addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  addEventListener('ewo-theme', onTheme);
  dark.addEventListener('change', onTheme);

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', resize);
    removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    removeEventListener('ewo-theme', onTheme);
    dark.removeEventListener('change', onTheme);
    setTint = () => {};
  };
}
