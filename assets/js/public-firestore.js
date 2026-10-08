import { db, firestoreSdk, isFirebaseConfigured } from '../../js/firebase-client.js';

const script = document.querySelector('script[data-public-firestore-page]');
const page = script?.dataset.publicFirestorePage;

function safeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value, window.location.href);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = String(text);
  return element;
}

function publishedRecords(snapshot) {
  return snapshot.docs
    .map((document) => ({ id: document.id, ...document.data() }))
    .filter((record) => typeof record.status === 'string'
      ? record.status.toLowerCase() === 'published'
      : record.published === true)
    .sort((left, right) => {
      const leftOrder = Number.isFinite(Number(left.order)) && left.order !== null && left.order !== ''
        ? Number(left.order)
        : Number.MAX_SAFE_INTEGER;
      const rightOrder = Number.isFinite(Number(right.order)) && right.order !== null && right.order !== ''
        ? Number(right.order)
        : Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    });
}

async function readPublished(collectionName) {
  if (!isFirebaseConfigured || !db || !firestoreSdk) return null;
  try {
    const snapshot = await firestoreSdk.getDocs(firestoreSdk.collection(db, collectionName));
    return publishedRecords(snapshot);
  } catch {
    return null;
  }
}

async function readSettings() {
  if (!isFirebaseConfigured || !db || !firestoreSdk) return {};
  try {
    const snapshot = await firestoreSdk.getDocs(firestoreSdk.collection(db, 'site_settings'));
    return Object.fromEntries(snapshot.docs
      .map((document) => document.data())
      .filter((setting) => typeof setting.key === 'string')
      .map((setting) => [setting.key, setting.value]));
  } catch {
    return {};
  }
}

function renderServices(records) {
  const sections = [...document.querySelectorAll('main .service-detail-section')];
  if (!sections.length || !records.length) return;

  const aliases = [
    ['website', 'web'],
    ['cv', 'portfolio'],
    ['photography', 'foto'],
    ['videography', 'video'],
    ['design', 'desain']
  ];
  const usedSections = new Set();

  records.forEach((record, index) => {
    const serviceSlug = `${record.slug || ''} ${record.title || ''}`.toLowerCase();
    let section = sections.find((item, sectionIndex) => {
      if (usedSections.has(item)) return false;
      const sectionId = item.id.toLowerCase();
      const aliasIndex = aliases.findIndex((values) => values.includes(sectionId));
      return aliasIndex >= 0 && aliases[aliasIndex].some((alias) => serviceSlug.includes(alias));
    });
    section ||= sections.find((item) => !usedSections.has(item)) || null;
    if (!section) return;

    usedSections.add(section);
    const title = section.querySelector('.service-detail-copy h2');
    const description = section.querySelector('.service-detail-lead');
    const image = section.querySelector('figure img');
    if (title && record.title) title.textContent = record.title;
    if (description && (record.description || record.shortDescription)) {
      description.textContent = record.description || record.shortDescription;
    }
    const imageUrl = safeUrl(record.image);
    if (image && imageUrl) {
      image.src = imageUrl;
      image.alt = record.title || image.alt;
    }
  });

  sections.forEach((section) => {
    section.hidden = !usedSections.has(section);
  });
  document.querySelectorAll('.services-subnav a[href^="#"]').forEach((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    const shouldHide = !target || target.hidden;
    link.hidden = shouldHide;
    link.style.display = shouldHide ? 'none' : '';
  });
}

function renderPortfolio(records) {
  const host = document.querySelector('.portfolio-list');
  if (!host || !records.length) return;

  const articles = records.map((record) => {
    const article = createElement('article', 'result-card');
    const visual = createElement('div', 'result-visual');
    const imageUrl = safeUrl(record.image || record.thumbnail || record.coverImage);
    if (imageUrl) {
      const image = createElement('img', 'result-image');
      image.src = imageUrl;
      image.alt = record.title || record.name || 'Portfolio SV Creative';
      image.loading = 'lazy';
      visual.append(image);
    }
    const content = createElement('div', 'result-content');
    if (record.category) content.append(createElement('span', 'result-number', record.category));
    content.append(createElement('h2', '', record.title || record.name || ''));
    if (record.description) content.append(createElement('p', '', record.description));
    const projectUrl = safeUrl(record.projectUrl);
    if (projectUrl) {
      const link = createElement('a', 'result-detail-link', 'Lihat proyek');
      link.href = projectUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      content.append(link);
    }
    if (record.date) content.append(createElement('time', '', record.date));
    article.append(visual, content);
    return article;
  });
  host.replaceChildren(...articles);
}

function createResultCard(record, index, isGallery = false) {
  const article = createElement('article', 'portfolio-card result-card');
  article.id = `${isGallery ? 'gallery' : 'design'}-${record.id}`;
  const visual = createElement('div', 'result-visual');
  const imageUrl = safeUrl(record.image || record.logo || record.thumbnail);
  if (imageUrl) {
    const image = createElement('img', 'result-image');
    image.src = imageUrl;
    image.alt = record.title || record.name || 'Karya SV Creative';
    image.loading = 'lazy';
    visual.append(image);
  }
  const content = createElement('div', 'result-content');
  const category = record.category || (isGallery ? 'Galeri' : 'Desain');
  content.append(createElement('span', 'result-number', `${String(index + 1).padStart(2, '0')} · ${category}`));
  content.append(createElement('h2', '', record.title || record.name || ''));
  if (record.description) content.append(createElement('p', '', record.description));
  const projectUrl = safeUrl(record.url || record.projectUrl);
  if (projectUrl) {
    const link = createElement('a', 'result-detail-link', 'Lihat proyek');
    link.href = projectUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    content.append(link);
  }
  article.append(visual, content);
  return article;
}

async function renderDesignsAndGallery() {
  const host = document.querySelector('.results-grid');
  if (!host) return;
  const [designs, gallery] = await Promise.all([
    readPublished('designs'),
    readPublished('gallery')
  ]);
  const designRecords = designs || [];
  const galleryRecords = gallery || [];

  if (!designRecords.length && !galleryRecords.length) return;

  const resultCards = [];
  if (designRecords.length) {
    resultCards.push(...designRecords.map((record, index) => createResultCard(record, index)));
  } else {
    resultCards.push(...host.querySelectorAll('.result-card'));
  }
  galleryRecords.forEach((record, index) => {
    resultCards.push(createResultCard(record, designRecords.length + index, true));
  });
  host.replaceChildren(...resultCards);
}

function renderClients(records) {
  const host = document.querySelector('.client-logo-grid');
  if (!host || !records.length) return;

  const cards = records.map((record) => {
    const article = createElement('article', 'client-logo-card');
    const logoUrl = safeUrl(record.logo || record.image);
    if (logoUrl) {
      const logo = createElement('img', 'client-logo-image');
      logo.src = logoUrl;
      logo.alt = `Logo ${record.name || 'klien'}`;
      logo.loading = 'lazy';
      article.append(logo);
    }
    const clientName = record.name || record.title || '';
    const clientUrl = safeUrl(record.websiteUrl || record.socialUrl);
    if (clientUrl) {
      const link = createElement('a', 'client-logo-name', clientName);
      link.href = clientUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.textDecoration = 'none';
      article.append(link);
    } else {
      article.append(createElement('span', 'client-logo-name', clientName));
    }
    if (record.description) article.title = record.description;
    return article;
  });
  host.replaceChildren(...cards);
}

function renderFaqs(records) {
  const host = document.querySelector('.faq-list');
  if (!host || !records.length) return;

  host.replaceChildren(...records.map((record) => {
    const article = createElement('article', 'faq-item');
    article.append(createElement('h3', '', record.question || ''));
    article.append(createElement('p', '', record.answer || ''));
    return article;
  }));
}

function renderAbout(records) {
  const mainSection = document.querySelector('#who-we-are');
  if (!mainSection || !records.length) return;

  const usedSections = new Set();
  records.forEach((record, index) => {
    const key = String(record.sectionKey || '').replaceAll('_', '-');
    const sectionId = ['about', 'overview', 'intro', 'who-we-are'].includes(key)
      ? 'who-we-are'
      : key;
    let target = document.getElementById(sectionId);
    if (!target || usedSections.has(target)) {
      target = index === 0 && !usedSections.has(mainSection) ? mainSection : null;
    }
    if (!target) return;

    usedSections.add(target);
    const title = target.querySelector('h1, h2');
    const description = target.querySelector('.about-who-copy > p[data-i18n], .about-who-copy > p');
    const image = target.querySelector('figure img');
    if (title && record.title) {
      title.textContent = record.title;
      title.removeAttribute('data-i18n');
    }
    if (description && record.description) {
      description.textContent = record.description;
      description.removeAttribute('data-i18n');
    }
    const imageUrl = safeUrl(record.image);
    if (image && imageUrl) {
      image.src = imageUrl;
      image.alt = record.title || image.alt;
    }
  });
}

function contactValue(contact, settings, key) {
  return contact?.[key] || settings[key] || '';
}

function renderContact(contact, settings) {
  const email = contactValue(contact, settings, 'email');
  if (email) {
    document.querySelectorAll('[data-contact-link="email"]').forEach((link) => {
      link.href = `mailto:${email}`;
    });
    document.querySelectorAll('[data-contact-value="email"]').forEach((value) => {
      value.textContent = email;
    });
  }

  const instagram = contactValue(contact, settings, 'instagram');
  if (instagram) {
    const instagramUrl = instagram.startsWith('http')
      ? safeUrl(instagram)
      : safeUrl(`https://www.instagram.com/${instagram.replace(/^@/, '')}/`);
    if (instagramUrl) {
      document.querySelectorAll('[data-contact-link="instagram"]').forEach((link) => {
        link.href = instagramUrl;
      });
      document.querySelectorAll('[data-contact-value="instagramHandle"]').forEach((value) => {
        const handle = new URL(instagramUrl).pathname.split('/').filter(Boolean).pop();
        value.textContent = handle ? `@${handle}` : instagram;
      });
    }
  }

  const socialLinks = contact?.socialLinks;
  const entries = Array.isArray(socialLinks)
    ? socialLinks.map((item) => [item.platform, item.url])
    : Object.entries(socialLinks || {});
  entries.forEach(([platform, value]) => {
    const url = safeUrl(typeof value === 'string' ? value : value?.url);
    if (!url) return;
    const name = String(platform || '').toLowerCase();
    const match = name.includes('instagram') ? 'Instagram' : name.includes('tiktok') ? 'TikTok' : '';
    if (!match) return;
    document.querySelectorAll(`[data-social-links] a[aria-label*="${match}"]`).forEach((link) => {
      link.href = url;
    });
  });

  const whatsapp = contactValue(contact, settings, 'whatsapp');
  const whatsappNumber = String(whatsapp || '').replace(/\D/g, '');
  if (whatsappNumber.length >= 8) {
    document.querySelectorAll('[data-whatsapp]').forEach((button) => {
      button.dataset.whatsappNumber = whatsappNumber;
    });
  }
}

async function renderContactPage() {
  const [contacts, settings] = await Promise.all([
    readPublished('contact'),
    readSettings()
  ]);
  renderContact(contacts?.[0] || null, settings);
}

async function hydratePublicPage() {
  if (!page || !isFirebaseConfigured || !db || !firestoreSdk) return;

  if (page === 'services') {
    const records = await readPublished('services');
    if (records?.length) renderServices(records);
  } else if (page === 'portfolio') {
    const records = await readPublished('portfolio');
    if (records?.length) renderPortfolio(records);
  } else if (page === 'results') {
    await renderDesignsAndGallery();
  } else if (page === 'clients') {
    const records = await readPublished('clients');
    if (records?.length) renderClients(records);
  } else if (page === 'faq') {
    const records = await readPublished('faq');
    if (records?.length) renderFaqs(records);
  } else if (page === 'about') {
    const records = await readPublished('about');
    if (records?.length) renderAbout(records);
  } else if (page === 'contact') {
    await renderContactPage();
  }
}

function start() {
  hydratePublicPage().catch(() => {});
}

if (document.readyState === 'complete') {
  start();
} else {
  document.addEventListener('DOMContentLoaded', start, { once: true });
}
