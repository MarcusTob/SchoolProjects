<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                  <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>
                <ion-title slot="start">ArtVista🎨</ion-title>
                <ion-subtitle slot="end" v-if="user">
                <ion-button @click="logout" color="danger">
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
            <div v-if="exhibitionById" class="exhibition">
                <ion-item-divider class="divider">
                    <ion-card-header>
                        <ion-card-title class="title"> {{ exhibitionById.title }}</ion-card-title>
                    </ion-card-header>
                </ion-item-divider>
                <exhibition-image :image-url="exhibitionById.imageUrl"></exhibition-image>
                <span class="description">{{ exhibitionById.description}}</span>
                <br/>
                <span class="host">Hosted by {{ exhibitionById.host }}</span>
                <br/>
                <span class="date">Date: {{ exhibitionById.date }}</span>
                <br/>
                <span class="hashtags">{{ exhibitionById.hashtags }}</span>
                
                <!-- google maps here -->
                <ion-item>
                  <capacitor-google-map ref="mapref" style="height: 200px; width: 100%;"></capacitor-google-map>
                </ion-item>
            </div>
            <ion-item-divider class="divider">  
              <ion-title class="title">
                Related Posts
              </ion-title>
            </ion-item-divider>
            <div class="related-posts">
              <div v-for="post in posts" :key="post.id">
                <router-link :to="'/detail/' + post.id">
                  <post-image :src="post.imageUrl" alt="post image"/>
                </router-link>
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
  IonButton, IonButtons, IonIcon, loadingController, IonBackButton, IonItemDivider,
 } from '@ionic/vue';
import { add, albumsOutline, homeOutline, personOutline } from 'ionicons/icons';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import ExhibitionImage from '@/components/ExhibitionImage.vue';
import { useRoute, useRouter } from 'vue-router';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { IExhibitionResponse } from '@/models/ExhibitionModels';
import { IPostsResponse } from '@/models/PostModels';
import PostImage from '@/components/PostImage.vue';
import { GoogleMap } from '@capacitor/google-maps';

const router = useRouter();
const route = useRoute();
const id = route.params.id;
const exhibitionById = ref<IExhibitionResponse["exhibition_by_id"] | null>(null);
const posts = ref<IPostsResponse["posts"]>([]);

const auth = getAuth();
const user = ref<User | null>(null);
const db = getFirestore();

onMounted(async () => {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      // User is logged in, sets user
      user.value = firebaseUser;
    } else {
      // No user is logged in, user = null
      user.value = null;
    }
  });
  await fetchExhibition();
  await fetchRelatedPosts(posts);
  await loadGoogleMap();
  console.log("exhibition.title " + exhibitionById.value.title);
});

//fetch exhibition by id
//take exhibition.postIDs and use fetchRelatedPosts to fetch the IDs
const fetchExhibition = async () => {
    const loading = await loadingController.create({
        message: 'Loading Exhibition...',
    });
    if(!id) {
        console.error('No exhibition id found');
        return;
    }
    try{
        await loading.present();
        let exhibition: IExhibitionResponse["exhibition_by_id"] | null = null;
        const docRef = doc(db, 'exhibitions', id);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
            exhibition = docSnap.data() as IExhibitionResponse["exhibition_by_id"];
            exhibitionById.value = exhibition;
            //use the postIDs from the exhibition to fetch related posts
            const postIDs = exhibition.postIDs || [];
            await fetchRelatedPosts(postIDs)
        } else {
            console.error('No exhibition found');
        }
    } catch (error) {
        console.error(error);
    } finally {
        await loading.dismiss();
    }
}

//uses the postIDs from the exhibition to fetch related posts
const fetchRelatedPosts = async (postIDs: string[]) => {
    try{
        const relatedPosts = [];
        for(const id of postIDs) {
            const docRef = doc(db, 'posts', id);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                const post = docSnap.data() as IPostsResponse["posts"];
                relatedPosts.push(post);
            } else {
                console.error('No post found');
            }
        }
        //flatten the array of arrays (can probably be done in a better way)
        posts.value = relatedPosts.flat();
    } catch (error) {
        console.error(error);
    }
}

const mapref = ref(null);
const loadGoogleMap = async() => {
  try{
    if(mapref.value) {
      const latitude = exhibitionById.value.location.latitude;
      const longitude = exhibitionById.value.location.longitude;
      const xhibMap = await GoogleMap.create({
            id: 'exhib-map',
            element: mapref.value,
            apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
            config: {
                center: {  
                    lat: latitude, lng: longitude
                },
                zoom: 15,
            },
        })
        const marker = xhibMap.addMarker({
            coordinate: {
                lat: latitude,
                lng: longitude
            }
        })
    } else {
        console.log('mapref is null');
    }
    }
    catch(error){
        console.error(error);
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
.exhibition {
  background-color: black;
}
.divider {
  background-color: black;
}


.title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  color: white;
}
img {
  padding: 2%;
}
.description {
  font-size: 1.5rem;
  color: white;
}
.host {
  font-size: 1rem;
  font-style: italic;
  padding: 2%;
  color: lightgray;
}

ion-card-subtitle{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2%;
}
.date {
  font-size: 1.5rem;
  font-weight: bold;
  color: lightgray
}
.hashtags {
  display: flex;
  justify-content: center;
  padding: 2%;
  font-size: 0.8rem;
  font-style: italic;
}

.related-posts {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

ion-buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  background-color: black;
  color: white;
}

ion-icon {
  font-size: 50px;
  color: white;
}

ion-button:focus ion-icon {
  color: gray;
}
</style>