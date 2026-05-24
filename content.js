// YouTube Shorts Blocker - Resilient Version
// Strategy: rely on /shorts/ URLs instead of class names,
// because YouTube frequently renames classes but rarely changes URLs.

// ---------------------------------------------------------------------------
// REDIRECT
// If the user lands directly on a /shorts/ URL, send them to the normal
// video player instead. This runs before anything else.
// ---------------------------------------------------------------------------
function redirectIfShorts() {
  if (window.location.pathname.startsWith('/shorts/')) {
    const videoId = window.location.pathname.split('/shorts/')[1].split('?')[0];
    window.location.replace('https://www.youtube.com/watch?v=' + videoId);
  }
}

// ---------------------------------------------------------------------------
// HIDE SHORTS ELEMENTS
// We use two layers:
//   1. CSS injection  — fast, hides things as soon as the style is applied
//   2. DOM sweeping   — catches anything CSS might miss on dynamic loads
// ---------------------------------------------------------------------------

// Inject a <style> block into the page head.
// We only do this once (check for the ID first).
function injectBlockingCSS() {
  if (document.getElementById('yt-shorts-blocker-style')) return;

  const style = document.createElement('style');
  style.id = 'yt-shorts-blocker-style';
  style.textContent = `

    /* ---- Sidebar links ---- */
    /* Matches the full sidebar "Shorts" entry */
    ytd-guide-entry-renderer:has(a[href="/shorts"]),
    /* Matches the mini/collapsed sidebar icon */
    ytd-mini-guide-entry-renderer:has(a[href="/shorts"]) {
      display: none !important;
    }

    /* ---- Shorts shelves on homepage / search ---- */
    /* The dedicated Shorts shelf (attribute-based — stable) */
    ytd-rich-shelf-renderer[is-shorts],
    /* Reel/Shorts shelf in search results */
    ytd-reel-shelf-renderer {
      display: none !important;
    }

    /* ---- Individual video cards that link to /shorts/ ---- */
    /* Home feed card */
    ytd-rich-item-renderer:has(a[href*="/shorts/"]),
    /* Standard video row (search, related) */
    ytd-video-renderer:has(a[href*="/shorts/"]),
    /* Compact video (sidebar recommendations) */
    ytd-compact-video-renderer:has(a[href*="/shorts/"]),
    /* Grid layout (channel pages) */
    ytd-grid-video-renderer:has(a[href*="/shorts/"]),
    /* Reel item renderer */
    ytd-reel-item-renderer {
      display: none !important;
    }

    /* ---- Shorts chip in the filter/topic bar ---- */
    yt-chip-cloud-chip-renderer:has(a[title="Shorts"]) {
      display: none !important;
    }

    /* ---- Shorts page itself (fallback if redirect hasn't fired yet) ---- */
    ytd-page-manager[page-subtype="shorts"] {
      display: none !important;
    }

  `;

  // Inject as early as possible
  (document.head || document.documentElement).appendChild(style);
}

// DOM sweep: walk every anchor tag and hide the closest video-card ancestor
// if the href contains /shorts/. This catches cards that CSS :has() might
// miss in older Chromium builds or unusual page layouts.
function sweepShortsFromDOM() {
  document.querySelectorAll('a[href*="/shorts/"]').forEach(link => {

    // Walk up the tree looking for a known card container
    const cardSelectors = [
      'ytd-rich-item-renderer',
      'ytd-video-renderer',
      'ytd-compact-video-renderer',
      'ytd-grid-video-renderer',
      'ytd-reel-item-renderer',
    ];

    let node = link.parentElement;
    while (node && node !== document.body) {
      if (cardSelectors.some(sel => node.matches(sel))) {
        node.style.setProperty('display', 'none', 'important');
        break;
      }
      node = node.parentElement;
    }
  });

  // Also hide the sidebar Shorts link by href (backup for CSS rule above)
  document.querySelectorAll('a[href="/shorts"]').forEach(link => {
    // Hide the whole guide entry, not just the anchor
    let node = link.parentElement;
    while (node && node !== document.body) {
      if (
        node.matches('ytd-guide-entry-renderer') ||
        node.matches('ytd-mini-guide-entry-renderer')
      ) {
        node.style.setProperty('display', 'none', 'important');
        break;
      }
      node = node.parentElement;
    }
  });
}

// ---------------------------------------------------------------------------
// OBSERVER
// YouTube is a Single Page App — navigating between pages does NOT trigger
// a full reload. We watch for DOM changes and re-run our sweep each time
// new content is added (e.g. infinite scroll loading more videos).
// ---------------------------------------------------------------------------

// Debounce: avoid running the sweep hundreds of times per second when
// YouTube is rapidly inserting elements. Wait 150ms after the last change.
let debounceTimer = null;

const observer = new MutationObserver(() => {
  redirectIfShorts(); // catches SPA navigations to /shorts/ URLs

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(sweepShortsFromDOM, 150);
});

// ---------------------------------------------------------------------------
// INIT — run everything on first load, then start watching
// ---------------------------------------------------------------------------
redirectIfShorts();
injectBlockingCSS();
sweepShortsFromDOM();

observer.observe(document.documentElement, {
  childList: true,  // watch for elements being added/removed
  subtree: true     // watch the entire page tree, not just direct children
});
