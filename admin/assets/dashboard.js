import { db, firestoreSdk, isFirebaseConfigured } from '../../js/firebase-client.js';
import { logoutAdmin, requireAdmin } from '../../js/firebase-admin.js';
import { formatImageFileSize, isCloudinaryImageUrl, uploadImageToCloudinary, validateImageFile } from './cloudinary-upload.js';

const {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
  updateDoc
} = firestoreSdk || {};
const gate = document.querySelector('#admin-gate');
const app = document.querySelector('#admin-app');
const nav = document.querySelector('#admin-nav');
const contentView = document.querySelector('#content-view');
const pageTitle = document.querySelector('#page-title');
const notice = document.querySelector('#admin-notice');
const adminEmail = document.querySelector('#admin-email');
const logoutButton = document.querySelector('#logout-button');
const publicPageRoutes = {
  home: '../index.html',
  portfolio: '../pages/portofolio.html',
  services: '../pages/layanan.html',
  clients: '../pages/klien.html',
  about: '../pages/tentang.html',
  contact: '../pages/kontak.html',
  faq: '../pages/faq.html',
  results: '../pages/hasil-desain.html',
  'service-website': '../pages/website.html',
  'service-web-portfolio': '../pages/web-portofolio.html',
  'service-cv-portfolio': '../pages/cv-portfolio.html',
  'service-photography': '../pages/fotografi.html',
  'service-videography': '../pages/videografi.html',
  'service-design': '../pages/desain-kreatif.html',
  'result-website': '../pages/hasil-desain/website.html',
  'result-web-portfolio': '../pages/hasil-desain/web-portofolio.html',
  'result-cv-portfolio': '../pages/hasil-desain/cv-portfolio.html',
  'result-photography': '../pages/hasil-desain/fotografi.html',
  'result-videography': '../pages/hasil-desain/videografi.html',
  'result-design': '../pages/hasil-desain/desain-kreatif.html'
};
const publicPageDocumentCache = new Map();

const pageCopySections = {
  copy_shared: { label: 'Identitas & Footer', collection: 'about', pageKey: 'shared' },
  copy_home: { label: 'Beranda (teks)', collection: 'about', pageKey: 'home' },
  copy_portfolio: { label: 'Karya (teks)', collection: 'about', pageKey: 'portfolio' },
  copy_services: { label: 'Layanan (teks)', collection: 'about', pageKey: 'services' },
  copy_clients: { label: 'Klien (teks)', collection: 'about', pageKey: 'clients' },
  copy_about: { label: 'Tentang (teks)', collection: 'about', pageKey: 'about' },
  copy_contact: { label: 'Kontak (teks)', collection: 'about', pageKey: 'contact' },
  copy_faq: { label: 'FAQ (teks)', collection: 'about', pageKey: 'faq' },
  copy_results: { label: 'Hasil Desain (teks)', collection: 'about', pageKey: 'results' },
  copy_service_website: { label: 'Layanan / Website', collection: 'about', pageKey: 'service-website' },
  copy_service_web_portfolio: { label: 'Layanan / Web Portofolio', collection: 'about', pageKey: 'service-web-portfolio' },
  copy_service_cv: { label: 'Layanan / CV & Portofolio', collection: 'about', pageKey: 'service-cv-portfolio' },
  copy_service_photography: { label: 'Layanan / Fotografi', collection: 'about', pageKey: 'service-photography' },
  copy_service_videography: { label: 'Layanan / Videografi', collection: 'about', pageKey: 'service-videography' },
  copy_service_design: { label: 'Layanan / Desain Kreatif', collection: 'about', pageKey: 'service-design' },
  copy_result_website: { label: 'Hasil / Website', collection: 'about', pageKey: 'result-website' },
  copy_result_web_portfolio: { label: 'Hasil / Web Portofolio', collection: 'about', pageKey: 'result-web-portfolio' },
  copy_result_cv: { label: 'Hasil / CV & Portofolio', collection: 'about', pageKey: 'result-cv-portfolio' },
  copy_result_photography: { label: 'Hasil / Fotografi', collection: 'about', pageKey: 'result-photography' },
  copy_result_videography: { label: 'Hasil / Videografi', collection: 'about', pageKey: 'result-videography' },
  copy_result_design: { label: 'Hasil / Desain Kreatif', collection: 'about', pageKey: 'result-design' }
};

const processSectionDefinitions = [
  ['services', 'Layanan / Proses Umum', 'services'],
  ['website', 'Proses / Website', 'service-website'],
  ['web_portfolio', 'Proses / Web Portofolio', 'service-web-portfolio'],
  ['cv_portfolio', 'Proses / CV & Portofolio', 'service-cv-portfolio'],
  ['photography', 'Proses / Fotografi', 'service-photography'],
  ['videography', 'Proses / Videografi', 'service-videography'],
  ['design', 'Proses / Desain Kreatif', 'service-design']
];
const processSections = Object.fromEntries(processSectionDefinitions.map(([id, label, pageKey]) => [
  `process_${id}`,
  {
    label,
    collection: 'about',
    pageKey,
    contentType: 'process',
    group: 'Daftar Proses',
    fields: [
      { key: 'title', label: 'Langkah proses', required: true },
      { key: 'description', label: 'Deskripsi langkah', type: 'textarea', required: true, full: true },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'order', label: 'Urutan', type: 'number', required: true }
    ]
  }
]));
const detailFaqDefinitions = [
  ['website', 'FAQ / Website', 'service-website'],
  ['web_portfolio', 'FAQ / Web Portofolio', 'service-web-portfolio'],
  ['cv_portfolio', 'FAQ / CV & Portofolio', 'service-cv-portfolio'],
  ['photography', 'FAQ / Fotografi', 'service-photography'],
  ['videography', 'FAQ / Videografi', 'service-videography'],
  ['design', 'FAQ / Desain Kreatif', 'service-design']
];
const detailFaqSections = Object.fromEntries(detailFaqDefinitions.map(([id, label, pageKey]) => [
  `faq_${id}`,
  {
    label,
    collection: 'faq',
    pageKey,
    contentType: 'detail-faq',
    group: 'FAQ Detail Layanan',
    fields: [
      { key: 'question', label: 'Pertanyaan', required: true },
      { key: 'answer', label: 'Jawaban', type: 'textarea', required: true, full: true },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'order', label: 'Urutan', type: 'number', required: true }
    ]
  }
]));
const publicListDefinitions = [
  ['home-proof', 'Beranda / Poin Layanan', 'home', 'proof-list', 'text'],
  ['home-benefits', 'Beranda / Alasan Memilih', 'home', 'check-list', 'text'],
  ['home-highlights', 'Beranda / Kartu Sorotan', 'home', '.visual-box', 'mini-card'],
  ['home-audiences', 'Beranda / Audiens', 'home', '#clients .client-grid', 'card'],
  ...[
    ['website', 'Website'], ['cv', 'CV & Portofolio'], ['photography', 'Fotografi'],
    ['videography', 'Videografi'], ['design', 'Desain Kreatif']
  ].map(([id, label]) => [
    `services-${id}-facts`, `Layanan / ${label} / Poin`, 'services', `#${id} .service-detail-facts ul`, 'text'
  ]),
  ...[
    ['website', 'Website', true], ['web-portfolio', 'Web Portofolio', true],
    ['cv-portfolio', 'CV & Portofolio', false], ['photography', 'Fotografi', true],
    ['videography', 'Videografi', true], ['design', 'Desain Kreatif', true]
  ].flatMap(([id, label, hasSecondary]) => [
    [`service-${id}-facts-primary`, `Detail Layanan / ${label} / Poin Utama`, `service-${id}`,
      '.service-detail-grid:not(.service-detail-grid--reverse) .service-detail-facts ul', 'text'],
    ...(hasSecondary ? [[`service-${id}-facts-secondary`, `Detail Layanan / ${label} / Poin Tambahan`, `service-${id}`,
      '.service-detail-grid--reverse .service-detail-facts ul', 'text']] : [])
  ]),
  ...[
    ['website', 'Website'], ['web-portfolio', 'Web Portofolio'], ['cv-portfolio', 'CV & Portofolio'],
    ['photography', 'Fotografi'], ['videography', 'Videografi'], ['design', 'Desain Kreatif']
  ].map(([id, label]) => [
    `result-${id}-facts`, `Hasil Desain / ${label} / Poin`, `result-${id}`,
    '.service-detail-copy .service-detail-facts ul', 'text'
  ]),
  ['about-story', 'Tentang / Cerita', 'about', '.story-timeline', 'timeline'],
  ['about-mission', 'Tentang / Misi', 'about', '.mission-list', 'text'],
  ['about-capabilities', 'Tentang / Kapabilitas', 'about', '.about-service-grid', 'capability'],
  ['about-approach', 'Tentang / Pendekatan', 'about', '.approach-timeline', 'timeline'],
  ['about-reasons', 'Tentang / Keunggulan', 'about', '.about-why-grid', 'card']
];
const publicListSections = Object.fromEntries(publicListDefinitions.map(([listKey, label, pageKey, targetSelector, itemType]) => [
  `list_${listKey}`,
  {
    label,
    collection: 'about',
    pageKey,
    listKey,
    targetSelector,
    itemType,
    contentType: 'public-list-item',
    group: pageKey === 'home'
      ? 'Daftar Beranda'
      : pageKey === 'services' || pageKey.startsWith('service-')
        ? 'Poin Layanan'
        : pageKey.startsWith('result-')
          ? 'Poin Hasil Desain'
          : 'Daftar Tentang',
    fields: [
      { key: 'title', label: itemType === 'text' ? 'Teks item' : 'Judul item', required: true },
      ...(itemType === 'text' ? [] : [{ key: 'description', label: 'Deskripsi', type: 'textarea', full: true }]),
      ...(itemType === 'capability' ? [
        { key: 'items', label: 'Poin rincian (satu per baris)', type: 'textarea', full: true },
        { key: 'linkLabel', label: 'Teks tautan' },
        { key: 'linkUrl', label: 'URL tautan' }
      ] : []),
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'order', label: 'Urutan', type: 'number', required: true }
    ]
  }
]));

Object.values(pageCopySections).forEach((section) => {
  section.group = section.pageKey === 'shared'
    ? 'Identitas Website'
    : section.pageKey.startsWith('service-')
    ? 'Subhalaman Layanan'
    : section.pageKey.startsWith('result-')
      ? 'Kategori Hasil Desain'
      : 'Menu Utama';
  section.fields = [
    { key: 'sectionKey', label: 'Kunci teks (data-i18n, ID, atau selector CSS)' },
    { key: 'title', label: 'Teks halaman (Indonesia)', type: 'textarea', full: true },
    { key: 'imageSelector', label: 'Selector gambar (opsional)' },
    { key: 'image', label: 'Gambar halaman', type: 'image-file', full: true },
    { key: 'imageAlt', label: 'Teks alternatif gambar' },
    { key: 'linkSelector', label: 'Selector tautan (opsional)' },
    { key: 'linkUrl', label: 'URL tautan' },
    { key: 'linkLabel', label: 'Teks tautan' },
    { key: 'whatsappSelector', label: 'Selector tombol WhatsApp' },
    { key: 'whatsappMessage', label: 'Pesan tombol WhatsApp', type: 'textarea', full: true },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'order', label: 'Urutan', type: 'number', required: true }
  ];
  section.contentType = 'page-copy';
});

const sections = {
  ...pageCopySections,
  ...processSections,
  ...detailFaqSections,
  ...publicListSections,
  services: {
    label: 'Layanan',
    collection: 'services',
    fields: [
      { key: 'slug', label: 'Slug', required: true },
      { key: 'title', label: 'Nama layanan', required: true },
      { key: 'shortDescription', label: 'Deskripsi singkat', type: 'textarea' },
      { key: 'description', label: 'Deskripsi', type: 'textarea', full: true },
      { key: 'image', label: 'Gambar layanan', type: 'image-file', full: true },
      { key: 'price', label: 'Harga (opsional)', type: 'number', nullable: true },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'order', label: 'Urutan', type: 'number', required: true }
    ]
  },
  portfolio: {
    label: 'Karya',
    collection: 'portfolio',
    fields: [
      { key: 'slug', label: 'Slug', required: true },
      { key: 'title', label: 'Judul', required: true },
      { key: 'category', label: 'Kategori', required: true },
      { key: 'description', label: 'Deskripsi', type: 'textarea', full: true },
      { key: 'image', label: 'Gambar portfolio', type: 'image-file', full: true },
      { key: 'projectUrl', label: 'Link proyek' },
      { key: 'date', label: 'Tanggal proyek', type: 'date' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'order', label: 'Urutan', type: 'number', required: true }
    ]
  },
  designs: {
    label: 'Hasil Desain',
    collection: 'designs',
    fields: [
      { key: 'title', label: 'Judul', required: true },
      { key: 'category', label: 'Kategori', required: true },
      { key: 'description', label: 'Deskripsi', type: 'textarea', full: true },
      { key: 'image', label: 'Gambar hasil desain', type: 'image-file', full: true },
      { key: 'url', label: 'Link hasil' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'order', label: 'Urutan', type: 'number', required: true }
    ]
  },
  clients: {
    label: 'Klien',
    collection: 'clients',
    fields: [
      { key: 'name', label: 'Nama klien', required: true },
      { key: 'logo', label: 'Logo klien', type: 'image-file' },
      { key: 'description', label: 'Deskripsi', type: 'textarea', full: true },
      { key: 'websiteUrl', label: 'Website' },
      { key: 'socialUrl', label: 'Media sosial' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'order', label: 'Urutan', type: 'number', required: true }
    ]
  },
  gallery: {
    label: 'Galeri',
    collection: 'gallery',
    fields: [
      { key: 'title', label: 'Judul', required: true },
      { key: 'image', label: 'Gambar galeri', type: 'image-file', required: true, full: true },
      { key: 'category', label: 'Kategori', required: true },
      { key: 'description', label: 'Deskripsi', type: 'textarea', full: true },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'order', label: 'Urutan', type: 'number', required: true }
    ]
  },
  faq: {
    label: 'FAQ',
    collection: 'faq',
    excludePageContent: true,
    fields: [
      { key: 'question', label: 'Pertanyaan', required: true },
      { key: 'answer', label: 'Jawaban', type: 'textarea', required: true, full: true },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'order', label: 'Urutan', type: 'number', required: true }
    ]
  },
  about: {
    label: 'Tentang',
    collection: 'about',
    excludePageContent: true,
    fields: [
      { key: 'sectionKey', label: 'Kunci bagian', required: true },
      { key: 'title', label: 'Judul', required: true },
      { key: 'description', label: 'Deskripsi', type: 'textarea', full: true },
      { key: 'image', label: 'Gambar bagian tentang', type: 'image-file', full: true },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'order', label: 'Urutan', type: 'number', required: true }
    ]
  },
  contact: {
    label: 'Kontak',
    collection: 'contact',
    fields: [
      { key: 'name', label: 'Nama kontak', required: true },
      { key: 'whatsapp', label: 'WhatsApp' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'instagram', label: 'Instagram' },
      { key: 'tiktok', label: 'TikTok' },
      { key: 'address', label: 'Alamat', type: 'textarea' },
      { key: 'businessHours', label: 'Jam operasional', type: 'textarea' },
      { key: 'socialLinks', label: 'Link sosial media (JSON)', type: 'json', full: true },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'order', label: 'Urutan', type: 'number', required: true }
    ]
  },
  site_settings: {
    label: 'Pengaturan',
    collection: 'site_settings',
    excludePageContent: true,
    fields: [
      { key: 'key', label: 'Key', required: true },
      { key: 'value', label: 'Value (JSON atau teks)', type: 'json-or-text', required: true, full: true }
    ]
  }
};

const menuItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { type: 'group', label: 'Identitas Website' },
  ...Object.entries(pageCopySections)
    .filter(([, section]) => section.group === 'Identitas Website')
    .map(([id, section]) => ({ id, label: section.label })),
  { type: 'group', label: 'Halaman Publik' },
  ...Object.entries(pageCopySections)
    .filter(([, section]) => section.group === 'Menu Utama')
    .map(([id, section]) => ({ id, label: section.label })),
  { type: 'group', label: 'Subhalaman Layanan' },
  ...Object.entries(pageCopySections)
    .filter(([, section]) => section.group === 'Subhalaman Layanan')
    .map(([id, section]) => ({ id, label: section.label })),
  { type: 'group', label: 'Kategori Hasil Desain' },
  ...Object.entries(pageCopySections)
    .filter(([, section]) => section.group === 'Kategori Hasil Desain')
    .map(([id, section]) => ({ id, label: section.label })),
  { type: 'group', label: 'Daftar Proses' },
  ...Object.entries(processSections).map(([id, section]) => ({ id, label: section.label })),
  { type: 'group', label: 'FAQ Detail Layanan' },
  ...Object.entries(detailFaqSections).map(([id, section]) => ({ id, label: section.label })),
  { type: 'group', label: 'Daftar Beranda' },
  ...Object.entries(publicListSections)
    .filter(([, section]) => section.group === 'Daftar Beranda')
    .map(([id, section]) => ({ id, label: section.label })),
  { type: 'group', label: 'Poin Layanan' },
  ...Object.entries(publicListSections)
    .filter(([, section]) => section.group === 'Poin Layanan')
    .map(([id, section]) => ({ id, label: section.label })),
  { type: 'group', label: 'Poin Hasil Desain' },
  ...Object.entries(publicListSections)
    .filter(([, section]) => section.group === 'Poin Hasil Desain')
    .map(([id, section]) => ({ id, label: section.label })),
  { type: 'group', label: 'Daftar Tentang' },
  ...Object.entries(publicListSections)
    .filter(([, section]) => section.group === 'Daftar Tentang')
    .map(([id, section]) => ({ id, label: section.label })),
  { type: 'group', label: 'Daftar dan Pengaturan' },
  ...Object.entries(sections)
    .filter(([, section]) => !section.pageKey)
    .map(([id, section]) => ({ id, label: section.label }))
];
let activeSection = 'dashboard';
let activeRecords = [];
let isSaving = false;
let selectedImageFile = null;
let imagePreviewUrl = '';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function slugify(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getPublicPageDocument(pageKey) {
  if (publicPageDocumentCache.has(pageKey)) return publicPageDocumentCache.get(pageKey);
  const route = publicPageRoutes[pageKey];
  if (!route) throw new Error(`Halaman publik "${pageKey}" tidak terdaftar untuk validasi.`);
  const response = await fetch(new URL(route, window.location.href), { cache: 'no-store' });
  if (!response.ok) throw new Error(`Halaman publik "${pageKey}" tidak dapat dimuat untuk validasi.`);
  const html = await response.text();
  const publicDocument = new DOMParser().parseFromString(html, 'text/html');
  publicPageDocumentCache.set(pageKey, publicDocument);
  return publicDocument;
}

async function validatePublicSelector(pageKey, selector, targetType, label) {
  if (!selector) return;
  const pageKeys = pageKey === 'shared' ? Object.keys(publicPageRoutes) : [pageKey];
  const supportedTextTags = new Set(['H1', 'H2', 'H3', 'P', 'LI', 'SPAN', 'A', 'STRONG', 'FIGCAPTION', 'SMALL']);
  for (const targetPage of pageKeys) {
    const publicDocument = await getPublicPageDocument(targetPage);
    let targets;
    try {
      const keyedTargets = targetType === 'text'
        ? [...publicDocument.querySelectorAll('[data-i18n], [id]')]
          .filter((element) => element.dataset.i18n === selector || element.id === selector)
        : [];
      targets = keyedTargets.length ? keyedTargets : [...publicDocument.querySelectorAll(selector)];
    } catch {
      throw new Error(`Selector ${label} tidak valid pada halaman "${targetPage}".`);
    }
    const validTargets = targets.filter((element) => {
      if (targetType === 'image') return element.tagName === 'IMG';
      if (targetType === 'link') return element.tagName === 'A';
      if (targetType === 'whatsapp') return element.hasAttribute('data-whatsapp');
      return supportedTextTags.has(element.tagName);
    });
    if (!validTargets.length) {
      throw new Error(`Selector ${label} tidak menemukan target yang sesuai pada halaman "${targetPage}".`);
    }
  }
}

function validatePublicUrl(value, label) {
  if (!value) return;
  try {
    const url = new URL(value, window.location.origin);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
  } catch {
    throw new Error(`URL ${label} harus memakai http atau https.`);
  }
}

function clearImageSelection() {
  if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
  imagePreviewUrl = '';
  selectedImageFile = null;
}

function showNotice(message, tone = 'error') {
  notice.textContent = message;
  notice.dataset.tone = tone;
  notice.hidden = !message;
}

function logAdminOperationError(operation, error, collectionName) {
  console.error('[Admin] Firebase operation failed.', {
    operation,
    collection: collectionName,
    errorCode: typeof error?.code === 'string' ? error.code : 'unknown'
  });
}

function renderNavigation() {
  nav.innerHTML = menuItems.map((item) => item.type === 'group'
    ? `<span class="nav-group-label">${escapeHtml(item.label)}</span>`
    : `<button class="nav-button" type="button" data-view="${item.id}"${item.id === activeSection ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</button>`
  ).join('');
}

function formatDate(value) {
  if (!value) return '-';
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date);
}

function recordTitle(record, id) {
  return record.title || record.name || record.question || record.sectionKey || record.key || id;
}

function recordSummary(record) {
  return record.shortDescription || record.description || record.answer || record.excerpt || record.category || '';
}

async function readCollection(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function readSectionRecords(section) {
  return filterSectionRecords(section, await readCollection(section.collection));
}

function filterSectionRecords(section, records) {
  if (section.pageKey) return records.filter((record) => record.page === section.pageKey
    && (!section.contentType || record.contentType === section.contentType)
    && (!section.listKey || record.listKey === section.listKey));
  if (section.excludePageContent) return records.filter((record) => !record.page);
  return records;
}

async function renderOverview() {
  pageTitle.textContent = 'Dashboard';
  contentView.innerHTML = '<p class="loading-line">Memuat ringkasan konten...</p>';
  try {
    const overviewSections = Object.entries(sections).filter(([, section]) => !section.pageKey);
    const collectionNames = [...new Set(overviewSections.map(([, section]) => section.collection))];
    const collectionRecords = new Map(await Promise.all(collectionNames.map(async (name) => [
      name,
      await readCollection(name)
    ])));
    const counts = overviewSections.map(([id, section]) => ({
      id,
      label: section.label,
      count: filterSectionRecords(section, collectionRecords.get(section.collection) || []).length
    }));
    contentView.innerHTML = `
      <div class="page-intro"><div><h2>Ringkasan konten</h2><p>Data tersimpan di Firestore dan ditampilkan pada halaman publik sesuai status publikasi.</p></div></div>
      <div class="stats-grid">${counts.map((item) => `
        <article class="stat-card"><span>${escapeHtml(item.label)}</span><strong>${item.count}</strong></article>
      `).join('')}</div>
      <section class="panel"><h2>Kelola konten</h2><div class="quick-links">${overviewSections.map(([id, item]) => `
        <button class="quick-link" type="button" data-view="${id}">${escapeHtml(item.label)}</button>
      `).join('')}</div></section>
    `;
  } catch (error) {
    logAdminOperationError('load-overview', error);
    contentView.innerHTML = '<div class="panel"><p class="empty-state">Ringkasan belum dapat dimuat. Periksa konfigurasi Firestore dan Security Rules.</p></div>';
  }
}

function renderField(field, value) {
  const currentValue = field.type === 'json' && value !== undefined
    ? JSON.stringify(value, null, 2)
    : value ?? (field.key === 'status' ? 'draft' : field.key === 'order' ? 0 : '');
  const required = field.required ? ' required' : '';
  const full = field.full ? ' full-width' : '';
  let control;

  if (field.type === 'image-file') {
    const hasCurrentImage = Boolean(value);
    const imageRequired = field.required && !hasCurrentImage ? ' required' : '';
    return `<div class="form-field${full}">
      <span class="field-label">${escapeHtml(field.label)}</span>
      <div class="image-upload">
        <input class="file-input" id="field-${field.key}" name="${field.key}" type="file" data-image-upload accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" aria-label="Pilih foto ${escapeHtml(field.label.toLowerCase())}"${imageRequired}>
        <label class="button button-secondary file-picker" for="field-${field.key}">Pilih Foto</label>
        <span class="file-name" data-file-name>${hasCurrentImage ? 'Gambar saat ini akan dipertahankan' : 'Belum ada gambar dipilih'}</span>
        <span class="file-size" data-file-size>${hasCurrentImage ? 'Gambar tersimpan' : ''}</span>
      </div>
      <p class="upload-help">JPG, JPEG, PNG, atau WEBP. Maksimal 5 MB.</p>
      <img class="image-preview" data-image-preview src="${hasCurrentImage ? escapeHtml(value) : ''}" alt="Preview ${escapeHtml(field.label.toLowerCase())}"${hasCurrentImage ? '' : ' hidden'}>
    </div>`;
  }

  if (field.type === 'textarea' || field.type === 'json' || field.type === 'json-or-text') {
    control = `<textarea class="field-input" id="field-${field.key}" name="${field.key}"${required}>${escapeHtml(currentValue)}</textarea>`;
  } else if (field.type === 'status') {
    const selected = currentValue || 'draft';
    control = `<select class="field-input" id="field-${field.key}" name="${field.key}">
      <option value="draft"${selected === 'draft' ? ' selected' : ''}>Draft</option>
      <option value="published"${selected === 'published' ? ' selected' : ''}>Published</option>
      <option value="unpublished"${selected === 'unpublished' ? ' selected' : ''}>Unpublished</option>
    </select>`;
  } else {
    const inputType = field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text';
    const step = inputType === 'number' && field.key === 'price' ? ' step="0.01" min="0"' : inputType === 'number' ? ' step="1" min="0"' : '';
    control = `<input class="field-input" id="field-${field.key}" name="${field.key}" type="${inputType}" value="${escapeHtml(currentValue)}"${step}${required}>`;
  }

  return `<div class="form-field${full}"><label class="field-label" for="field-${field.key}">${escapeHtml(field.label)}</label>${control}</div>`;
}

function renderCollection(sectionId) {
  const section = sections[sectionId];
  activeSection = sectionId;
  pageTitle.textContent = section.label;
  showNotice('');
  renderNavigation();
  contentView.innerHTML = `
    <div class="page-intro">
      <div><h2>${escapeHtml(section.label)}</h2><p>Kelola data, status publikasi, dan urutan tampilan.</p></div>
      <button class="button button-primary" type="button" data-action="add">Tambah data</button>
    </div>
    <div id="editor-host"></div>
    <div id="records-host" class="loading-line">Memuat data...</div>
  `;
  loadRecords(sectionId);
}

async function loadRecords(sectionId) {
  const recordsHost = document.querySelector('#records-host');
  try {
    activeRecords = await readSectionRecords(sections[sectionId]);
    activeRecords.sort((left, right) => Number(left.order || 0) - Number(right.order || 0));
    if (!recordsHost || activeSection !== sectionId) return;

    if (!activeRecords.length) {
      recordsHost.innerHTML = '<div class="table-wrap"><p class="empty-state">Belum ada data. Pilih “Tambah data” untuk membuat dokumen pertama.</p></div>';
      return;
    }

    recordsHost.innerHTML = `
      <div class="table-wrap"><table>
        <thead><tr><th>Konten</th><th>Ringkasan</th><th>Status</th><th>Urutan</th><th>Diubah</th><th>Aksi</th></tr></thead>
        <tbody>${activeRecords.map((record) => `
          <tr>
            <td class="cell-title">${escapeHtml(recordTitle(record, record.id))}</td>
            <td class="cell-summary">${escapeHtml(recordSummary(record))}</td>
            <td><span class="status-pill" data-status="${escapeHtml(record.status || '')}">${escapeHtml(record.status || 'draft')}</span></td>
            <td>${escapeHtml(record.order ?? 0)}</td>
            <td>${escapeHtml(formatDate(record.updatedAt || record.createdAt))}</td>
            <td><div class="row-actions"><button class="button button-secondary" type="button" data-action="edit" data-id="${escapeHtml(record.id)}">Edit</button><button class="button button-danger" type="button" data-action="delete" data-id="${escapeHtml(record.id)}">Hapus</button></div></td>
          </tr>
        `).join('')}</tbody>
      </table></div>
    `;
  } catch (error) {
    logAdminOperationError('load-collection', error, sections[sectionId].collection);
    if (recordsHost) {
      const message = error.code === 'permission-denied'
        ? 'Akses baca ditolak oleh Firestore Security Rules.'
        : error.code === 'failed-precondition'
          ? 'Firestore menolak query. Periksa koleksi, indeks yang diminta, dan Security Rules.'
          : 'Data gagal dimuat. Periksa konfigurasi Firebase, koneksi, dan Security Rules.';
      recordsHost.innerHTML = `<div class="panel"><p class="empty-state">${escapeHtml(message)}</p></div>`;
    }
  }
}

function openEditor(sectionId, record) {
  clearImageSelection();
  const section = sections[sectionId];
  const host = document.querySelector('#editor-host');
  const editing = Boolean(record);
  const imageField = section.fields.find((field) => field.type === 'image-file');
  const fields = section.fields.map((field) => renderField(field, record?.[field.key])).join('');
  host.innerHTML = `
    <section class="panel editor-panel">
      <h2>${editing ? 'Edit data' : 'Tambah data'}</h2>
      <form id="content-form" data-id="${escapeHtml(record?.id || '')}" data-image-field="${escapeHtml(imageField?.key || '')}" data-current-image="${escapeHtml(imageField ? record?.[imageField.key] || '' : '')}">
        ${fields}
        <div class="editor-actions">
          <button class="button button-primary" type="submit">${editing ? 'Simpan perubahan' : 'Simpan'}</button>
          <button class="button button-secondary" type="button" data-action="cancel">Batal</button>
        </div>
      </form>
    </section>
  `;
  if (sectionId === 'services') {
    const slugInput = host.querySelector('[name="slug"]');
    const titleInput = host.querySelector('[name="title"]');
    slugInput.dataset.manual = record?.slug ? 'true' : 'false';
    slugInput.pattern = '[a-z0-9]+(-[a-z0-9]+)*';
    slugInput.title = 'Gunakan huruf kecil, angka, dan tanda hubung.';
    slugInput.autocapitalize = 'none';
    slugInput.spellcheck = false;
    titleInput.addEventListener('input', () => {
      if (slugInput.dataset.manual !== 'true') slugInput.value = slugify(titleInput.value);
    });
    slugInput.addEventListener('input', () => {
      slugInput.dataset.manual = 'true';
      slugInput.value = slugify(slugInput.value);
    });
  }
  host.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function readFormData(form, section) {
  const formData = new FormData(form);
  const values = {};
  for (const field of section.fields) {
    const rawValue = formData.get(field.key);
    if (field.type === 'image-file') {
      continue;
    } else if (field.type === 'number') {
      values[field.key] = rawValue === '' && field.nullable ? null : Number(rawValue || 0);
    } else if (field.type === 'json') {
      try {
        values[field.key] = JSON.parse(rawValue);
      } catch {
        throw new Error(`Nilai ${field.label} harus berupa JSON yang valid.`);
      }
    } else if (field.type === 'json-or-text') {
      try {
        values[field.key] = JSON.parse(rawValue);
      } catch {
        values[field.key] = String(rawValue ?? '').trim();
      }
    } else {
      values[field.key] = String(rawValue ?? '').trim();
    }
  }
  return values;
}

async function saveRecord(form) {
  if (isSaving) return;
  isSaving = true;
  const section = sections[activeSection];
  const saveButton = form.querySelector('[type="submit"]');
  const originalButtonText = saveButton.textContent;
  const imageField = section.fields.find((field) => field.type === 'image-file');
  let imageUploadCompleted = false;
  saveButton.disabled = true;
  showNotice('');

  try {
    const values = readFormData(form, section);
    if (section.pageKey) values.page = section.pageKey;
    if (section.listKey) values.listKey = section.listKey;
    if (section.listKey) values.targetSelector = section.targetSelector;
    if (section.itemType) values.itemType = section.itemType;
    if (section.contentType) values.contentType = section.contentType;
    for (const [key, targetType] of [
      ['imageSelector', 'image'],
      ['linkSelector', 'link'],
      ['whatsappSelector', 'whatsapp']
    ]) {
      await validatePublicSelector(section.pageKey, values[key], targetType, key);
    }
    if (section.contentType === 'page-copy' && values.sectionKey && values.title) {
      await validatePublicSelector(section.pageKey, values.sectionKey, 'text', 'kunci teks');
    }
    validatePublicUrl(values.linkUrl, 'tautan');
    const collectionRef = collection(db, section.collection);
    const documentId = form.dataset.id;
    if (section.contentType === 'page-copy' && values.sectionKey && activeRecords.some((record) => record.id !== documentId
      && record.sectionKey === values.sectionKey)) {
      throw new Error('Kunci teks sudah digunakan pada halaman ini.');
    }
    if (section.contentType === 'page-copy') {
      const hasText = values.sectionKey && values.title;
      const hasImage = values.imageSelector && values.image;
      const hasLink = values.linkSelector && values.linkUrl;
      const hasWhatsapp = values.whatsappSelector && values.whatsappMessage;
      if (!hasText && !hasImage && !hasLink && !hasWhatsapp) {
        throw new Error('Konten halaman memerlukan target dan nilai teks, gambar, tautan, atau WhatsApp.');
      }
    }
    if (imageField) {
      if (form.dataset.imageError === 'true') {
        throw new Error('Pilih file gambar JPG, JPEG, PNG, atau WEBP dengan ukuran maksimal 5 MB.');
      }
      values[imageField.key] = form.dataset.currentImage || '';
    }
    if (activeSection === 'services') {
      values.slug = slugify(values.slug);
      if (!values.slug) throw new Error('Slug wajib diisi dengan format URL-friendly.');
    }

    let documentRef = documentId ? doc(collectionRef, documentId) : null;
    if (activeSection === 'services' && !documentRef) documentRef = doc(collectionRef);
    if (imageField && selectedImageFile) {
      values[imageField.key] = await uploadImageToCloudinary(selectedImageFile, {
        onProgress: (percent) => {
          saveButton.textContent = `Mengunggah ${percent}%...`;
          showNotice(`Mengunggah foto ke Cloudinary... ${percent}%`, 'success');
        }
      });
      if (!isCloudinaryImageUrl(values[imageField.key])) throw new Error('CLOUDINARY_INVALID_URL');
      imageUploadCompleted = true;
      saveButton.textContent = 'Menyimpan...';
      showNotice('Foto berhasil diunggah. Menyimpan data...', 'success');
    }

    if (documentId) {
      await updateDoc(documentRef || doc(collectionRef, documentId), {
        ...values,
        updatedAt: serverTimestamp()
      });
    } else if (activeSection === 'services') {
      await setDoc(documentRef, {
        ...values,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await addDoc(collectionRef, {
        ...values,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    showNotice('Data berhasil disimpan.', 'success');
    clearImageSelection();
    await loadRecords(activeSection);
    document.querySelector('#editor-host').innerHTML = '';
  } catch (error) {
    logAdminOperationError(documentId ? 'update-document' : 'create-document', error, section.collection);
    const message = error.message?.startsWith('Nilai ') || error.message?.startsWith('Slug ')
      || error.message?.startsWith('Kunci teks ') || error.message?.startsWith('Pilih file ')
      || error.message?.startsWith('Selector ') || error.message?.startsWith('URL ')
      || error.message?.startsWith('Konten halaman ') || error.message?.startsWith('Halaman publik ')
      ? error.message
      : error.message === 'CLOUDINARY_INVALID_FILE'
        ? 'Pilih gambar JPG, JPEG, PNG, atau WEBP.'
        : error.message === 'CLOUDINARY_INVALID_SIZE'
          ? 'Ukuran gambar harus lebih dari 0 dan maksimal 5 MB.'
          : error.message === 'CLOUDINARY_INVALID_URL'
        ? 'Cloudinary tidak mengembalikan secure URL gambar yang valid. Data belum disimpan.'
            : error.message === 'CLOUDINARY_UPLOAD_FAILED'
              ? 'Foto gagal diunggah ke Cloudinary. Periksa preset unsigned dan koneksi.'
              : error.code === 'permission-denied'
                ? 'Akses tulis ditolak oleh Firestore Security Rules.'
                : imageField && selectedImageFile && !imageUploadCompleted
                  ? 'Foto gagal diunggah ke Cloudinary. Data belum disimpan.'
                  : imageField && selectedImageFile && imageUploadCompleted
                    ? 'Foto berhasil diunggah tetapi data belum tersimpan. Periksa Firestore Rules dan koneksi.'
                    : 'Data gagal disimpan. Periksa input, koneksi, dan Firestore Security Rules.';
    showNotice(message);
    saveButton.disabled = false;
    saveButton.textContent = originalButtonText;
  } finally {
    isSaving = false;
  }
}

async function deleteRecord(recordId) {
  const record = activeRecords.find((item) => item.id === recordId);
  if (!record || !window.confirm(`Hapus “${recordTitle(record, recordId)}”? Tindakan ini tidak dapat dibatalkan.`)) {
    return;
  }

  try {
    await deleteDoc(doc(db, sections[activeSection].collection, recordId));
    showNotice('Data berhasil dihapus.', 'success');
    await loadRecords(activeSection);
  } catch (error) {
    logAdminOperationError('delete-document', error, sections[activeSection].collection);
    showNotice(error.code === 'permission-denied'
      ? 'Akses hapus ditolak oleh Firestore Security Rules.'
      : 'Data gagal dihapus. Periksa koneksi dan Firestore Security Rules.');
  }
}

function setGate(state, user) {
  if (state === 'admin') {
    gate.hidden = true;
    app.hidden = false;
    adminEmail.textContent = user.email || 'Admin';
    renderNavigation();
    renderOverview();
    return;
  }

  app.hidden = true;
  gate.hidden = false;
  const messages = {
    unconfigured: 'Firebase belum dikonfigurasi. Tambahkan Firebase Web API key untuk menggunakan dashboard.',
    denied: 'Anda tidak memiliki akses administrator.',
    unavailable: 'Akses administrator belum dapat diverifikasi. Periksa Firebase Authentication dan Firestore Rules.'
  };
  if (state === 'signed-out') {
    window.location.replace('index.html');
    return;
  }
  gate.innerHTML = `${escapeHtml(messages[state] || 'Memverifikasi akses administrator...')}<a href="index.html">Kembali ke login</a>`;
}

nav.addEventListener('click', (event) => {
  const button = event.target.closest('[data-view]');
  if (!button) return;
  activeSection = button.dataset.view;
  renderNavigation();
  if (activeSection === 'dashboard') {
    renderOverview();
  } else if (sections[activeSection]) {
    renderCollection(activeSection);
  }
});

contentView.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    activeSection = viewButton.dataset.view;
    renderNavigation();
    renderCollection(activeSection);
    return;
  }

  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'add') {
    openEditor(activeSection);
  } else if (action === 'edit') {
    const record = activeRecords.find((item) => item.id === button.dataset.id);
    if (record) openEditor(activeSection, record);
  } else if (action === 'delete') {
    deleteRecord(button.dataset.id);
  } else if (action === 'cancel') {
    clearImageSelection();
    document.querySelector('#editor-host').innerHTML = '';
  }
});

contentView.addEventListener('change', (event) => {
  const input = event.target.closest('input[type="file"][data-image-upload]');
  if (!input) return;

  const file = input.files?.[0];
  if (!file) return;
  const extension = file.name.split('.').pop().toLowerCase();
  const form = input.form;
  const preview = form.querySelector('[data-image-preview]');
  const filename = form.querySelector('[data-file-name]');
  const fileSize = form.querySelector('[data-file-size]');

  try {
    validateImageFile(file);
  } catch (error) {
    clearImageSelection();
    form.dataset.imageError = 'true';
    input.value = '';
    preview.src = form.dataset.currentImage || '';
    preview.hidden = !form.dataset.currentImage;
    filename.textContent = error.message === 'CLOUDINARY_INVALID_SIZE' ? 'Ukuran file tidak valid' : 'Format file tidak didukung';
    fileSize.textContent = '';
    showNotice(error.message === 'CLOUDINARY_INVALID_SIZE'
      ? 'Ukuran gambar harus lebih dari 0 dan maksimal 5 MB.'
      : 'Pilih gambar JPG, JPEG, PNG, atau WEBP.');
    return;
  }

  form.dataset.imageError = 'false';
  clearImageSelection();
  selectedImageFile = file;
  imagePreviewUrl = URL.createObjectURL(file);
  preview.src = imagePreviewUrl;
  preview.hidden = false;
  filename.textContent = file.name;
  fileSize.textContent = formatImageFileSize(file.size);
  showNotice('Preview siap. Simpan untuk mengunggah foto ke Cloudinary.', 'success');
});

contentView.addEventListener('submit', (event) => {
  if (event.target.id !== 'content-form') return;
  event.preventDefault();
  saveRecord(event.target);
});

logoutButton.addEventListener('click', async () => {
  logoutButton.disabled = true;
  try {
    await logoutAdmin();
    window.location.replace('index.html');
  } catch (error) {
    logAdminOperationError('logout', error);
    showNotice('Logout gagal. Periksa koneksi lalu coba lagi.');
    logoutButton.disabled = false;
  }
});

if (!isFirebaseConfigured) {
  setGate('unconfigured');
} else {
  requireAdmin(setGate);
}
