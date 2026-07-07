const menuButton = document.querySelector('.menu-button');
const siteMenu = document.querySelector('.site-menu');
const accessButton = document.querySelector('.access-tab');
const accessPanel = document.querySelector('.access-panel');
const galleryButtons = Array.from(document.querySelectorAll('.gallery-grid button'));
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox img');
const closeLightbox = document.querySelector('.lightbox-close');
const prevLightbox = document.querySelector('.lightbox-prev');
const nextLightbox = document.querySelector('.lightbox-next');

let currentGallery = [];
let currentIndex = 0;

if (menuButton && siteMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = siteMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  siteMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteMenu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

if (accessButton && accessPanel) {
  accessButton.addEventListener('click', () => {
    const isOpen = accessPanel.classList.toggle('open');
    accessButton.setAttribute('aria-expanded', String(isOpen));
  });
}

function openLightbox(button) {
  const grid = button.closest('.gallery-grid');
  currentGallery = Array.from(grid.querySelectorAll('button'));
  currentIndex = currentGallery.indexOf(button);
  updateLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function updateLightbox() {
  const button = currentGallery[currentIndex];
  const image = button.querySelector('img');
  lightboxImage.src = button.dataset.src;
  lightboxImage.alt = image.alt || '';
}

function moveLightbox(direction) {
  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = currentGallery.length - 1;
  }

  if (currentIndex >= currentGallery.length) {
    currentIndex = 0;
  }

  updateLightbox();
}

function hideLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
}

galleryButtons.forEach((button) => {
  button.addEventListener('click', () => openLightbox(button));
});

if (closeLightbox) {
  closeLightbox.addEventListener('click', hideLightbox);
}

if (prevLightbox) {
  prevLightbox.addEventListener('click', () => moveLightbox(-1));
}

if (nextLightbox) {
  nextLightbox.addEventListener('click', () => moveLightbox(1));
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      hideLightbox();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (!lightbox || !lightbox.classList.contains('open')) {
    return;
  }

  if (event.key === 'Escape') {
    hideLightbox();
  }

  if (event.key === 'ArrowLeft') {
    moveLightbox(-1);
  }

  if (event.key === 'ArrowRight') {
    moveLightbox(1);
  }
});

document.querySelectorAll('[data-access]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.access;

    if (action === 'increase') {
      document.body.classList.remove('access-small');
      document.body.classList.toggle('access-large');
    }

    if (action === 'decrease') {
      document.body.classList.remove('access-large');
      document.body.classList.toggle('access-small');
    }

    if (action === 'contrast') {
      document.body.classList.toggle('access-contrast');
    }

    if (action === 'links') {
      document.body.classList.toggle('access-links');
    }

    if (action === 'reset') {
      document.body.classList.remove(
        'access-large',
        'access-small',
        'access-contrast',
        'access-links'
      );
    }
  });
});
