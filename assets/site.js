(() => {
  'use strict';

  const articles = window.articles;
  const youtubeChannel = '';
  const youtubeSearch = 'https://www.youtube.com/results?search_query=%22Unemployed+Code%22';
  const categoryClasses = { DSA: 'dsa', LeetCode: 'leetcode', Interviews: 'interviews' };
  const cardMotifs = {
    arrays: [['[', 'plain'], ['4'], ['8'], ['15', 'filled'], ['16'], [']', 'plain']],
    'two-sum': [['2'], ['+', 'plain'], ['7'], ['=', 'plain'], ['9', 'filled']],
    'think-out-loud': [['before I code…', 'phrase']],
    stacks: [['push'], ['top', 'filled'], ['pop']],
    'valid-parentheses': [['('], ['['], [']'], [')', 'filled']],
    'practice-with-intent': [['solve'], ['review', 'filled'], ['retry']],
  };

  function element(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }

  function link(className, label, href) {
    const anchor = element('a', className, label);
    anchor.href = href;
    return anchor;
  }

  function postLink(prefix, article) {
    return `${prefix}post.html?slug=${encodeURIComponent(article.slug)}`;
  }

  function updateChannelLinks() {
    for (const anchor of document.querySelectorAll('[data-channel]')) {
      anchor.href = youtubeChannel || youtubeSearch;
      const label = youtubeChannel ? 'Visit YouTube channel' : 'Search on YouTube';
      const textNode = [...anchor.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (textNode) textNode.textContent = label;
      else anchor.append(label);
    }
  }

  function metadata(article, className) {
    const meta = element('div', className);
    meta.append(
      element('span', `topic ${categoryClasses[article.category]}`, article.category),
      element('span', 'read-time', `${article.minutes} min read`),
    );
    return meta;
  }

  function postCard(article, prefix) {
    const card = link('post-card', undefined, postLink(prefix, article));
    card.setAttribute('aria-label', `${article.title}, ${article.category}, ${article.minutes} min read`);
    const cover = element('div', `card-cover ${categoryClasses[article.category]}`);
    cover.setAttribute('aria-hidden', 'true');
    const motif = element('div', 'card-motif');
    for (const [text, style] of cardMotifs[article.slug] || [[article.category, 'phrase']]) {
      motif.append(element('span', style, text));
    }
    cover.append(motif);
    const content = element('div', 'card-copy');
    content.append(
      metadata(article, 'card-meta'),
      element('h3', '', article.title),
      element('p', '', article.description),
      element('span', 'card-action', 'Read editorial'),
    );
    card.append(cover, content);
    return card;
  }

  function renderLibrary(grid) {
    const tools = document.querySelector('[data-library-tools]');
    const filters = [...tools.querySelectorAll('[data-category]')];
    const search = tools.querySelector('[data-search]');
    const count = document.querySelector('[data-count]');
    const empty = document.querySelector('[data-empty]');
    const clear = document.querySelector('[data-clear]');
    let category = '';

    function readLocation() {
      const params = new URLSearchParams(window.location.search);
      const value = params.get('category');
      category = Object.hasOwn(categoryClasses, value) ? value : '';
      search.value = params.get('q') || '';
    }

    function render() {
      const query = search.value.trim().toLowerCase();
      const results = articles.filter((article) => {
        const headings = article.sections.map((section) => section.heading);
        const haystack = [article.title, article.category, article.description, ...headings].join(' ').toLowerCase();
        return (!category || article.category === category) && query.split(/\s+/).every((term) => haystack.includes(term));
      });

      grid.replaceChildren(...results.map((article) => postCard(article, './')));
      empty.hidden = results.length > 0;
      count.textContent = `${results.length} ${results.length === 1 ? 'post' : 'posts'}`;
      for (const filter of filters) {
        filter.setAttribute('aria-pressed', String(filter.dataset.category === category));
      }
    }

    function updateLocation() {
      const url = new URL(window.location.href);
      const values = { category, q: search.value.trim() };
      for (const [key, value] of Object.entries(values)) {
        if (value) url.searchParams.set(key, value);
        else url.searchParams.delete(key);
      }
      history.replaceState(null, '', url);
    }

    function applyFilters() {
      updateLocation();
      render();
    }

    for (const filter of filters) {
      filter.addEventListener('click', () => {
        category = filter.dataset.category;
        applyFilters();
      });
    }
    search.addEventListener('input', applyFilters);
    clear.addEventListener('click', () => {
      category = '';
      search.value = '';
      applyFilters();
      search.focus();
    });
    window.addEventListener('popstate', () => {
      readLocation();
      render();
    });

    readLocation();
    render();
    tools.hidden = false;
  }

  function codeSnippet(text) {
    const block = element('div', 'code-snippet');
    const bar = element('div', 'code-head');
    const copy = element('button', '', 'Copy code');
    copy.type = 'button';
    const pre = element('pre');
    pre.tabIndex = 0;
    pre.setAttribute('aria-label', 'JavaScript example');
    const code = element('code', '', text);
    pre.append(code);
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(text);
        copy.textContent = 'Copied';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        copy.textContent = 'Code selected';
      }
    });
    bar.append(element('span', '', 'JavaScript'), copy);
    block.append(bar, pre);
    return block;
  }

  function videoSection(article) {
    const section = element('section', 'video-section');
    section.id = 'video';
    section.append(element('h2', 'video-heading', 'Video walkthrough'));
    if (/^[\w-]{11}$/.test(article.videoId)) {
      const iframe = element('iframe', 'video-frame');
      iframe.src = `https://www.youtube-nocookie.com/embed/${article.videoId}`;
      iframe.title = `${article.title} video walkthrough`;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      section.append(iframe);
    } else {
      const notice = element('div', 'video-placeholder');
      const play = element('span', 'play-icon');
      play.setAttribute('aria-hidden', 'true');
      notice.append(play, element('p', '', 'A walkthrough will appear here when the video is available.'));
      section.append(notice);
    }
    return section;
  }

  function renderPost(main) {
    const slug = new URLSearchParams(window.location.search).get('slug');
    const article = articles.find((entry) => entry.slug === slug);
    if (!article) {
      document.title = 'Post unavailable · Unemployed Code';
      const missing = element('div', 'wrap missing-post');
      missing.append(element('h1', '', 'Post unavailable'), element('p', '', 'You can find the published editorials in the library.'), link('back-link', 'Browse the library', './'));
      main.append(missing);
      return;
    }

    document.title = `${article.title} · Unemployed Code`;
    document.querySelector('meta[name="description"]').content = article.description;

    const top = element('header', 'post-hero');
    const header = element('div', 'wrap');
    const library = `./?category=${encodeURIComponent(article.category)}`;
    header.append(
      link('back-link', 'Back to the library', library),
      metadata(article, 'post-meta'),
      element('h1', '', article.title),
      element('p', '', article.description),
    );
    if (article.problemUrl) header.append(link('back-link problem-link', 'View problem on LeetCode', article.problemUrl));
    top.append(header);

    const layout = element('div', 'wrap post-layout');
    const body = element('article', 'post-body');
    const table = element('nav', 'toc');
    table.setAttribute('aria-label', 'On this page');
    table.append(element('h2', '', 'On this page'), link('', 'Video walkthrough', '#video'));
    body.append(videoSection(article));

    article.sections.forEach((section, index) => {
      const block = element('section', 'post-section');
      block.id = `section-${index + 1}`;
      block.append(element('h2', '', section.heading));
      for (const paragraph of section.paragraphs || []) {
        block.append(element('p', '', paragraph));
      }
      if (section.list) {
        const list = element('ul');
        list.append(...section.list.map((item) => element('li', '', item)));
        block.append(list);
      }
      if (section.code) block.append(codeSnippet(section.code));
      table.append(link('', section.heading, `#${block.id}`));
      body.append(block);
    });

    const end = element('div', 'post-end');
    end.append(link('back-link', `More ${article.category === 'Interviews' ? 'interview' : article.category} posts`, library));
    body.append(end);
    layout.append(body, table);
    main.append(top, layout);

    const fragment = window.location.hash.slice(1);
    if (fragment) document.getElementById(fragment)?.scrollIntoView();
  }

  updateChannelLinks();
  const library = document.querySelector('[data-library]');
  if (library) renderLibrary(library);
  const main = document.querySelector('[data-article]');
  if (main) renderPost(main);
})();
