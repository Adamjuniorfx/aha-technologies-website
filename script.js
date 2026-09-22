(function () {
  'use strict';

  const html = document.documentElement;
  const menuToggle = document.getElementById('menuToggle');
  const divisionMenu = document.getElementById('division-menu');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuClose = document.getElementById('menuClose');
  const themeToggle = document.getElementById('themeToggle');

  function setMenu(open) {
    if (!menuToggle || !divisionMenu || !menuOverlay) return;

    divisionMenu.classList.toggle('open', open);
    menuOverlay.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);

    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close divisions menu' : 'Open divisions menu');
    divisionMenu.setAttribute('aria-hidden', String(!open));
    menuOverlay.setAttribute('aria-hidden', String(!open));

    if (open && menuClose) {
      window.setTimeout(() => menuClose.focus(), 50);
    }
  }

  if (menuToggle && divisionMenu) {
    menuToggle.addEventListener('click', function () {
      setMenu(!divisionMenu.classList.contains('open'));
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', function () {
      setMenu(false);
      if (menuToggle) menuToggle.focus();
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', function () {
      setMenu(false);
    });
  }

  if (divisionMenu) {
    divisionMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenu(false);
      });
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && divisionMenu && divisionMenu.classList.contains('open')) {
      setMenu(false);
      if (menuToggle) menuToggle.focus();
    }
  });

  function updateThemeLabel() {
    if (!themeToggle) return;
    const isDark = html.dataset.theme !== 'light';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  let savedTheme = null;
  try {
    savedTheme = window.localStorage.getItem('aha-theme');
  } catch (error) {
    savedTheme = null;
  }

  let preferredLight = false;
  try {
    preferredLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  } catch (error) {
    preferredLight = false;
  }

  html.dataset.theme = savedTheme || (preferredLight ? 'light' : 'dark');
  updateThemeLabel();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem('aha-theme', html.dataset.theme);
      } catch (error) {
        // Theme still works even when storage is unavailable (for example file:// previews).
      }
      updateThemeLabel();
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) { link.classList.remove('active'); });
        const active = navLinks.find(function (link) {
          return link.getAttribute('href') === '#' + entry.target.id;
        });
        if (active) active.classList.add('active');
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }
})();
