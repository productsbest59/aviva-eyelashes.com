const menuButton = document.querySelector('.menu-button');
const siteMenu = document.querySelector('.site-menu');
const accessButton = document.querySelector('.access-tab');
const accessPanel = document.querySelector('.access-panel');
const accessClose = document.querySelector('.access-close');
const galleryButtons = Array.from(document.querySelectorAll('.gallery-grid button'));
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox img');
const closeLightbox = document.querySelector('.lightbox-close');
const prevLightbox = document.querySelector('.lightbox-prev');
const nextLightbox = document.querySelector('.lightbox-next');

const accessClasses = [
  'access-large',
  'access-small',
  'access-contrast',
  'access-light',
  'access-links',
  'access-spacing',
  'access-motion'
];

let currentGallery = [];
let currentIndex = 0;

function closeMenu() {
  if (!siteMenu || !menuButton) {
    return;
  }

  siteMenu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}

if (menuButton && siteMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = siteMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  siteMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

function openAccess() {
  if (!accessPanel || !accessButton) {
    return;
  }

  accessPanel.classList.add('open');
  accessPanel.setAttribute('aria-hidden', 'false');
  accessButton.setAttribute('aria-expanded', 'true');
}

function closeAccess() {
  if (!accessPanel || !accessButton) {
    return;
  }

  accessPanel.classList.remove('open');
  accessPanel.setAttribute('aria-hidden', 'true');
  accessButton.setAttribute('aria-expanded', 'false');
}

if (accessButton && accessPanel) {
  accessButton.addEventListener('click', () => {
    if (accessPanel.classList.contains('open')) {
      closeAccess();
      return;
    }

    openAccess();
  });
}

if (accessClose) {
  accessClose.addEventListener('click', closeAccess);
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

function saveAccessState() {
  const active = accessClasses.filter((className) => {
    return document.body.classList.contains(className);
  });

  localStorage.setItem('avivaAccess', JSON.stringify(active));
  syncAccessButtons();
}

function loadAccessState() {
  try {
    const saved = JSON.parse(localStorage.getItem('avivaAccess') || '[]');

    if (Array.isArray(saved)) {
      saved.forEach((className) => {
        if (accessClasses.includes(className)) {
          document.body.classList.add(className);
        }
      });
    }
  } catch (error) {
    localStorage.removeItem('avivaAccess');
  }

  syncAccessButtons();
}

function syncAccessButtons() {
  document.querySelectorAll('[data-access]').forEach((button) => {
    const action = button.dataset.access;
    const className = `access-${action}`;
    const isActive = document.body.classList.contains(className);

    button.classList.toggle('is-active', isActive);
  });
}

function resetAccess() {
  document.body.classList.remove(...accessClasses);
  localStorage.removeItem('avivaAccess');
  syncAccessButtons();
}

document.querySelectorAll('[data-access]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.access;

    if (action === 'reset') {
      resetAccess();
      return;
    }

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

    if (action === 'light') {
      document.body.classList.toggle('access-light');
    }

    if (action === 'links') {
      document.body.classList.toggle('access-links');
    }

    if (action === 'spacing') {
      document.body.classList.toggle('access-spacing');
    }

    if (action === 'motion') {
      document.body.classList.toggle('access-motion');
    }

    saveAccessState();
  });
});

document.addEventListener('click', (event) => {
  const target = event.target;

  if (!accessPanel || !accessButton) {
    return;
  }

  const clickedPanel = accessPanel.contains(target);
  const clickedButton = accessButton.contains(target);

  if (!clickedPanel && !clickedButton) {
    closeAccess();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    closeAccess();

    if (lightbox && lightbox.classList.contains('open')) {
      hideLightbox();
    }
  }

  if (!lightbox || !lightbox.classList.contains('open')) {
    return;
  }

  if (event.key === 'ArrowLeft') {
    moveLightbox(-1);
  }

  if (event.key === 'ArrowRight') {
    moveLightbox(1);
  }
});

loadAccessState();


const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const status = contactForm.querySelector('.form-status');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);

    if (status) {
      status.className = 'form-status';
      status.textContent = '';
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'שולחת...';
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('FormSubmit error');
      }

      contactForm.reset();

      if (status) {
        status.textContent = 'ההודעה נשלחה בהצלחה';
        status.classList.add('is-success');
      }
    } catch (error) {
      if (status) {
        status.textContent = 'אירעה תקלה בשליחה. נסי שוב או שלחי הודעה ב-WhatsApp.';
        status.classList.add('is-error');
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'שליחת הודעה';
      }
    }
  });
}
