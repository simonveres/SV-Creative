import { db, firestoreSdk, isFirebaseConfigured, storage, storageSdk, storageSdkError } from '../../js/firebase-client.js';
import { logoutAdmin, requireAdmin } from '../../js/firebase-admin.js';

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
const { getDownloadURL, ref: storageRef, uploadBytesResumable } = storageSdk || {};

const gate = document.querySelector('#admin-gate');
const app = document.querySelector('#admin-app');
const nav = document.querySelector('#admin-nav');
const contentView = document.querySelector('#content-view');
const pageTitle = document.querySelector('#page-title');
const notice = document.querySelector('#admin-notice');
const adminEmail = document.querySelector('#admin-email');
const logoutButton = document.querySelector('#logout-button');

const sections = {
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
    label: 'Portfolio',
    collection: 'portfolio',
    fields: [
      { key: 'slug', label: 'Slug', required: true },
      { key: 'title', label: 'Judul', required: true },
      { key: 'category', label: 'Kategori', required: true },
      { key: 'description', label: 'Deskripsi', type: 'textarea', full: true },
      { key: 'image', label: 'Path/URL gambar' },
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
      { key: 'image', label: 'Path/URL gambar' },
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
      { key: 'logo', label: 'Path/URL logo' },
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
      { key: 'image', label: 'Path/URL gambar', required: true },
      { key: 'category', label: 'Kategori', required: true },
      { key: 'description', label: 'Deskripsi', type: 'textarea', full: true },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'order', label: 'Urutan', type: 'number', required: true }
    ]
  },
  faq: {
    label: 'FAQ',
    collection: 'faq',
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
    fields: [
      { key: 'sectionKey', label: 'Kunci bagian', required: true },
      { key: 'title', label: 'Judul', required: true },
      { key: 'description', label: 'Deskripsi', type: 'textarea', full: true },
      { key: 'image', label: 'Path/URL gambar' },
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
    fields: [
      { key: 'key', label: 'Key', required: true },
      { key: 'value', label: 'Value (JSON)', type: 'json', required: true, full: true }
    ]
  }
};

const menuItems = [
  { id: 'dashboard', label: 'Dashboard' },
  ...Object.entries(sections).map(([id, section]) => ({ id, label: section.label }))
];
let activeSection = 'dashboard';
let activeRecords = [];
let isSaving = false;
let selectedServiceImage = null;
let imagePreviewUrl = '';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

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

function clearImageSelection() {
  if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
  imagePreviewUrl = '';
  selectedServiceImage = null;
}

function showNotice(message, tone = 'error') {
  notice.textContent = message;
  notice.dataset.tone = tone;
  notice.hidden = !message;
}

function renderNavigation() {
  nav.innerHTML = menuItems.map((item) => `
    <button class="nav-button" type="button" data-view="${item.id}"${item.id === activeSection ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</button>
  `).join('');
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

async function renderOverview() {
  pageTitle.textContent = 'Dashboard';
  contentView.innerHTML = '<p class="loading-line">Memuat ringkasan konten...</p>';
  try {
    const counts = await Promise.all(Object.entries(sections).map(async ([id, section]) => ({
      id,
      label: section.label,
      count: (await readCollection(section.collection)).length
    })));
    contentView.innerHTML = `
      <div class="page-intro"><div><h2>Ringkasan konten</h2><p>Data tersimpan di Firestore. Konten publik masih menggunakan HTML yang ada.</p></div></div>
      <div class="stats-grid">${counts.map((item) => `
        <article class="stat-card"><span>${escapeHtml(item.label)}</span><strong>${item.count}</strong></article>
      `).join('')}</div>
      <section class="panel"><h2>Kelola konten</h2><div class="quick-links">${Object.entries(sections).map(([id, item]) => `
        <button class="quick-link" type="button" data-view="${id}">${escapeHtml(item.label)}</button>
      `).join('')}</div></section>
    `;
  } catch {
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
    return `<div class="form-field${full}">
      <span class="field-label">${escapeHtml(field.label)}</span>
      <div class="image-upload">
        <input class="file-input" id="field-${field.key}" name="${field.key}" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" aria-label="Pilih gambar layanan">
        <label class="button button-secondary file-picker" for="field-${field.key}">Pilih Gambar</label>
        <span class="file-name" data-file-name>${hasCurrentImage ? 'Gambar saat ini akan dipertahankan' : 'Belum ada gambar dipilih'}</span>
      </div>
      <p class="upload-help">JPG, JPEG, PNG, atau WEBP. Maksimal 5 MB.</p>
      <img class="image-preview" data-image-preview src="${hasCurrentImage ? escapeHtml(value) : ''}" alt="Preview gambar layanan"${hasCurrentImage ? '' : ' hidden'}>
    </div>`;
  }

  if (field.type === 'textarea' || field.type === 'json') {
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
    activeRecords = await readCollection(sections[sectionId].collection);
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
  } catch {
    if (recordsHost) {
      recordsHost.innerHTML = '<div class="panel"><p class="empty-state">Data gagal dimuat. Periksa Firestore Security Rules dan koneksi.</p></div>';
    }
  }
}

function openEditor(sectionId, record) {
  clearImageSelection();
  const section = sections[sectionId];
  const host = document.querySelector('#editor-host');
  const editing = Boolean(record);
  const fields = section.fields.map((field) => renderField(field, record?.[field.key])).join('');
  host.innerHTML = `
    <section class="panel editor-panel">
      <h2>${editing ? 'Edit data' : 'Tambah data'}</h2>
      <form id="content-form" data-id="${escapeHtml(record?.id || '')}" data-current-image="${sectionId === 'services' ? escapeHtml(record?.image || '') : ''}">
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
    } else {
      values[field.key] = String(rawValue ?? '').trim();
    }
  }
  return values;
}

function uploadServiceImage(file, documentId, saveButton) {
  if (storageSdkError || !storage || !storageSdk || !uploadBytesResumable || !getDownloadURL) {
    return Promise.reject(new Error('STORAGE_UNAVAILABLE'));
  }

  const safeFilename = file.name
    .split(/[\\/]/)
    .pop()
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image';
  const objectRef = storageRef(storage, `services/${documentId}/${Date.now()}-${safeFilename}`);
  const task = uploadBytesResumable(objectRef, file, { contentType: file.type });

  return new Promise((resolve, reject) => {
    task.on('state_changed', (snapshot) => {
      const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      saveButton.textContent = `Mengunggah ${percent}%...`;
      showNotice(`Mengunggah gambar... ${percent}%`, 'success');
    }, reject, async () => {
      try {
        resolve(await getDownloadURL(task.snapshot.ref));
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function saveRecord(form) {
  if (isSaving) return;
  isSaving = true;
  const section = sections[activeSection];
  const saveButton = form.querySelector('[type="submit"]');
  const originalButtonText = saveButton.textContent;
  let imageUploadCompleted = false;
  saveButton.disabled = true;
  showNotice('');

  try {
    const values = readFormData(form, section);
    const collectionRef = collection(db, section.collection);
    const documentId = form.dataset.id;
    if (activeSection === 'services') {
      if (form.dataset.imageError === 'true') {
        throw new Error('Pilih file gambar JPG, JPEG, PNG, atau WEBP dengan ukuran maksimal 5 MB.');
      }
      values.slug = slugify(values.slug);
      if (!values.slug) throw new Error('Slug wajib diisi dengan format URL-friendly.');
      values.image = form.dataset.currentImage || '';
    }

    let documentRef = documentId ? doc(collectionRef, documentId) : null;
    if (activeSection === 'services' && !documentRef) documentRef = doc(collectionRef);
    if (activeSection === 'services' && selectedServiceImage) {
      values.image = await uploadServiceImage(selectedServiceImage, documentRef.id, saveButton);
      imageUploadCompleted = true;
      saveButton.textContent = 'Menyimpan...';
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
    const message = error.message?.startsWith('Nilai ') || error.message?.startsWith('Slug ') || error.message?.startsWith('Pilih file ')
      ? error.message
      : error.message === 'STORAGE_UNAVAILABLE'
        ? 'Firebase Storage belum dapat digunakan. Periksa konfigurasi Storage dan koneksi.'
        : error.code === 'storage/unauthorized'
          ? 'Upload ditolak oleh Firebase Storage Rules.'
          : error.code === 'permission-denied'
            ? 'Akses tulis ditolak oleh Firestore Security Rules.'
            : activeSection === 'services' && selectedServiceImage && !imageUploadCompleted
              ? 'Gambar gagal diunggah. Data layanan belum disimpan; periksa Storage Rules dan koneksi.'
              : activeSection === 'services' && selectedServiceImage && imageUploadCompleted
                ? 'Gambar berhasil diunggah tetapi data layanan belum tersimpan. Periksa Firestore Rules dan koneksi.'
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
  const input = event.target.closest('input[type="file"][name="image"]');
  if (!input || activeSection !== 'services') return;

  const file = input.files?.[0];
  if (!file) return;
  const extension = file.name.split('.').pop().toLowerCase();
  const form = input.form;
  const preview = form.querySelector('[data-image-preview]');
  const filename = form.querySelector('[data-file-name]');

  if (!ALLOWED_IMAGE_TYPES.has(file.type) || !ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
    clearImageSelection();
    form.dataset.imageError = 'true';
    input.value = '';
    preview.src = form.dataset.currentImage || '';
    preview.hidden = !form.dataset.currentImage;
    filename.textContent = 'Format file tidak didukung';
    showNotice('Pilih gambar JPG, JPEG, PNG, atau WEBP.');
    return;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    clearImageSelection();
    form.dataset.imageError = 'true';
    input.value = '';
    preview.src = form.dataset.currentImage || '';
    preview.hidden = !form.dataset.currentImage;
    filename.textContent = 'Ukuran file melebihi 5 MB';
    showNotice('Ukuran gambar maksimal 5 MB.');
    return;
  }

  form.dataset.imageError = 'false';
  clearImageSelection();
  selectedServiceImage = file;
  imagePreviewUrl = URL.createObjectURL(file);
  preview.src = imagePreviewUrl;
  preview.hidden = false;
  filename.textContent = file.name;
  showNotice('Preview gambar siap. Simpan untuk mengunggah ke Firebase Storage.', 'success');
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
  } catch {
    showNotice('Logout gagal. Periksa koneksi lalu coba lagi.');
    logoutButton.disabled = false;
  }
});

if (!isFirebaseConfigured) {
  setGate('unconfigured');
} else {
  requireAdmin(setGate);
}
