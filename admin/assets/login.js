import { isFirebaseConfigured } from '../../js/firebase-config.js';
import { requireAdmin, signInAdmin } from '../../js/firebase-admin.js';

const form = document.querySelector('#login-form');
const submitButton = document.querySelector('#login-submit');
const message = document.querySelector('#login-message');

function showMessage(text, tone = 'error') {
  message.textContent = text;
  message.dataset.tone = tone;
  message.hidden = false;
}

if (!isFirebaseConfigured) {
  showMessage('Firebase belum dikonfigurasi. Tambahkan Firebase Web API key terlebih dahulu.');
  submitButton.disabled = true;
} else {
  requireAdmin((state) => {
    if (state === 'admin') {
      window.location.replace('dashboard.html');
    } else if (state === 'denied') {
      showMessage('Anda tidak memiliki akses administrator.');
    } else if (state === 'unavailable') {
      showMessage('Akses administrator belum dapat diverifikasi. Periksa koneksi lalu coba lagi.');
    }
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.hidden = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Memeriksa...';

  const formData = new FormData(form);
  try {
    await signInAdmin(formData.get('email').trim(), formData.get('password'));
    window.location.assign('dashboard.html');
  } catch (error) {
    const messages = {
      FIREBASE_NOT_CONFIGURED: 'Firebase belum dikonfigurasi.',
      FIREBASE_SDK_UNAVAILABLE: 'Firebase belum dapat dimuat. Periksa koneksi lalu coba lagi.',
      ADMIN_ACCESS_DENIED: 'Anda tidak memiliki akses administrator.',
      ADMIN_CHECK_FAILED: 'Akses administrator belum dapat diverifikasi. Periksa aturan Firestore.',
      'auth/invalid-credential': 'Email atau password tidak sesuai.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi beberapa saat.',
      'auth/network-request-failed': 'Koneksi gagal. Periksa internet lalu coba lagi.'
    };
    showMessage(messages[error.message] || messages[error.code] || 'Login gagal. Periksa email dan password lalu coba lagi.');
    submitButton.disabled = false;
    submitButton.textContent = 'Masuk';
  }
});
