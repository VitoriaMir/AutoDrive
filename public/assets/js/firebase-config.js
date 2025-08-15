// Firebase Web App config for AutoDrive project - PRODUÇÃO
window.firebaseConfig = {
  apiKey: "AIzaSyCji2_Bc2qmGWJ2QK2PqktHFLds7SF5MS4",
  authDomain: "autodrive-1dccf.firebaseapp.com",
  projectId: "autodrive-1dccf",
  storageBucket: "autodrive-1dccf.firebasestorage.app",
  messagingSenderId: "939709954025",
  appId: "1:939709954025:web:6c2bdca0367e1aac337d78",
  measurementId: "G-7L51WJGY5Q"
};

// Debug para desenvolvimento
if (window.location.hostname === 'localhost') {
  console.log('🔥 Firebase configurado para:', window.firebaseConfig.projectId);
}
