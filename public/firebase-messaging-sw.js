importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBSKwCB4N47NpQ-eXokAKvmUs30B4FzZoE",
  authDomain: "chatly-ec08f.firebaseapp.com",
  projectId: "chatly-ec08f",
  storageBucket: "chatly-ec08f.firebasestorage.app",
  messagingSenderId: "553080467362",
  appId: "1:553080467362:web:db85793cd4059e2e610cfb"
});

const messaging = firebase.messaging();

// The Firebase JS SDK will automatically handle incoming messages
// that have a `notification` payload when the app is in the background.
// Web push options like vibrate, badge, and link are now sent directly 
// from the /api/notify route using the `webpush` parameter.
