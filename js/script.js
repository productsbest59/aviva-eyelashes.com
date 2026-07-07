(function () {
  const body = document.body;
  const menuBtn = document.querySelector('[data-menu-open]');
  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-backdrop]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const drawerLinks = document.querySelectorAll('[data-drawer] a');
  const accessBtn = document.querySelector('[data-access-open]');
  const accessPanel = document.querySelector('[data-access-panel]');
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = document.querySelector('[data-lightbox-img]');
  const lightboxClose = document.querySelector('[data-lightbox-close]');
  const galleryItems = document.querySelectorAll('[data-gallery-item]');

  function openMenu() {
    if (!drawer || !backdrop) return;
    drawer.classList.add('active');
    backdrop.classList.add('active');
    body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!drawer || !backdrop) return;
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleAccess() {
    if (!accessPanel) return;
    const isOpen = accessPanel.classList.toggle('active');
    body.classList.toggle('accessibility-open', isOpen);
    accessBtn.setAttribute('aria-expanded', String(isOpen));
  }

  function closeAccess() {
    if (!accessPanel) return;
    accessPanel.classList.remove('active');
    body.classList.remove('accessibility-open');
    accessBtn.setAttribute('aria-expanded', 'false');
  }

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'תמונה מהגלריה';
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('active');
    lightboxImg.src = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', openMenu);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  drawerLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  if (accessBtn) {
    accessBtn.addEventListener('click', toggleAccess);
  }

  document.querySelectorAll('[data-access-action]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const action = btn.getAttribute('data-access-action');

      if (action === 'font-plus') {
        if (body.classList.contains('large-text')) {
          body.classList.remove('large-text');
          body.classList.add('extra-large-text');
        } else {
          body.classList.add('large-text');
        }
      }

      if (action === 'font-reset') {
        body.classList.remove('large-text', 'extra-large-text');
      }

      if (action === 'contrast') {
        body.classList.toggle('high-contrast');
      }

      if (action === 'underline') {
        body.classList.toggle('underline-links');
      }

      if (action === 'reset') {
        body.classList.remove(
          'large-text',
          'extra-large-text',
          'high-contrast',
          'underline-links'
        );
      }

      if (action === 'close') {
        closeAccess();
      }
    });
  });

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img = item.querySelector('img');
      if (!img) return;
      openLightbox(img.src, img.alt);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
      closeAccess();
      closeLightbox();
    }
  });
}());
