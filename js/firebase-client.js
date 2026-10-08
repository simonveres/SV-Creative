import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';

let auth = null;
let db = null;
let authSdk = null;
let firestoreSdk = null;
let storage = null;
let storageSdk = null;
let storageSdkError = false;
let firebaseSdkError = false;

if (isFirebaseConfigured) {
	try {
		const [appSdk, loadedAuthSdk, loadedFirestoreSdk] = await Promise.all([
			import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
			import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
			import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
		]);
		const app = appSdk.initializeApp(firebaseConfig);
		authSdk = loadedAuthSdk;
		firestoreSdk = loadedFirestoreSdk;
		auth = authSdk.getAuth(app);
		db = firestoreSdk.getFirestore(app);
		try {
			storageSdk = await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js');
			storage = storageSdk.getStorage(app);
		} catch {
			storageSdkError = true;
		}
	} catch {
		firebaseSdkError = true;
	}
}

export { auth, authSdk, db, firebaseSdkError, firestoreSdk, isFirebaseConfigured, storage, storageSdk, storageSdkError };
