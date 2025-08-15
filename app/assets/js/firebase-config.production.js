// Production Firebase Configuration
// Replace these values with your actual Firebase project configuration
window.firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Environment-specific configuration
window.firebaseConfig.isDevelopment = window.location.hostname === 'localhost';
window.firebaseConfig.isProduction = window.location.hostname !== 'localhost';

// Optional: Enable Firebase Analytics in production only
if (window.firebaseConfig.isProduction && window.firebaseConfig.measurementId) {
  window.firebaseConfig.measurementId = process.env.FIREBASE_MEASUREMENT_ID;
}

// Debug logging only in development
if (window.firebaseConfig.isDevelopment) {
  console.log('Firebase Config:', window.firebaseConfig);
}
