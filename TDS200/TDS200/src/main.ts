import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYDrfUuPMPe4Id6tfURawxnZim9g_VdV8",
  authDomain: "tds200-h24-8.firebaseapp.com",
  projectId: "tds200-h24-8",
  storageBucket: "tds200-h24-8.firebasestorage.app",
  messagingSenderId: "959148654419",
  appId: "1:959148654419:web:77802ebb8cdf2450d36ba6",
  measurementId: "G-5RJNNHTXFT"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

const app = createApp(App)
  .use(IonicVue)
  .use(router);

defineCustomElements(window);
router.isReady().then(() => {
  app.mount('#app');
});
