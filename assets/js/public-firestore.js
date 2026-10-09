import { db, firebaseSdkError, firestoreSdk, isFirebaseConfigured } from '../../js/firebase-client.js';

const script = document.querySelector('script[data-public-firestore-page]');
const page = script?.dataset.publicFirestorePage;
const unsubscribeListeners = [];
const homeServiceTemplates = [...document.querySelectorAll('#services .service-grid .service-card')]
  .map((card) => card.cloneNode(true));
const publicStatusValues = ['published', 'Published', 'PUBLISHED', 'true', 'True', 'TRUE', true];
const publicPublishedValues = [true, 'true', 'True', 'TRUE', 'published', 'Published', 'PUBLISHED'];
const publicSettingKeys = ['email', 'instagram', 'whatsapp'];
let listenersStarted = false;

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

function publishedRecords(snapshots) {
  const recordsById = new Map();
  snapshots.forEach((snapshot) => snapshot.docs.forEach((document) => {
    recordsById.set(document.id, { id: document.id, ...document.data() });
  }));
  return [...recordsById.values()]
    .filter((record) => {
      if (typeof record.status === 'string' && record.status.trim()) {
        return ['published', 'true'].includes(record.status.trim().toLowerCase());
      }
      return record.status === true || record.published === true
        || (typeof record.published === 'string'
          && ['published', 'true'].includes(record.published.trim().toLowerCase()));
    })
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

function showHostState(host, message, busy = false) {
  if (!host) return;
  host.setAttribute('aria-busy', String(busy));
  host.replaceChildren(createElement('p', 'public-content-state', message));
}

function showSiblingState(anchor, message) {
  if (!anchor) return;
  anchor.parentElement.querySelectorAll(':scope > .public-content-state').forEach((item) => item.remove());
  anchor.insertAdjacentElement('afterend', createElement('p', 'public-content-state', message));
}

function subscribePublishedRecords(collectionName, onData, onError) {
  const localUnsubscribers = [];
  try {
    const collectionRef = firestoreSdk.collection(db, collectionName);
    const queries = [
      firestoreSdk.query(collectionRef, firestoreSdk.where('status', 'in', publicStatusValues)),
      firestoreSdk.query(
        collectionRef,
        firestoreSdk.where('status', '==', null),
        firestoreSdk.where('published', 'in', publicPublishedValues)
      )
    ];
    const snapshots = new Map();
    const failedQueries = new Set();
    console.info('[Firestore] Attaching publication listeners.', {
      collection: collectionName,
      queryCount: queries.length
    });

    queries.forEach((query, index) => {
      const unsubscribe = firestoreSdk.onSnapshot(
        query,
        (snapshot) => {
          snapshots.set(index, snapshot);
          const records = publishedRecords(snapshots);
          console.info('[Firestore] Listener snapshot received.', {
            collection: collectionName,
            queryIndex: index,
            documentCount: snapshot.size,
            publishedCount: records.length,
            fromCache: snapshot.metadata.fromCache,
            hasPendingWrites: snapshot.metadata.hasPendingWrites
          });
          onData(records);
        },
        (error) => {
          console.error('[Firestore] Listener failed.', {
            collection: collectionName,
            queryIndex: index,
            errorCode: typeof error?.code === 'string' ? error.code : 'unknown'
          });
          failedQueries.add(index);
          if (!snapshots.size && failedQueries.size === queries.length) onError(error);
        }
      );
      localUnsubscribers.push(unsubscribe);
    });
    unsubscribeListeners.push(...localUnsubscribers);
  } catch (error) {
    localUnsubscribers.forEach((unsubscribe) => unsubscribe());
    console.error('[Firestore] Listener setup failed.', {
      collection: collectionName,
      errorCode: typeof error?.code === 'string' ? error.code : 'unknown'
    });
    onError(error);
  }
}

function watchCollection(collectionName, onData, host, label = 'Konten', stateMode = 'host') {
  if (stateMode === 'sibling') showSiblingState(host, 'Memuat konten...');
  else showHostState(host, 'Memuat konten...', true);
  subscribePublishedRecords(collectionName, (records) => {
    if (host && stateMode === 'host') host.setAttribute('aria-busy', 'false');
    onData(records);
  }, () => {
    const message = `${label} gagal dimuat. Periksa koneksi dan izin baca Firestore.`;
    if (stateMode === 'sibling') showSiblingState(host, message);
    else showHostState(host, message);
  });
}

function watchSettings(onData, host) {
  const settings = {};
  const contacts = [];
  let settingsReady = false;
  let contactsReady = false;
  let hasReadError = false;
  const update = () => {
    if (!settingsReady || !contactsReady) return;
    onData(contacts[0] || null, settings);
    if (!hasReadError) {
      host.parentElement.querySelectorAll(':scope > .public-content-state').forEach((item) => item.remove());
    }
  };
  subscribePublishedRecords('contact', (records) => {
    contacts.splice(0, contacts.length, ...records);
    contactsReady = true;
    update();
  }, () => {
    hasReadError = true;
    contactsReady = true;
    update();
    showSiblingState(host, 'Informasi kontak tidak dapat dimuat. Periksa koneksi dan izin baca Firestore.');
  });

  console.info('[Firestore] Attaching settings listener.', { collection: 'site_settings' });
  try {
    const settingsQuery = firestoreSdk.query(
      firestoreSdk.collection(db, 'site_settings'),
      firestoreSdk.where('key', 'in', publicSettingKeys)
    );
    const unsubscribe = firestoreSdk.onSnapshot(settingsQuery, (snapshot) => {
      Object.keys(settings).forEach((key) => delete settings[key]);
      snapshot.docs.forEach((document) => {
        const setting = document.data();
        if (typeof setting.key === 'string') settings[setting.key] = setting.value;
      });
      settingsReady = true;
      console.info('[Firestore] Settings snapshot received.', {
        collection: 'site_settings',
        documentCount: snapshot.size,
        fromCache: snapshot.metadata.fromCache,
        hasPendingWrites: snapshot.metadata.hasPendingWrites
      });
      update();
    }, (error) => {
      console.error('[Firestore] Settings listener failed.', {
        collection: 'site_settings',
        errorCode: typeof error?.code === 'string' ? error.code : 'unknown'
      });
      hasReadError = true;
      settingsReady = true;
      update();
      showSiblingState(host, 'Informasi kontak tidak dapat dimuat. Periksa koneksi dan izin baca Firestore.');
    });
    unsubscribeListeners.push(unsubscribe);
  } catch (error) {
    console.error('[Firestore] Settings listener setup failed.', {
      collection: 'site_settings',
      errorCode: typeof error?.code === 'string' ? error.code : 'unknown'
    });
    hasReadError = true;
    settingsReady = true;
    update();
    showSiblingState(host, 'Informasi kontak tidak dapat dimuat. Periksa koneksi dan izin baca Firestore.');
  }
}

function renderServices(records, host = null) {
  const sections = [...document.querySelectorAll('main .service-detail-section')];
  if (!sections.length) return;

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
    let section = sections.find((item) => {
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
  if (host) {
    host.setAttribute('aria-busy', 'false');
    if (!usedSections.size) showSiblingState(host, 'Belum ada layanan yang dipublikasikan.');
    else host.parentElement.querySelectorAll(':scope > .public-content-state').forEach((item) => item.remove());
  }
}

function renderHomeServices(records) {
  const host = document.querySelector('#services .service-grid');
  if (!host) return;
  const cards = homeServiceTemplates.map((card) => card.cloneNode(true));
  if (!records.length) {
    showHostState(host, 'Belum ada layanan yang dipublikasikan.');
    return;
  }

  const aliases = [
    ['website', 'web'],
    ['cv', 'portfolio'],
    ['photography', 'foto'],
    ['videography', 'video'],
    ['design', 'desain']
  ];
  const usedCards = new Set();
  records.forEach((record) => {
    const serviceSlug = `${record.slug || ''} ${record.title || ''}`.toLowerCase();
    const card = cards.find((item) => {
      if (usedCards.has(item)) return false;
      const tag = item.querySelector('.tag')?.textContent.toLowerCase() || '';
      const aliasIndex = aliases.findIndex((values) => values.includes(tag));
      return aliasIndex >= 0 && aliases[aliasIndex].some((alias) => serviceSlug.includes(alias));
    }) || cards.find((item) => !usedCards.has(item));
    if (!card) return;
    usedCards.add(card);
    const title = card.querySelector('h3');
    const description = card.querySelector('p');
    if (title && record.title) title.textContent = record.title;
    if (description) description.textContent = record.shortDescription || record.description || '';
  });
  cards.forEach((card) => { card.hidden = !usedCards.has(card); });
  host.replaceChildren(...cards.filter((card) => usedCards.has(card)));
  host.setAttribute('aria-busy', 'false');
}

function renderPortfolio(records) {
  const host = document.querySelector('.portfolio-list');
  if (!host) return;
  if (!records.length) {
    showHostState(host, 'Belum ada karya yang dipublikasikan.');
    return;
  }

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

function renderDesignsAndGallery() {
  const host = document.querySelector('.results-grid');
  if (!host) return;
  const recordsByCollection = { designs: [], gallery: [] };
  return (collectionName, records) => {
    recordsByCollection[collectionName] = records;
    host.setAttribute('aria-busy', 'false');
    const designs = recordsByCollection.designs;
    const gallery = recordsByCollection.gallery;
    const resultCards = [
      ...designs.map((record, index) => createResultCard(record, index)),
      ...gallery.map((record, index) => createResultCard(record, designs.length + index, true))
    ];
    if (!resultCards.length) {
      showHostState(host, 'Belum ada hasil desain atau galeri yang dipublikasikan.');
      return;
    }
    host.replaceChildren(...resultCards);
  };
}

function renderClients(records) {
  const host = document.querySelector('.client-logo-grid');
  if (!host) return;
  if (!records.length) {
    showHostState(host, 'Belum ada klien yang dipublikasikan.');
    return;
  }

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
  if (!host) return;
  if (!records.length) {
    showHostState(host, 'Belum ada pertanyaan yang dipublikasikan.');
    return;
  }

  host.replaceChildren(...records.map((record) => {
    const article = createElement('article', 'faq-item');
    article.append(createElement('h3', '', record.question || ''));
    article.append(createElement('p', '', record.answer || ''));
    return article;
  }));
}

function renderAbout(records) {
  const mainSection = document.querySelector('#who-we-are');
  if (!mainSection) return;
  mainSection.hidden = !records.length;
  if (!records.length) {
    showSiblingState(mainSection, 'Belum ada informasi yang dipublikasikan.');
    return;
  }
  mainSection.parentElement.querySelectorAll(':scope > .public-content-state').forEach((item) => item.remove());

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
    const title = target.querySelector('.about-who-copy h1, .section-head h2, h1, h2, h3');
    const description = target.querySelector('.about-who-copy > p:not(.about-position), .section-head > p, p[data-i18n]');
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
  const value = contact?.[key] ?? settings[key] ?? '';
  return typeof value === 'string' ? value.trim() : '';
}

function renderContact(contact, settings) {
  const email = contactValue(contact, settings, 'email');
  document.querySelectorAll('[data-contact-link="email"]').forEach((link) => {
    link.href = email ? `mailto:${email}` : '#';
  });
  document.querySelectorAll('[data-contact-value="email"]').forEach((value) => {
    value.textContent = email;
  });
  document.querySelectorAll('[data-social-links] a[aria-label*="Email"]').forEach((link) => {
    link.href = email ? `mailto:${email}` : '#';
  });

  ['instagram', 'tiktok'].forEach((platform) => {
    const value = contactValue(contact, settings, platform);
    const url = value
      ? safeUrl(value.startsWith('http') ? value : `https://www.${platform}.com/${value.replace(/^@/, '')}/`)
      : '';
    document.querySelectorAll(`[data-contact-link="${platform}"]`).forEach((link) => {
      link.href = url || '#';
    });
    const socialLabel = platform === 'instagram' ? 'Instagram' : 'TikTok';
    document.querySelectorAll(`[data-social-links] a[aria-label*="${socialLabel}"]`).forEach((link) => {
      link.href = url || '#';
    });
    document.querySelectorAll(`[data-contact-value="${platform}Handle"]`).forEach((element) => {
      const handle = url ? new URL(url).pathname.split('/').filter(Boolean).pop() : '';
      element.textContent = handle ? `@${handle}` : '';
    });
  });

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

function start() {
  if (listenersStarted || !page) return;
  listenersStarted = true;

  if (!isFirebaseConfigured || !db || !firestoreSdk) {
    const message = 'Konten dinamis tidak tersedia. Periksa konfigurasi Firebase.';
    if (page === 'services') showSiblingState(document.querySelector('.services-image-note'), message);
    else if (page === 'about') showSiblingState(document.querySelector('#who-we-are'), message);
    else if (page === 'contact') showSiblingState(document.querySelector('.contact-card-grid'), message);
    else {
      const host = document.querySelector('.portfolio-list, .results-grid, .client-logo-grid, .faq-list, #services .service-grid');
      if (host) showHostState(host, message);
    }
    const reason = !isFirebaseConfigured
      ? 'not-configured'
      : firebaseSdkError
        ? 'sdk-initialization-failed'
        : !db
          ? 'database-unavailable'
          : 'firestore-sdk-unavailable';
    console.error('[Firestore] Public reader unavailable.', { page, reason });
    return;
  }

  if (page === 'services' || page === 'home') {
    const host = page === 'home'
      ? document.querySelector('#services .service-grid')
      : document.querySelector('.services-image-note');
    const render = page === 'home' ? renderHomeServices : (records) => renderServices(records, host);
    watchCollection('services', render, host, 'Layanan', page === 'home' ? 'host' : 'sibling');
    if (page === 'services') {
      document.querySelectorAll('main .service-detail-section').forEach((section) => { section.hidden = true; });
    }
  } else if (page === 'portfolio') {
    watchCollection('portfolio', renderPortfolio, document.querySelector('.portfolio-list'), 'Portofolio');
  } else if (page === 'results') {
    const host = document.querySelector('.results-grid');
    const updateResults = renderDesignsAndGallery();
    showHostState(host, 'Memuat hasil desain...', true);
    watchCollection('designs', (records) => updateResults('designs', records), host, 'Hasil desain');
    watchCollection('gallery', (records) => updateResults('gallery', records), host, 'Galeri');
  } else if (page === 'clients') {
    watchCollection('clients', renderClients, document.querySelector('.client-logo-grid'), 'Klien');
  } else if (page === 'faq') {
    watchCollection('faq', renderFaqs, document.querySelector('.faq-list'), 'FAQ');
  } else if (page === 'about') {
    const host = document.querySelector('#who-we-are');
    watchCollection('about', renderAbout, host, 'Informasi tentang', 'sibling');
    watchCollection('clients', renderClients, document.querySelector('.client-logo-grid'), 'Klien');
  } else if (page === 'contact') {
    const host = document.querySelector('.contact-card-grid');
    watchSettings(renderContact, host);
    showSiblingState(host, 'Memuat informasi kontak...');
  }
}

if (document.readyState === 'complete') {
  start();
} else {
  document.addEventListener('DOMContentLoaded', start, { once: true });
}

window.addEventListener('pagehide', () => {
  unsubscribeListeners.splice(0).forEach((unsubscribe) => unsubscribe());
  listenersStarted = false;
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) start();
});
