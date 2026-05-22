# YouTube Shorts Blocker 

A free browser extension that hides YouTube Shorts from your feed and redirects Shorts URLs to the normal video player. This disables the addictive scrolling mechanism and lets you watch videos in the standard interface (avoiding doom scrolling).

## What it blocks
- Shorts shelf on the YouTube homepage
- Shorts video cards in search results
- Direct navigation to `/shorts/` URLs (redirects to normal player)

---

## Option A — Automatic setup (recommended for beginners)

A Python helper script is included that automatically detects your browser and opens the right extensions page for you.

**Requirements:** Python 3 installed on your computer. Check by running `python --version` in your terminal.

**Steps:**
1. Download or clone this repository
2. Open a terminal in the folder
3. Run:
   ```bash
   python install.py
   ```
4. Your browser will open to the extensions page automatically
5. Follow the on-screen instructions printed in the terminal

---

## Option B — Manual setup

1. Download or clone this repository onto your computer
2. Open your browser's extensions page:
   - **Google Chrome:** `chrome://extensions/`
   - **Microsoft Edge:** `edge://extensions/`
   - **Brave Browser:** `brave://extensions/`
3. Turn on **Developer mode** (toggle in the top-right corner)
4. Click **"Load unpacked"**
5. Select this `youtube-shorts-blocker` folder
6. Done! The extension must now be active. 

---

## How to share with friends (via GitHub — also FREE)

1. Create a free account at https://github.com
2. Create a new repository (e.g. `youtube-shorts-blocker`)
3. Upload all files from this folder
4. Share the GitHub link — friends can download the ZIP and follow the steps above

---

## Is it safe?

Yes. This extension:
- Requires **zero permissions** (it doesn't access your data, history, or passwords)
- Runs only CSS/JS on YouTube pages
- Never connects to any server
- Is fully open-source — you can read every line of code

---

## Files explained

| File | What it does |
|------|-------------|
| `manifest.json` | Tells the browser the extension's name, version, and which pages to run on |
| `content.js` | The script that hides Shorts using CSS and redirects Shorts URLs |
| `setup.py` | Python helper that detects your OS and browser, then opens the extensions page |
| `README.md` | This file |

---

## Do I need to pay anything?

| Method | Cost |
|--------|------|
| Using it yourself via Developer Mode | **FREE** |
| Sharing via GitHub | **FREE** |
| Publishing to Chrome/Edge Web Store publicly | One-time $5 (optional) |
