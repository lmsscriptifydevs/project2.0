// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBHQUZ320kHRSycZXzkYxSEz5Pks68WmA8",
  authDomain: "grape-task-4d779.firebaseapp.com",
  projectId: "grape-task-4d779",
  storageBucket: "grape-task-4d779.appspot.com",
  messagingSenderId: "972296757683",
  appId: "1:972296757683:web:c2896a15facb2fe9d3abc6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const messaging = getMessaging(app);
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default app;
