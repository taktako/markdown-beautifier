// Renders a Markdown file as a styled page.
//
// Chrome shows a .md file as plain text: the whole file sits in one <pre>.
// This script only acts in that case, so GitHub's own rendered pages are left alone.
(() => {
  'use strict';

  // Chrome's plain-text viewer puts the whole file inside a single <pre>.
  function isPlainTextPage() {
    const { body } = document;
    return body.children.length === 1 && body.firstElementChild.tagName === 'PRE';
  }

  function fileName() {
    const last = location.pathname.split('/').pop() || location.href;
    try {
      return decodeURIComponent(last);
    } catch (error) {
      return last;
    }
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Lowercase, drop punctuation, and turn spaces into dashes (like GitHub anchors).
  function slugify(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .replace(/\s+/g, '-');
  }

  function addHeadingIds(main) {
    const used = new Map();
    main.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      const base = slugify(heading.textContent) || 'section';
      const count = used.get(base) ?? 0;
      used.set(base, count + 1);
      heading.id = count ? `${base}-${count}` : base;
    });
  }

  // Table of contents from the h2 and h3 headings. Skipped when there are fewer than two.
  function buildToc(main) {
    const headings = [...main.querySelectorAll('h2, h3')];
    if (headings.length < 2) return null;

    const nav = el('nav', 'mdb-toc');
    nav.setAttribute('aria-label', 'Table of contents');

    const list = el('ul');
    headings.forEach((heading) => {
      const item = el('li');
      if (heading.tagName === 'H3') item.classList.add('is-sub');
      const link = el('a', '', heading.textContent);
      link.href = `#${heading.id}`;
      item.append(link);
      list.append(item);
    });

    nav.append(el('p', 'mdb-toc-title', 'On this page'), list);
    return nav;
  }

  function addCopyButtons(main) {
    main.querySelectorAll('pre').forEach((pre) => {
      const button = el('button', 'mdb-copy', 'Copy');
      button.type = 'button';
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(pre.querySelector('code').textContent);
          button.textContent = 'Copied';
        } catch (error) {
          button.textContent = 'Failed';
        }
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 1500);
      });
      pre.append(button);
    });
  }

  function buildViewer(name, source, html) {
    const root = el('div', 'mdb');
    root.dataset.view = 'rendered';

    const main = el('main', 'mdb-doc');
    main.innerHTML = html;
    addHeadingIds(main);
    addCopyButtons(main);
    const toc = buildToc(main);

    const layout = el('div', toc ? 'mdb-layout has-toc' : 'mdb-layout');
    if (toc) layout.append(toc);
    layout.append(main, el('pre', 'mdb-raw', source));

    const toggle = el('button', 'mdb-toggle', 'Show raw');
    toggle.type = 'button';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.addEventListener('click', () => {
      const showRaw = root.dataset.view !== 'raw';
      root.dataset.view = showRaw ? 'raw' : 'rendered';
      toggle.textContent = showRaw ? 'Show rendered' : 'Show raw';
      toggle.setAttribute('aria-pressed', String(showRaw));
      window.scrollTo(0, 0);
    });

    const toolbar = el('header', 'mdb-toolbar');
    toolbar.append(el('span', 'mdb-title', name), toggle);

    root.append(toolbar, layout);
    return root;
  }

  if (!isPlainTextPage()) return;

  const source = document.body.firstElementChild.textContent.replace(/^﻿/, '');

  let html;
  try {
    html = DOMPurify.sanitize(marked.parse(source));
  } catch (error) {
    // Keep the original page if rendering fails.
    console.error('Markdown Beautifier could not render this file:', error);
    return;
  }

  document.body.replaceChildren(buildViewer(fileName(), source, html));
})();
