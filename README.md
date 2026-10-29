# Markdown Beautifier

A Chrome extension that shows Markdown (`.md`) files as clean, readable pages.

## What it does

- Renders headings, lists, tables, code blocks, task lists, links and images.
- Shows an "On this page" table of contents on wide screens.
- Adds a Copy button to each code block.
- Adds a "Show raw" button to see the original text.
- Uses a light or dark theme, based on your system setting.
- Works on `.md` and `.markdown` files on local disk and on the web.
- Leaves GitHub's own rendered pages alone.

## Install (developer mode)

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked**.
4. Choose this `md-beautifier` folder.
5. For files on your computer, open the extension's details and turn on **Allow access to file URLs**.

## Try it

- Open `samples/sample.md` in Chrome (use the file path, or drag the file into a tab).
- You should see the rendered page. Click **Show raw** to see the source.

## Permissions

- The extension asks for no extra permissions.
- It runs only on pages whose address ends in `.md` or `.markdown`.
- Nothing is sent over the network. All code runs on your machine.

## Files

- `manifest.json`: extension settings and the list of pages it runs on.
- `src/content.js`: finds the Markdown text, renders it, and builds the page.
- `styles/viewer.css`: the look of the page, including dark mode and printing.
- `vendor/`: two libraries, copied from npm and not edited.
  - `marked` 18.1.1 turns Markdown into HTML (MIT license).
  - `DOMPurify` 3.4.17 removes unsafe HTML from the result (MPL-2.0 or Apache-2.0).
- `samples/sample.md`: a test file with every supported feature.
- `assets/icons/`: the extension icon. `icon-source.png` (512 px) is the master. The 16, 48 and 128 px files are resized from it.
- `store/`: a screenshot for the Chrome Web Store listing.
- `LICENSE`: MIT license.
- `PRIVACY.md`: privacy policy.

## Updating the libraries

1. Download the new version from npm (for example with `npm pack marked@<version>`).
2. Copy `lib/marked.umd.js` (for `marked`) or `dist/purify.min.js` (for `DOMPurify`) into `vendor/`.
3. Update the version in this README.
4. Reload the extension on `chrome://extensions`.

## Not included yet

- No syntax colors inside code blocks.
- No option to make raw view the default.
