// YouTube Shorts Blocker
// This script runs on every YouTube page and hides Shorts elements.

// CSS selectors that target Shorts in different parts of YouTube
const SHORTS_SELECTORS = [
  // Shorts shelf on the homepage
  'ytd-rich-shelf-renderer[is-shorts]',
  // Shorts items in search results
  'ytd-reel-shelf-renderer',
  // Shorts link in the left sidebar
  'a[title="Shorts"]',
  // Shorts chip in the filter bar
  'yt-chip-cloud-chip-renderer a[title="Shorts"]',
  // Shorts videos in search results (URL contains /shorts/)
  'a.ytd-compact-video-renderer[href*="/shorts/"]',
  // Shorts items in the main feed
  'ytd-video-renderer a[href*="/shorts/"]',
].join(', ');

// Inject a <style> tag that hides all Shorts elements permanently
function injectBlockingCSS() {
  // Avoid injecting twice
  if (document.getElementById('shorts-blocker-style')) return;

  const style = document.createElement('style');
  style.id = 'shorts-blocker-style';
  style.textContent = `
    /* Hide Shorts shelf on homepage */
    ytd-rich-shelf-renderer[is-shorts],
    /* Hide Shorts tab in sidebar */
    ytd-guide-entry-renderer a[href="/shorts"],
    /* Hide Shorts section in mini sidebar */
    ytd-mini-guide-entry-renderer a[href="/shorts"],
    /* Hide Shorts shelf/section in results */
    ytd-reel-shelf-renderer,
    /* Hide individual Shorts video cards */
    ytd-grid-video-renderer a[href*="/shorts/"],
    ytd-video-renderer a[href*="/shorts/"],
    ytd-compact-video-renderer a[href*="/shorts/"],
    /* Hide the entire parent card if its link is a Short */
    ytd-video-renderer:has(a[href*="/shorts/"]),
    ytd-rich-item-renderer:has(a[href*="/shorts/"]),
    ytd-compact-video-renderer:has(a[href*="/shorts/"]) {
      display: none !important;
    }

    /* If you somehow land on a Shorts page, redirect notice */
    ytd-page-manager[page-subtype="shorts"] {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}

// Also redirect away if someone navigates directly to a /shorts/ URL
function redirectIfShorts() {
  if (window.location.pathname.startsWith('/shorts/')) {
    // Redirect to the normal video player instead
    const videoId = window.location.pathname.split('/shorts/')[1].split('?')[0];
    window.location.replace('https://www.youtube.com/watch?v=' + videoId);
  }
}

// Run on first load
injectBlockingCSS();
redirectIfShorts();

// YouTube is a Single Page App (SPA) — the page doesn't fully reload when
// you click links. We use a MutationObserver to watch for new elements
// being added and re-apply our CSS whenever the page content changes.
const observer = new MutationObserver(() => {
  injectBlockingCSS();
  redirectIfShorts();
});

observer.observe(document.body, {
  childList: true,   // watch for added/removed elements
  subtree: true      // watch all descendants, not just direct children
});
