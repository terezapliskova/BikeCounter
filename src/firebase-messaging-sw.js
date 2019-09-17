
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/6.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.0.2/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '863948058719'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
//messaging.usePublicVapidKey("BHuS5ZmdeFxVfdT0-DeCnqfRVKzic3qqqwJvf0hEvqRSqX1mjvXqPvd2U_SHEQhzPZtQgFVp3bCwOJoV5Vk-xNE");

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('Received background message ', payload);
    // here you can override some options describing what's in the message;
    // however, the actual content will come from the Webtask
    const notificationOptions = {
      icon: '/src/bicycle2.png'
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
