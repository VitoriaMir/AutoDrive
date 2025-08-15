// Initialize Firebase Web SDK v9+ (modular)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js';

const app = initializeApp(window.firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Helpers used by pages
export async function loginEmailPassword(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function watchAuth(cb) { return onAuthStateChanged(auth, cb); }
export function logout() { return signOut(auth); }

export async function uploadDocumento(uid, file, destino) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['png','jpg','jpeg','pdf'].includes(ext)) {
    throw new Error('Tipo inválido. Envie PNG, JPG, JPEG ou PDF.');
  }
  const path = `documentos/${uid}/${destino}.${ext}`;
  const storageRef = ref(storage, path);
  const snap = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snap.ref);
  return { path, url };
}
