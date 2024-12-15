<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title slot="start">ArtVista🎨</ion-title>
          <ion-subtitle slot="end" v-if="user">
            <ion-button @click="logout" class="logout-button" color="danger">
              Logout
            </ion-button>
          </ion-subtitle>
          <ion-subtitle slot="end" v-else>
            <ion-button @click="navigateToLogin">
              Login
            </ion-button>
          </ion-subtitle>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <div v-for="exhibition in exhibitions" :key="exhibition.id">
            <div slot="content">
              <!--fix styling-->
              <exhibition-card
              :key="exhibition.id"
              :xhibprops="exhibition">
              </exhibition-card>
            </div>
        </div>
      </ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-buttons class="footer">
            <ion-button @click="navigateToHome">
              <ion-icon :icon="homeOutline"></ion-icon>
            </ion-button> 
            |
            <ion-button @click="navigateToExhibitions"> 
              <ion-icon :icon="albumsOutline"></ion-icon>
            </ion-button>
            |
            <ion-button @click="navigateToProfile">
              <ion-icon :icon="personOutline"></ion-icon>
            </ion-button>
        </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    </ion-page>
  </template>
<script setup lang="ts">
import { authService } from '@/services/firebase.authservice';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, onIonViewDidEnter,
  IonButton, IonButtons, IonFab, IonFabButton, IonIcon,
  loadingController
 } from '@ionic/vue';
import { add, albumsOutline, homeOutline, personOutline } from 'ionicons/icons';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import ExhibitionCard from '@/components/ExhibitionCard.vue';
import { useRouter } from 'vue-router';
import {
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { IExhibitionsResponse } from '@/models/ExhibitionModels';
const router = useRouter();
const db = getFirestore();
const exhibitions = ref<IExhibitionsResponse["exhibitions"]>([]);

const auth = getAuth();
const user = ref<User | null>(null);

onMounted(() => {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      // User is logged in, sets user
      user.value = firebaseUser;
    } else {
      // No user is logged in, user = null
      user.value = null;
    }
  });
});

onIonViewDidEnter(async() => {
  await fetchExhibitions();
});

const fetchExhibitions = async() => {
    const loading = await loadingController.create({
      message: 'Loading exhibitions...',
    });
    try{
        await loading.present();
        const results: IExhibitionsResponse["exhibitions"] = [];
        const xhibSnapshot = await getDocs(collection(db, 'exhibitions'));
        xhibSnapshot.forEach((doc) => {
            results.push({id: doc.id, ...doc.data()});
        });
        exhibitions.value = results;
        console.log(exhibitions);
    } catch (error) {
        console.error(error);
    } finally {
        await loading.dismiss();
    }
}

const navigateToLogin = () => {
  router.push('/login');
}
const navigateToHome = () => {
  router.push('/');
}
const navigateToExhibitions = () => {
  router.push('/exhibitions');
}
const navigateToProfile = () => {
  router.push('/profile');
}

const logout = async() => {
  try {
    await authService.logout();
    user.value = null;
    localStorage.removeItem('auth_token');
    console.log('User logged out');
  } catch (error) {
    console.error(error);
  }
}
</script>
<style scoped>

ion-buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  background-color: black;
}

ion-icon {
  font-size: 50px;
  color: white;
}

ion-button:focus ion-icon {
  color: gray;
}
</style>