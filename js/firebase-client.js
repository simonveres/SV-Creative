import * as appSdk from 'firebase/app';
import * as authSdk from 'firebase/auth';
import * as firestoreSdk from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';

let auth = null;
let db = null;
let firebaseSdkError = false;

if (isFirebaseConfigured) {
	try {
		const app = appSdk.initializeApp(firebaseConfig);
		auth = authSdk.getAuth(app);
		db = firestoreSdk.getFirestore(app);
	} catch (error) {
		firebaseSdkError = true;
		console.error('[Firebase] Initialization failed.', {
			stage: 'firebase-initialize',
			errorName: typeof error?.name === 'string' ? error.name : 'unknown',
			errorCode: typeof error?.code === 'string' ? error.code : 'unknown'
		});
	}
}

export { auth, authSdk, db, firebaseSdkError, firestoreSdk, isFirebaseConfigured };
