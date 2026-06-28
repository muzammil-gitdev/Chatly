importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const urlParams = new URLSearchParams(location.search);
const configStr = urlParams.get('config');

if (configStr) {
  firebase.initializeApp(JSON.parse(configStr));
} else {
  console.warn("Firebase config not found in service worker URL");
}

const messaging = firebase.messaging();

// The Firebase JS SDK will automatically handle incoming messages
// that have a `notification` payload when the app is in the background.
// Web push options like vibrate, badge, and link are now sent directly 
// from the /api/notify route using the `webpush` parameter.
