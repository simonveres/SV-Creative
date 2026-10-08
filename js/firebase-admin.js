import { auth, authSdk, db, firestoreSdk, isFirebaseConfigured } from './firebase-client.js';

export async function isAdmin(user = auth?.currentUser) {
  if (!isFirebaseConfigured || !user || !db || !firestoreSdk) {
    return false;
  }

  const adminSnapshot = await firestoreSdk.getDoc(firestoreSdk.doc(db, 'admins', user.uid));
  return adminSnapshot.exists() && adminSnapshot.data().role === 'admin';
}

export async function signInAdmin(email, password) {
  if (!isFirebaseConfigured) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }
  if (!auth || !authSdk) {
    throw new Error('FIREBASE_SDK_UNAVAILABLE');
  }

  const credentials = await authSdk.signInWithEmailAndPassword(auth, email, password);
  try {
    if (await isAdmin(credentials.user)) {
      return credentials.user;
    }
  } catch {
    await authSdk.signOut(auth);
    throw new Error('ADMIN_CHECK_FAILED');
  }

  await authSdk.signOut(auth);
  throw new Error('ADMIN_ACCESS_DENIED');
}

export function logoutAdmin() {
  if (!auth) {
    return Promise.resolve();
  }
  return authSdk ? authSdk.signOut(auth) : Promise.resolve();
}

export function requireAdmin(onState) {
  if (!isFirebaseConfigured) {
    onState('unconfigured');
    return () => {};
  }
  if (!auth || !db || !authSdk || !firestoreSdk) {
    onState('unavailable');
    return () => {};
  }

  return authSdk.onAuthStateChanged(auth, async (user) => {
    if (!user) {
      onState('signed-out');
      return;
    }

    try {
      if (await isAdmin(user)) {
        onState('admin', user);
        return;
      }
      await authSdk.signOut(auth);
      onState('denied');
    } catch {
      await authSdk.signOut(auth);
      onState('unavailable');
    }
  });
}
