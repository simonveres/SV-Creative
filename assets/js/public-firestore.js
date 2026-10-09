import { db, firebaseSdkError, firestoreSdk, isFirebaseConfigured } from '../../js/firebase-client.js';

const script = document.querySelector('script[data-public-firestore-page]');
const homeServiceTemplates = [...document.querySelectorAll('#services .service-grid .service-card')]
  .map((card) => card.cloneNode(true));
const publicStatusValues = ['published', 'Published', 'PUBLISHED', 'true', 'True', 'TRUE', true];
const publicPublishedValues = [true, 'true', 'True', 'TRUE', 'published', 'Published', 'PUBLISHED'];
const publicSettingKeys = ['email', 'instagram', 'tiktok', 'whatsapp'];
const servicePageAliases = {
  'service-website': ['website', 'web'],
  'service-web-portfolio': ['web-portfolio', 'web-portofolio'],
  'service-cv-portfolio': ['cv-portfolio', 'cv'],
  'service-photography': ['photography', 'foto'],
  'service-videography': ['videography', 'video'],
  'service-design': ['design', 'desain'],
  'result-website': ['website', 'web'],
  'result-web-portfolio': ['web-portfolio', 'web-portofolio'],
  'result-cv-portfolio': ['cv-portfolio', 'cv'],
  'result-photography': ['photography', 'foto'],
  'result-videography': ['videography', 'video'],
  'result-design': ['design', 'desain']
};
const publicListConfigs = {
  'home-proof': { page: 'home', selector: '.proof-list', type: 'text' },
  'home-benefits': { page: 'home', selector: '.check-list', type: 'text' },
  'home-highlights': { page: 'home', selector: '.visual-box', type: 'mini-card' },
  'home-audiences': { page: 'home', selector: '#clients .client-grid', type: 'card' },
  'services-website-facts': { page: 'services', selector: '#website .service-detail-facts ul', type: 'text' },
  'services-cv-facts': { page: 'services', selector: '#cv .service-detail-facts ul', type: 'text' },
  'services-photography-facts': { page: 'services', selector: '#photography .service-detail-facts ul', type: 'text' },
  'services-videography-facts': { page: 'services', selector: '#videography .service-detail-facts ul', type: 'text' },
  'services-design-facts': { page: 'services', selector: '#design .service-detail-facts ul', type: 'text' },
  'service-website-facts-primary': { page: 'service-website', selector: '.service-detail-grid:not(.service-detail-grid--reverse) .service-detail-facts ul', type: 'text' },
  'service-website-facts-secondary': { page: 'service-website', selector: '.service-detail-grid--reverse .service-detail-facts ul', type: 'text' },
  'service-web-portfolio-facts-primary': { page: 'service-web-portfolio', selector: '.service-detail-grid:not(.service-detail-grid--reverse) .service-detail-facts ul', type: 'text' },
  'service-web-portfolio-facts-secondary': { page: 'service-web-portfolio', selector: '.service-detail-grid--reverse .service-detail-facts ul', type: 'text' },
  'service-cv-portfolio-facts-primary': { page: 'service-cv-portfolio', selector: '.service-detail-grid .service-detail-facts ul', type: 'text' },
  'service-photography-facts-primary': { page: 'service-photography', selector: '.service-detail-grid:not(.service-detail-grid--reverse) .service-detail-facts ul', type: 'text' },
  'service-photography-facts-secondary': { page: 'service-photography', selector: '.service-detail-grid--reverse .service-detail-facts ul', type: 'text' },
  'service-videography-facts-primary': { page: 'service-videography', selector: '.service-detail-grid:not(.service-detail-grid--reverse) .service-detail-facts ul', type: 'text' },
  'service-videography-facts-secondary': { page: 'service-videography', selector: '.service-detail-grid--reverse .service-detail-facts ul', type: 'text' },
  'service-design-facts-primary': { page: 'service-design', selector: '.service-detail-grid:not(.service-detail-grid--reverse) .service-detail-facts ul', type: 'text' },
  'service-design-facts-secondary': { page: 'service-design', selector: '.service-detail-grid--reverse .service-detail-facts ul', type: 'text' },
  'result-website-facts': { page: 'result-website', selector: '.service-detail-copy .service-detail-facts ul', type: 'text' },
  'result-web-portfolio-facts': { page: 'result-web-portfolio', selector: '.service-detail-copy .service-detail-facts ul', type: 'text' },
  'result-cv-portfolio-facts': { page: 'result-cv-portfolio', selector: '.service-detail-copy .service-detail-facts ul', type: 'text' },
  'result-photography-facts': { page: 'result-photography', selector: '.service-detail-copy .service-detail-facts ul', type: 'text' },
  'result-videography-facts': { page: 'result-videography', selector: '.service-detail-copy .service-detail-facts ul', type: 'text' },
  'result-design-facts': { page: 'result-design', selector: '.service-detail-copy .service-detail-facts ul', type: 'text' },
  'about-story': { page: 'about', selector: '.story-timeline', type: 'timeline' },
  'about-mission': { page: 'about', selector: '.mission-list', type: 'text' },
  'about-capabilities': { page: 'about', selector: '.about-service-grid', type: 'capability' },
  'about-approach': { page: 'about', selector: '.approach-timeline', type: 'timeline' },
  'about-reasons': { page: 'about', selector: '.about-why-grid', type: 'card' }
};
let listenersStarted = false;
let pageCopyRecords = [];
const contactFallbackHrefs = new WeakMap();
const contactFallbackText = new WeakMap();
const contactFallbackWhatsapp = new WeakMap();
const pageCopyBaseline = new WeakMap();
const pageCopyTargets = new Set();
const aboutTextBaseline = new WeakMap();
const aboutTextTargets = new Set();
const aboutImageBaseline = new WeakMap();
const aboutImageTargets = new Set();
const pageImageBaseline = new WeakMap();
const pageImageTargets = new Set();
const pageLinkHrefBaseline = new WeakMap();
const pageLinkTargets = new Set();
const pageWhatsappBaseline = new WeakMap();
const pageWhatsappTargets = new Set();
const listFallbackTemplates = new WeakMap();
const serviceSectionBaselines = new WeakMap();
const servicePageBaselines = new WeakMap();

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

function rememberListFallback(host) {
  if (!listFallbackTemplates.has(host)) {
    listFallbackTemplates.set(host, [...host.children].map((item) => item.cloneNode(true)));
  }
}

function restoreListFallback(host) {
  rememberListFallback(host);
  host.replaceChildren(...listFallbackTemplates.get(host).map((item) => item.cloneNode(true)));
}

function renderProcessSteps(records, host) {
  if (!host) return;
  rememberListFallback(host);
  if (!records.length) {
    restoreListFallback(host);
    return;
  }

  host.replaceChildren(...records.map((record, index) => {
    const item = createElement('li');
    item.append(createElement('span', '', String(index + 1).padStart(2, '0')));
    const copy = createElement('div');
    copy.append(createElement('h3', '', record.title || ''));
    copy.append(createElement('p', '', record.description || ''));
    item.append(copy);
    return item;
  }));
}

function renderPublicList(records, host, type) {
  if (!host) return;
  rememberListFallback(host);
  if (!records.length) {
    restoreListFallback(host);
    return;
  }

  const fallback = listFallbackTemplates.get(host);
  if (!fallback.length) return;
  host.replaceChildren(...records.map((record, index) => {
    const template = fallback[Math.min(index, fallback.length - 1)];
    const item = template.cloneNode(true);
    if (type === 'text') {
      item.textContent = record.title || '';
    } else if (type === 'mini-card') {
      const title = item.querySelector('strong');
      const description = item.querySelector('span');
      if (title) title.textContent = record.title || '';
      if (description) description.textContent = record.description || '';
    } else if (type === 'timeline') {
      const marker = item.querySelector('.story-marker') || item.querySelector('span');
      const title = item.querySelector('h3');
      const description = item.querySelector('p');
      if (marker) marker.textContent = String(index + 1).padStart(2, '0');
      if (title) title.textContent = record.title || '';
      if (description) description.textContent = record.description || '';
    } else {
      const number = item.querySelector('.icon-wrap, .about-service-number');
      const title = item.querySelector('h3');
      const description = item.querySelector('p');
      if (number) number.textContent = String(index + 1).padStart(2, '0');
      if (title) title.textContent = record.title || '';
      if (description) description.textContent = record.description || '';
      if (type === 'capability') {
        const list = item.querySelector('ul');
        if (list) {
          const values = String(record.items || '').split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
          list.replaceChildren(...values.map((value) => createElement('li', '', value)));
        }
        const link = item.querySelector('.about-service-link');
        const linkUrl = safeUrl(record.linkUrl);
        if (link && linkUrl) {
          link.href = linkUrl;
          const label = link.firstChild;
          if (label?.nodeType === Node.TEXT_NODE && record.linkLabel) label.textContent = `${record.linkLabel} `;
        } else if (link) {
          link.hidden = true;
          link.style.display = 'none';
        }
      }
    }
    return item;
  }));
}

function renderPublicLists(records) {
  Object.entries(publicListConfigs).forEach(([listKey, config]) => {
    if (config.page !== page) return;
    const host = document.querySelector(config.selector);
    if (!host) return;
    renderPublicList(records.filter((record) => record.page === page
      && record.contentType === 'public-list-item' && record.listKey === listKey), host, config.type);
  });
}

function renderServiceDetails(records, mainSection, aliases) {
  let baseline = servicePageBaselines.get(mainSection);
  if (!baseline) {
    baseline = {
      title: mainSection.querySelector('.page-hero h1'),
      intro: mainSection.querySelector('.page-hero p'),
      detailTitle: mainSection.querySelector('.service-detail-copy h2'),
      description: mainSection.querySelector('.service-detail-lead'),
      image: mainSection.querySelector('.service-detail-visual img')
    };
    baseline.text = Object.fromEntries(['title', 'intro', 'detailTitle', 'description']
      .filter((key) => baseline[key])
      .map((key) => [key, baseline[key].textContent]));
    if (baseline.image) baseline.imageData = { src: baseline.image.getAttribute('src'), alt: baseline.image.alt };
    servicePageBaselines.set(mainSection, baseline);
  }
  Object.entries(baseline.text).forEach(([key, value]) => { baseline[key].textContent = value; });
  if (baseline.image && baseline.imageData) {
    if (baseline.imageData.src) baseline.image.setAttribute('src', baseline.imageData.src);
    baseline.image.alt = baseline.imageData.alt;
  }
  mainSection.hidden = false;
  mainSection.style.display = '';
  mainSection.parentElement.querySelectorAll(':scope > .public-content-state').forEach((item) => item.remove());

  const record = records.find((item) => {
    const identity = `${item.slug || ''} ${item.title || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return aliases.some((alias) => identity.includes(alias));
  });
  if (!record) return;

  const { title, intro, detailTitle, description } = baseline;
  if (title && record.title) title.textContent = record.title;
  if (intro && (record.shortDescription || record.description)) {
    intro.textContent = record.shortDescription || record.description;
  }
  if (detailTitle && record.title) detailTitle.textContent = record.title;
  if (description && (record.description || record.shortDescription)) {
    description.textContent = record.description || record.shortDescription;
  }
  const imageUrl = safeUrl(record.image);
  const image = mainSection.querySelector('.service-detail-visual img');
  if (image && imageUrl) {
    image.src = imageUrl;
    image.alt = record.title || image.alt;
  }
  applyPageCopy();
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
  else if (host) {
    rememberListFallback(host);
    host.setAttribute('aria-busy', 'true');
    showSiblingState(host, 'Memuat konten...');
  }
  subscribePublishedRecords(collectionName, (records) => {
    if (host && stateMode === 'host') {
      host.setAttribute('aria-busy', 'false');
      host.parentElement.querySelectorAll(':scope > .public-content-state').forEach((item) => item.remove());
    }
    onData(records);
  }, () => {
    const message = `${label} gagal dimuat. Periksa koneksi dan izin baca Firestore.`;
    if (stateMode === 'sibling') showSiblingState(host, message);
    else if (host) {
      restoreListFallback(host);
      host.setAttribute('aria-busy', 'false');
      showSiblingState(host, message);
    }
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
    if (host && !hasReadError) {
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

  sections.forEach((section) => {
    let baseline = serviceSectionBaselines.get(section);
    if (!baseline) {
      const title = section.querySelector('.service-detail-copy h2');
      const description = section.querySelector('.service-detail-lead');
      const image = section.querySelector('figure img');
      baseline = {
        title,
        titleText: title?.textContent,
        description,
        descriptionText: description?.textContent,
        image,
        imageSrc: image?.getAttribute('src'),
        imageAlt: image?.alt
      };
      serviceSectionBaselines.set(section, baseline);
    }
    if (baseline.title) baseline.title.textContent = baseline.titleText;
    if (baseline.description) baseline.description.textContent = baseline.descriptionText;
    if (baseline.image) {
      if (baseline.imageSrc) baseline.image.setAttribute('src', baseline.imageSrc);
      baseline.image.alt = baseline.imageAlt;
    }
  });

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

  if (host) {
    host.setAttribute('aria-busy', 'false');
    host.parentElement.querySelectorAll(':scope > .public-content-state').forEach((item) => item.remove());
  }
  applyPageCopy();
}

function renderHomeServices(records) {
  const host = document.querySelector('#services .service-grid');
  if (!host) return;
  const cards = homeServiceTemplates.map((card) => card.cloneNode(true));
  if (!records.length) {
    restoreListFallback(host);
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
  host.replaceChildren(...cards);
  host.setAttribute('aria-busy', 'false');
  applyPageCopy();
}

function renderPortfolio(records) {
  const host = document.querySelector('.portfolio-list');
  if (!host) return;
  rememberListFallback(host);
  if (!records.length) {
    restoreListFallback(host);
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

function renderHomePortfolio(records) {
  const host = document.querySelector('#work .portfolio-grid');
  if (!host) return;
  rememberListFallback(host);
  if (!records.length) {
    restoreListFallback(host);
    return;
  }

  const cards = records.map((record) => {
    const article = createElement('article', 'portfolio-card');
    const visual = createElement('div', 'thumb');
    const imageUrl = safeUrl(record.image || record.thumbnail || record.coverImage);
    if (imageUrl) {
      visual.style.backgroundImage = `url("${imageUrl}")`;
      visual.setAttribute('role', 'img');
      visual.setAttribute('aria-label', record.title || 'Portfolio SV Creative');
    }
    const content = createElement('div', 'portfolio-body');
    if (record.category) content.append(createElement('span', 'tag', record.category));
    content.append(createElement('h3', '', record.title || record.name || ''));
    if (record.description) content.append(createElement('p', '', record.description));
    article.append(visual, content);
    return article;
  });
  host.replaceChildren(...cards);
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
  rememberListFallback(host);
  const recordsByCollection = { designs: [], gallery: [] };
  return (collectionName, records) => {
    recordsByCollection[collectionName] = records;
    host.setAttribute('aria-busy', 'false');
    host.parentElement.querySelectorAll(':scope > .public-content-state').forEach((item) => item.remove());
    const designs = recordsByCollection.designs;
    const gallery = recordsByCollection.gallery;
    const resultCards = [
      ...designs.map((record, index) => createResultCard(record, index)),
      ...gallery.map((record, index) => createResultCard(record, designs.length + index, true))
    ];
    if (!resultCards.length) {
      restoreListFallback(host);
      return;
    }
    host.replaceChildren(...resultCards);
  };
}

function renderClients(records) {
  const host = document.querySelector('.client-logo-grid');
  if (!host) return;
  rememberListFallback(host);
  if (!records.length) {
    restoreListFallback(host);
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

function renderFaqs(records, host = document.querySelector('.faq-list')) {
  if (!host) return;
  host.parentElement.querySelectorAll(':scope > .public-content-state').forEach((item) => item.remove());
  rememberListFallback(host);
  if (!records.length) {
    restoreListFallback(host);
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
  aboutTextTargets.forEach((element) => { element.textContent = aboutTextBaseline.get(element); });
  aboutTextTargets.clear();
  aboutImageTargets.forEach((image) => {
    const baseline = aboutImageBaseline.get(image);
    if (baseline.src) image.setAttribute('src', baseline.src);
    image.alt = baseline.alt;
  });
  aboutImageTargets.clear();
  const sectionRecords = records.filter((record) => !record.page);
  mainSection.hidden = false;
  mainSection.style.display = '';
  mainSection.parentElement.querySelectorAll(':scope > .public-content-state').forEach((item) => item.remove());
  if (!sectionRecords.length) return;

  const usedSections = new Set();
  sectionRecords.forEach((record, index) => {
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
      if (!aboutTextBaseline.has(title)) aboutTextBaseline.set(title, title.textContent);
      aboutTextTargets.add(title);
      title.textContent = record.title;
    }
    if (description && record.description) {
      if (!aboutTextBaseline.has(description)) aboutTextBaseline.set(description, description.textContent);
      aboutTextTargets.add(description);
      description.textContent = record.description;
    }
    const imageUrl = safeUrl(record.image);
    if (image && imageUrl) {
      if (!aboutImageBaseline.has(image)) {
        aboutImageBaseline.set(image, { src: image.getAttribute('src'), alt: image.alt });
      }
      aboutImageTargets.add(image);
      image.src = imageUrl;
      image.alt = record.title || image.alt;
    }
  });
}

function applyPageCopy() {
  pageCopyTargets.forEach((element) => {
    element.replaceChildren(...pageCopyBaseline.get(element).map((node) => node.cloneNode(true)));
  });
  pageCopyTargets.clear();
  pageImageTargets.forEach((image) => {
    const baseline = pageImageBaseline.get(image);
    if (baseline.src) image.setAttribute('src', baseline.src);
    image.alt = baseline.alt;
  });
  pageImageTargets.clear();
  pageLinkTargets.forEach((link) => {
    const href = pageLinkHrefBaseline.get(link);
    if (href === null) link.removeAttribute('href');
    else link.setAttribute('href', href);
  });
  pageLinkTargets.clear();
  pageWhatsappTargets.forEach((link) => { link.dataset.whatsapp = pageWhatsappBaseline.get(link); });
  pageWhatsappTargets.clear();
  const isIndonesian = document.documentElement.lang === 'id';
  const applicableRecords = pageCopyRecords
    .filter((record) => (record.page === page || record.page === 'shared')
      && (!record.contentType || record.contentType === 'page-copy'))
  applicableRecords.forEach((record) => {
    const applyText = (element, text = record.title) => {
      if (!pageCopyBaseline.has(element)) {
        pageCopyBaseline.set(element, [...element.childNodes].map((node) => node.cloneNode(true)));
      }
      pageCopyTargets.add(element);
      if (element.children.length) {
        const textNode = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        if (textNode) textNode.textContent = text;
        else element.insertBefore(document.createTextNode(text), element.firstChild);
      } else {
        element.textContent = text;
      }
    };

    if (isIndonesian && record.sectionKey && typeof record.title === 'string' && record.title) {
      const keyedElements = [...document.querySelectorAll('[data-i18n], [id]')]
        .filter((element) => element.dataset.i18n === record.sectionKey || element.id === record.sectionKey);
      if (keyedElements.length) {
        keyedElements.forEach(applyText);
      } else {
        try {
          document.querySelectorAll(record.sectionKey).forEach((element) => {
            if (/^(H1|H2|H3|P|LI|SPAN|A|STRONG|FIGCAPTION|SMALL)$/.test(element.tagName)) applyText(element);
          });
        } catch (error) {
          console.warn('[Firestore] Ignoring invalid page-copy selector.', { page, key: record.sectionKey });
        }
      }
    }

    const imageUrl = safeUrl(record.image);
    if (imageUrl && record.imageSelector) {
      try {
        document.querySelectorAll(record.imageSelector).forEach((image) => {
          if (!(image instanceof HTMLImageElement)) return;
          if (!pageImageBaseline.has(image)) {
            pageImageBaseline.set(image, { src: image.getAttribute('src'), alt: image.alt });
          }
          pageImageTargets.add(image);
          image.src = imageUrl;
          if (record.imageAlt) image.alt = record.imageAlt;
        });
      } catch (error) {
        console.warn('[Firestore] Ignoring invalid page-copy image selector.', { page, key: record.imageSelector });
      }
    }

    const linkUrl = safeUrl(record.linkUrl);
    if (linkUrl && record.linkSelector) {
      try {
        document.querySelectorAll(record.linkSelector).forEach((link) => {
          if (!(link instanceof HTMLAnchorElement)) return;
          if (!pageLinkHrefBaseline.has(link)) pageLinkHrefBaseline.set(link, link.getAttribute('href'));
          pageLinkTargets.add(link);
          link.href = linkUrl;
          if (isIndonesian && record.linkLabel) applyText(link, record.linkLabel);
        });
      } catch (error) {
        console.warn('[Firestore] Ignoring invalid page-copy link selector.', { page, key: record.linkSelector });
      }
    }

    if (record.whatsappSelector && typeof record.whatsappMessage === 'string') {
      try {
        document.querySelectorAll(record.whatsappSelector).forEach((link) => {
          if (!link.hasAttribute('data-whatsapp')) return;
          if (!pageWhatsappBaseline.has(link)) pageWhatsappBaseline.set(link, link.dataset.whatsapp || '');
          pageWhatsappTargets.add(link);
          link.dataset.whatsapp = record.whatsappMessage;
        });
      } catch (error) {
        console.warn('[Firestore] Ignoring invalid WhatsApp selector.', { page, key: record.whatsappSelector });
      }
    }
  });
}

function renderPageCopy(records) {
  pageCopyRecords = records;
  applyPageCopy();
}

function contactValue(contact, settings, key) {
  const directValue = contact?.[key] ?? settings[key];
  if (typeof directValue === 'string' && directValue.trim()) return directValue.trim();
  if (key === 'instagram' || key === 'tiktok') {
    const socialLinks = contact?.socialLinks;
    const entries = Array.isArray(socialLinks)
      ? socialLinks.map((item) => [item?.platform, item?.url])
      : Object.entries(socialLinks || {});
    const match = entries.find(([platform]) => String(platform || '').toLowerCase().includes(key));
    const value = typeof match?.[1] === 'string' ? match[1] : match?.[1]?.url;
    return typeof value === 'string' ? value.trim() : '';
  }
  return '';
}

function renderContact(contact, settings) {
  document.querySelectorAll('[data-contact-link], [data-social-links] a').forEach((link) => {
    if (!contactFallbackHrefs.has(link)) contactFallbackHrefs.set(link, link.getAttribute('href'));
  });
  document.querySelectorAll('[data-contact-value]').forEach((element) => {
    if (!contactFallbackText.has(element)) contactFallbackText.set(element, element.textContent);
  });
  document.querySelectorAll('[data-whatsapp]').forEach((button) => {
    if (!contactFallbackWhatsapp.has(button)) {
      contactFallbackWhatsapp.set(button, button.dataset.whatsappNumber || '');
    }
  });

  const email = contactValue(contact, settings, 'email');
  document.querySelectorAll('[data-contact-link="email"], [data-social-links] a[aria-label*="Email"]')
    .forEach((link) => {
      link.href = email ? `mailto:${email}` : contactFallbackHrefs.get(link) || '#';
    });
  document.querySelectorAll('[data-contact-value="email"]').forEach((value) => {
    value.textContent = email || contactFallbackText.get(value) || '';
  });

  ['instagram', 'tiktok'].forEach((platform) => {
    const value = contactValue(contact, settings, platform);
    const url = value
      ? safeUrl(value.startsWith('http')
        ? value
        : `https://www.${platform}.com/${platform === 'tiktok' ? '@' : ''}${value.replace(/^@/, '')}/`)
      : '';
    document.querySelectorAll(`[data-contact-link="${platform}"]`).forEach((link) => {
      link.href = url || contactFallbackHrefs.get(link) || '#';
    });
    const socialLabel = platform === 'instagram' ? 'Instagram' : 'TikTok';
    document.querySelectorAll(`[data-social-links] a[aria-label*="${socialLabel}"]`).forEach((link) => {
      link.href = url || contactFallbackHrefs.get(link) || '#';
    });
    document.querySelectorAll(`[data-contact-value="${platform}Handle"]`).forEach((element) => {
      const handle = url ? new URL(url).pathname.split('/').filter(Boolean).pop()?.replace(/^@/, '') : '';
      element.textContent = handle ? `@${handle}` : contactFallbackText.get(element) || '';
    });
  });

  const socialLinks = contact?.socialLinks;
  const entries = Array.isArray(socialLinks)
    ? socialLinks.map((item) => [item?.platform, item?.url])
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
  document.querySelectorAll('[data-whatsapp]').forEach((button) => {
    if (whatsappNumber.length >= 8) {
      button.dataset.whatsappNumber = whatsappNumber;
    } else {
      button.dataset.whatsappNumber = contactFallbackWhatsapp.get(button) || '';
      if (!button.dataset.whatsappNumber) delete button.dataset.whatsappNumber;
    }
  });

  const contactDetails = [
    ['address', 'Alamat'],
    ['businessHours', 'Jam operasional']
  ];
  document.querySelectorAll('.contact-card-grid').forEach((grid) => {
    grid.querySelectorAll('[data-dynamic-contact]').forEach((card) => card.remove());
    contactDetails.forEach(([key, label]) => {
      const value = contactValue(contact, settings, key);
      if (!value) return;
      const card = createElement('article', 'contact-card');
      card.dataset.dynamicContact = key;
      card.append(createElement('h3', '', label), createElement('p', 'contact-card-value', value));
      grid.append(card);
    });
  });
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
      if (host) {
        rememberListFallback(host);
        showSiblingState(host, message);
      }
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

  watchSettings(renderContact, document.querySelector('.contact-card-grid'));
  watchCollection('about', (records) => {
    if (page === 'about') renderAbout(records);
    renderPublicLists(records);
    renderPageCopy(records);
    const processList = document.querySelector('.service-process-list');
    if (processList) {
      renderProcessSteps(records.filter((record) => record.page === page
        && record.contentType === 'process'), processList);
    }
  }, null, 'Teks halaman');

  if (servicePageAliases[page]) {
    const mainSection = document.querySelector('main');
    watchCollection('services', (records) => renderServiceDetails(records, mainSection, servicePageAliases[page]),
      mainSection, 'Layanan', 'sibling');
  }

  if (page === 'services' || page === 'home') {
    const host = page === 'home'
      ? document.querySelector('#services .service-grid')
      : document.querySelector('.services-image-note');
    const render = (records) => {
      if (page === 'home') renderHomeServices(records);
      else renderServices(records, host);
      applyPageCopy();
    };
    watchCollection('services', render, host, 'Layanan', page === 'home' ? 'host' : 'sibling');
    if (page === 'home') {
      watchCollection('portfolio', renderHomePortfolio, document.querySelector('#work .portfolio-grid'), 'Portofolio');
    }
  } else if (page === 'portfolio') {
    watchCollection('portfolio', renderPortfolio, document.querySelector('.portfolio-list'), 'Portofolio');
  } else if (page === 'results') {
    const host = document.querySelector('.results-grid');
    const updateResults = renderDesignsAndGallery();
    if (host) {
      rememberListFallback(host);
      host.setAttribute('aria-busy', 'true');
      showSiblingState(host, 'Memuat hasil desain...');
    }
    watchCollection('designs', (records) => updateResults('designs', records), host, 'Hasil desain');
    watchCollection('gallery', (records) => updateResults('gallery', records), host, 'Galeri');
  } else if (page === 'clients') {
    watchCollection('clients', renderClients, document.querySelector('.client-logo-grid'), 'Klien');
  } else if (page === 'faq') {
    const host = document.querySelector('.faq-list');
    watchCollection('faq', (records) => renderFaqs(records.filter((record) => !record.page), host), host, 'FAQ', 'sibling');
  } else if (page === 'about') {
    watchCollection('clients', renderClients, document.querySelector('.client-logo-grid'), 'Klien');
  }

  if (page.startsWith('service-')) {
    const faqHost = document.querySelector('.faq-list');
    if (faqHost) {
      watchCollection('faq', (records) => renderFaqs(
        records.filter((record) => record.page === page),
        faqHost
      ), faqHost, 'FAQ', 'sibling');
    }
  }
}

document.addEventListener('svcreative:language-change', applyPageCopy);

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
