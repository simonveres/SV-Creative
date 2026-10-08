export const firebaseConfig = Object.freeze({
  apiKey: 'AIzaSyBQWXEagpRKXfUu4Q0XnSXD4A3Ydz-qQ1o',
  authDomain: 'sv-creative-b35ef.firebaseapp.com',
  projectId: 'sv-creative-b35ef',
  storageBucket: 'sv-creative-b35ef.firebasestorage.app',
  messagingSenderId: '1007110777363',
  appId: '1:1007110777363:web:7e6d61cc94e1b00a206de6',
  measurementId: 'G-DPNZ9XHBYQ'
});

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);
