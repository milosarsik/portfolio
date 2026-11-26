(() => {
  'use strict';

  const lessons = new Map(window.articles.map((lesson) => [lesson.slug, lesson]));

  const courses = [
    {
      slug: 'dsa',
      title: 'DSA',
      symbol: 'A[i]',
      description: 'Build a working understanding of arrays, hash maps, and stacks. Learn when each structure makes a problem easier to solve.',
      outcomes: [
        'Use array indices and a sliding window to reuse work.',
        'Recognize when a hash map can replace a repeated scan.',
        'Use a stack to resolve work in reverse order.',
      ],
      modules: [
        { title: 'Arrays and lookup', lessons: ['arrays', 'hash-maps'] },
        { title: 'Linear structures', lessons: ['stacks'] },
      ],
    },
    {
      slug: 'leetcode',
      title: 'LeetCode',
      symbol: '2 + 7 = 9',
      description: 'Work through three LeetCode problems from a first example to a tested JavaScript solution.',
      outcomes: [
        'Find a pair in one pass by tracking complements.',
        'Track a running minimum while scanning prices.',
        'Use a stack to match nested brackets in order.',
      ],
      modules: [
        { title: 'Array problems', lessons: ['two-sum', 'best-time-to-buy-and-sell-stock'] },
        { title: 'Stack problems', lessons: ['valid-parentheses'] },
      ],
    },
    {
      slug: 'interviews',
      title: 'Interviews',
      symbol: '>_',
      description: 'Practice explaining decisions, reviewing your problem-solving, and running a mock technical interview.',
      outcomes: [
        'Communicate constraints, tradeoffs, and a dry run.',
        'Use a focused review to guide your next practice session.',
        'Run a mock interview with a timed prompt and a debrief.',
      ],
      modules: [
        { title: 'During the interview', lessons: ['think-out-loud'] },
        { title: 'Practice and review', lessons: ['practice-with-intent', 'mock-interview'] },
      ],
    },
  ];

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

  function courseUrl(course, lesson) {
    const params = new URLSearchParams({ course: course.slug });
    if (lesson) params.set('lesson', lesson.slug);
    return `./course.html?${params}`;
  }

  function courseLessons(course) {
    return course.modules.flatMap((module) => module.lessons.map((slug) => lessons.get(slug)));
  }

  function lessonCount(sequence) {
    return `${sequence.length} lessons`;
  }

  function courseCard(course) {
    const card = link('course-card', undefined, courseUrl(course));
    const art = element('div', `course-card-art ${course.slug}`);
    art.setAttribute('aria-hidden', 'true');
    art.append(element('span', '', course.symbol));
    const copy = element('div', 'course-card-copy');
    copy.append(
      element('p', 'course-card-meta', lessonCount(courseLessons(course))),
      element('h3', '', course.title),
      element('p', '', course.description),
      element('span', 'course-card-action', 'View course'),
    );
    card.append(art, copy);
    return card;
  }

  function courseSidebar(course, activeLesson) {
    const sidebar = element('nav', 'course-sidebar');
    sidebar.setAttribute('aria-label', `${course.title} course contents`);

    const title = element('h2', 'course-sidebar-title');
    const courseHome = link('', course.title, courseUrl(course));
    if (!activeLesson) courseHome.setAttribute('aria-current', 'page');
    title.append(courseHome);
    sidebar.append(title, element('p', 'course-sidebar-meta', lessonCount(courseLessons(course))));

    course.modules.forEach((module, index) => {
      const dropdown = element('details', 'course-module');
      dropdown.open = activeLesson ? module.lessons.includes(activeLesson.slug) : index === 0;
      dropdown.append(element('summary', '', module.title));

      const list = element('ol');
      for (const slug of module.lessons) {
        const lesson = lessons.get(slug);
        const item = element('li');
        const lessonLink = link('course-lesson-link', lesson.title, courseUrl(course, lesson));
        if (activeLesson === lesson) lessonLink.setAttribute('aria-current', 'page');
        item.append(lessonLink);
        list.append(item);
      }
      dropdown.append(list);
      sidebar.append(dropdown);
    });

    return sidebar;
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

  function videoSection(lesson) {
    const section = element('section', 'video-section');
    section.append(element('h2', 'video-heading', 'Video walkthrough'));
    if (/^[\w-]{11}$/.test(lesson.videoId)) {
      const iframe = element('iframe', 'video-frame');
      iframe.src = `https://www.youtube-nocookie.com/embed/${lesson.videoId}`;
      iframe.title = `${lesson.title} video walkthrough`;
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

  function courseOverview(course, sequence) {
    const content = element('div', 'course-content');
    const header = element('header', 'course-intro');
    const body = element('section', 'course-lesson-body post-section');
    const totalMinutes = sequence.reduce((total, lesson) => total + lesson.minutes, 0);
    header.append(
      element('p', 'eyebrow', `${lessonCount(sequence)} · ${totalMinutes} min reading`),
      element('h1', '', course.title),
      element('p', '', course.description),
      link('button button-light', 'Start course', courseUrl(course, sequence[0])),
    );
    const outcomes = element('ul');
    outcomes.append(...course.outcomes.map((outcome) => element('li', '', outcome)));
    body.append(element('h2', '', 'What you’ll learn'), outcomes);
    content.append(header, body);
    return content;
  }

  function sequenceNavigation(course, sequence, index) {
    const nav = element('nav', 'lesson-pagination');
    nav.setAttribute('aria-label', 'Lesson sequence');
    const previous = sequence[index - 1];
    const next = sequence[index + 1];
    if (previous) {
      const button = link('button button-outline', `Previous: ${previous.title}`, courseUrl(course, previous));
      button.rel = 'prev';
      nav.append(button);
    } else {
      nav.append(link('button button-outline', 'Course overview', courseUrl(course)));
    }
    if (next) {
      const button = link('button button-light', `Next: ${next.title}`, courseUrl(course, next));
      button.rel = 'next';
      nav.append(button);
    } else {
      nav.append(link('button button-light', 'All courses', './'));
    }
    return nav;
  }

  function renderLesson(course, lesson, sequence) {
    const content = element('article', 'course-content');
    const header = element('header', 'course-intro');
    const index = sequence.indexOf(lesson);

    header.append(
      element('p', 'eyebrow', `Lesson ${index + 1} of ${sequence.length} · ${lesson.minutes} min read`),
      element('h1', '', lesson.title),
      element('p', '', lesson.description),
    );
    if (lesson.problemUrl) header.append(link('back-link problem-link', 'View problem on LeetCode', lesson.problemUrl));

    const body = element('div', 'course-lesson-body');
    body.append(videoSection(lesson));
    for (const section of lesson.sections) {
      const block = element('section', 'post-section');
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
      body.append(block);
    }
    content.append(header, body, sequenceNavigation(course, sequence, index));
    return content;
  }

  function renderCourse(main) {
    const params = new URLSearchParams(window.location.search);
    const course = courses.find((entry) => entry.slug === params.get('course'));
    const lessonSlug = params.get('lesson');
    const sequence = course ? courseLessons(course) : [];
    const lesson = sequence.find((entry) => entry.slug === lessonSlug);

    if (!course || (lessonSlug && !lesson)) {
      document.title = 'Course unavailable · Unemployed Code';
      const missing = element('div', 'wrap missing-post');
      missing.append(
        element('h1', '', course ? 'Lesson unavailable' : 'Course unavailable'),
        link('back-link', course ? `Open ${course.title}` : 'View all courses', course ? courseUrl(course) : './'),
      );
      main.append(missing);
      return;
    }

    const current = lesson || course;
    document.title = `${current.title} · Unemployed Code`;
    document.querySelector('meta[name="description"]').content = current.description;
    const wrap = element('div', 'wrap course-shell');
    wrap.append(courseSidebar(course, lesson), lesson ? renderLesson(course, lesson, sequence) : courseOverview(course, sequence));
    main.append(wrap);
  }

  const catalog = document.querySelector('[data-course-catalog]');
  if (catalog) catalog.append(...courses.map(courseCard));
  const player = document.querySelector('[data-course]');
  if (player) renderCourse(player);
})();
