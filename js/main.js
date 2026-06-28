(function () {
  'use strict';

  var header = document.getElementById('header');
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  var navLinks = document.querySelectorAll('.nav__link');
  var themeToggle = document.getElementById('themeToggle');
  var scrollProgress = document.getElementById('scrollProgress');
  var projectGrid = document.getElementById('projectGrid');
  var servicesGrid = document.getElementById('servicesGrid');
  var skillsGrid = document.getElementById('skillsGrid');
  var contactForm = document.getElementById('contactForm');
  var projectModal = document.getElementById('projectModal');
  var filterBtns = document.querySelectorAll('.filter-btn');
  var footerTop = document.querySelector('.footer__top');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var data = window.PORTFOLIO_DATA || { projects: [], services: [], tools: [] };

  var SERVICE_ICONS = {
    layout: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>',
    smartphone: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>',
    monitor: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    layers: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
  };

  /* Theme */
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
      themeToggle.title = 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme';
    }
    if (window.restartBackground) window.restartBackground();
  }

  if (themeToggle) {
    setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* Scroll */
  function handleScroll() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) scrollProgress.style.width = progress + '%';
    if (header) header.classList.toggle('scrolled', scrollTop > 40);
    updateActiveNav();
  }

  function updateActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var id = section.getAttribute('id');
      var link = document.querySelector('.nav__link[href="#' + id + '"]');
      if (!link) return;
      var top = section.offsetTop;
      var height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (l) {
          l.classList.remove('active');
          l.removeAttribute('aria-current');
        });
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* Mobile Nav */
  function setNavOpen(open) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      setNavOpen(!expanded);
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setNavOpen(false);
      });
    });

    document.addEventListener('click', function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        setNavOpen(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        setNavOpen(false);
      }
    });
  }

  /* Reveal */
  var revealObserver = null;

  function observeReveal(el) {
    if (!el || el.classList.contains('visible')) return;
    if (prefersReducedMotion || !revealObserver) {
      el.classList.add('visible');
      return;
    }
    revealObserver.observe(el);
  }

  if (!prefersReducedMotion) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  }

  document.querySelectorAll('.reveal').forEach(observeReveal);

  /* Render Services */
  if (servicesGrid && data.services) {
    servicesGrid.innerHTML = data.services.map(function (s) {
      return '<article class="service-card reveal">' +
        '<div class="service-card__icon">' + (SERVICE_ICONS[s.icon] || '') + '</div>' +
        '<h3 class="service-card__title">' + s.title + '</h3>' +
        '</article>';
    }).join('');
    servicesGrid.querySelectorAll('.reveal').forEach(observeReveal);
  }

  /* Render Skills with logos */
  if (skillsGrid && data.tools) {
    skillsGrid.innerHTML = data.tools.map(function (tool, index) {
      var item = typeof tool === 'string' ? { name: tool, icon: '' } : tool;
      var iconSrc = item.icon ? encodeURI(item.icon) : '';
      var iconHtml = iconSrc
        ? '<img src="' + iconSrc + '" alt="' + item.name + '" width="64" height="64" loading="lazy" decoding="async">'
        : '<span class="skill-card__fallback">' + item.name.charAt(0) + '</span>';

      return '<div class="skill-card reveal" style="--skill-delay:' + (index * 70) + 'ms" title="' + item.name + '">' +
        '<div class="skill-card__inner">' +
        '<span class="skill-card__shine" aria-hidden="true"></span>' +
        iconHtml +
        '<span class="skill-card__name">' + item.name + '</span>' +
        '</div></div>';
    }).join('');

    skillsGrid.querySelectorAll('.skill-card.reveal').forEach(observeReveal);
  }

  /* Render Projects */
  function getPlaceholderHtml(project) {
    if (project.placeholder === 'facilgo-mobile') {
      return '<div class="project-card__placeholder project-card__placeholder--facilgo-mobile">' +
        '<div class="phone-mockup" aria-hidden="true">' +
        '<div class="phone-mockup__device">' +
        '<div class="phone-mockup__notch"></div>' +
        '<div class="phone-mockup__screen">' +
        '<div class="phone-mockup__app-bar"><span></span><strong>FacilGo</strong><span></span></div>' +
        '<div class="phone-mockup__hero">Inspection #2847</div>' +
        '<div class="phone-mockup__row"><span class="phone-mockup__dot phone-mockup__dot--green"></span>Work Order Active</div>' +
        '<div class="phone-mockup__row"><span class="phone-mockup__dot phone-mockup__dot--amber"></span>Task Pending Review</div>' +
        '<div class="phone-mockup__cards">' +
        '<div class="phone-mockup__card"></div><div class="phone-mockup__card"></div>' +
        '</div>' +
        '<div class="phone-mockup__cta">Update Status</div>' +
        '</div></div></div></div>';
    }

    if (project.placeholder === 'facilgo-web') {
      return '<div class="project-card__placeholder project-card__placeholder--facilgo-web">' +
        '<div class="browser-mockup" aria-hidden="true">' +
        '<div class="browser-mockup__bar"><span></span><span></span><span></span></div>' +
        '<div class="browser-mockup__screen">' +
        '<div class="browser-mockup__sidebar"></div>' +
        '<div class="browser-mockup__main">' +
        '<div class="browser-mockup__line browser-mockup__line--lg"></div>' +
        '<div class="browser-mockup__line"></div><div class="browser-mockup__line"></div>' +
        '<div class="browser-mockup__grid"><span></span><span></span><span></span></div>' +
        '</div></div></div></div>';
    }

    return '<div class="project-card__placeholder project-card__placeholder--default">' +
      '<div class="project-card__placeholder-inner">' +
      '<svg class="project-card__placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>' +
      '<div class="project-card__placeholder-label">' + project.title.split('—')[0].trim() + '</div>' +
      '</div></div>';
  }

  function renderProjects(filter) {
    if (!projectGrid) return;

    var html = data.projects.map(function (p) {
      var cats = p.category.join(' ');
      var tags = p.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
      var hidden = filter !== 'all' && p.category.indexOf(filter) === -1;

      var imageHtml;
      if (p.image) {
        imageHtml = '<img class="project-card__image" src="' + p.image + '" alt="' + p.title + ' UI design screenshot" loading="lazy" width="400" height="250">';
      } else {
        imageHtml = getPlaceholderHtml(p);
      }

      return '<article class="project-card reveal' + (hidden ? ' hidden' : '') + '" data-category="' + cats + '" data-id="' + p.id + '">' +
        '<div class="project-card__image-wrap">' + imageHtml +
        '<div class="project-card__overlay"><span class="project-card__view">View Design <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></div>' +
        '</div>' +
        '<div class="project-card__body">' +
        '<div class="project-card__tags">' + tags + '</div>' +
        '<h3 class="project-card__title">' + p.title + '</h3>' +
        '<p class="project-card__desc">' + p.description + '</p>' +
        '<p class="project-card__company">' + p.company + '</p>' +
        '</div></article>';
    }).join('');

    projectGrid.innerHTML = html;

    projectGrid.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('click', function () {
        openModal(card.getAttribute('data-id'));
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.getAttribute('data-id')); }
      });
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'View project details');

      observeReveal(card);
    });
  }

  renderProjects('all');

  /* Filter */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      projectGrid.querySelectorAll('.project-card').forEach(function (card) {
        var cats = card.getAttribute('data-category') || '';
        if (filter === 'all' || cats.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* Modal */
  function openModal(id) {
    var project = data.projects.find(function (p) { return p.id === id; });
    if (!project || !projectModal) return;

    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalCompany').textContent = project.company;
    document.getElementById('modalDesc').textContent = project.description;
    document.getElementById('modalTags').innerHTML = project.tags.map(function (t) {
      return '<span class="tag">' + t + '</span>';
    }).join('');

    var imageWrap = document.getElementById('modalImage');
    if (project.image) {
      imageWrap.innerHTML = '<img src="' + project.image + '" alt="' + project.title + ' design">';
    } else {
      imageWrap.innerHTML = getPlaceholderHtml(project);
    }

    projectModal.hidden = false;
    document.body.style.overflow = 'hidden';
    projectModal.querySelector('.modal__close').focus();
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.hidden = true;
    document.body.style.overflow = '';
  }

  if (projectModal) {
    projectModal.querySelectorAll('[data-close-modal]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !projectModal.hidden) closeModal();
    });
  }

  /* Contact Form */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');
      var nameError = document.getElementById('nameError');
      var emailError = document.getElementById('emailError');
      var messageError = document.getElementById('messageError');
      var formSuccess = document.getElementById('formSuccess');
      var submitBtn = document.getElementById('submitBtn');
      var valid = true;

      [name, email, message].forEach(function (f) { f.classList.remove('error'); });
      [nameError, emailError, messageError].forEach(function (err) { err.textContent = ''; });
      formSuccess.hidden = true;

      if (!name.value.trim()) { name.classList.add('error'); nameError.textContent = 'Please enter your name.'; valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.classList.add('error'); emailError.textContent = 'Please enter a valid email.'; valid = false; }
      if (!message.value.trim()) { message.classList.add('error'); messageError.textContent = 'Please enter a message.'; valid = false; }

      if (!valid) {
        var first = contactForm.querySelector('.error');
        if (first) first.focus();
        return;
      }

      submitBtn.disabled = true;
      var subject = encodeURIComponent('Portfolio Inquiry from ' + name.value.trim());
      var body = encodeURIComponent('Name: ' + name.value.trim() + '\nEmail: ' + email.value.trim() + '\n\n' + message.value.trim());
      window.location.href = 'mailto:rajeswari.chappidi2320@gmail.com?subject=' + subject + '&body=' + body;

      formSuccess.hidden = false;
      submitBtn.disabled = false;
      contactForm.reset();
    });
  }

  if (footerTop) {
    footerTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();
