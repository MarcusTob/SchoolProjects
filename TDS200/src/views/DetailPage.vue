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
      <div v-if="postById" class="post">
        <ion-item-divider class="divider">
          <ion-card-header>
            <ion-card-title class="title"> {{ postById.title }}</ion-card-title>
          </ion-card-header>
        </ion-item-divider>
          <post-image :image-url="postById.imageUrl"></post-image>
          <span class="author">By: {{ postById.author }}</span>
          <ion-item-divider class="divider">
          <ion-card-content>
            <span class="description">{{ postById.description }} </span>
            <br/>
            <span class="exhibition">Exhibition: {{ postById.exhibition }}</span>
          </ion-card-content>
        </ion-item-divider>
          <ion-card-subtitle>
            <span class="uploaded">Posted at {{ postById.createdAt }}</span>
          </ion-card-subtitle>
          <ion-card-subtitle>
            <span class="hashtags">{{ postById.hashtags }}</span>
          </ion-card-subtitle>
      </div>

      <ion-fab slot="fixed" horizontal="end" vertical="bottom">
        <ion-fab-button @click="navigateToAddPost">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
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
  IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonBackButton, IonItemDivider,
  loadingController
 } from '@ionic/vue';
import { add, homeOutline, albumsOutline, personOutline } from 'ionicons/icons';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PostImage from '@/components/PostImage.vue';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { IPostResponse } from '@/models/PostModels';

const router = useRouter();
const route = useRoute();
const id = route.params.id;
const postById = ref<IPostResponse["post_by_id"] | null>(null);

const auth = getAuth();
const user = ref<User | null>(null);
const db = getFirestore();

onMounted(async() => {
  console.log(user.value);
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      // User is logged in, sets user
      user.value = firebaseUser;
    } else {
      // No user is logged in, user = null
      user.value = null;
    }
  });
  await fetchPost();
  console.log("post.title " + postById.value?.title);
  console.log("post.img " + postById.value?.imageUrl);
});

const fetchPost = async() => {
  const loading = await loadingController.create({
    message: 'Loading post...',
  });
  if(!id) {
    console.error('Post ID not found');
    return;
  }
  try{
    await loading.present();
    let post: IPostResponse["post_by_id"] | null = null;
    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      post = docSnap.data() as IPostResponse["post_by_id"];
      postById.value = post;
    } else {
      console.error('Post not found');
    }
  } catch (error) {
    console.error(error);
  } finally {
    await loading.dismiss();
  }
}

const navigateToAddPost = () => {
  router.push('/new-post');
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
.post {
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
.exhibition {
  font-size: 1rem;
  font-style: italic;
  color: lightgray;
}
.author {
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
.uploaded {
  font-size: 1.5rem;
  font-weight: light;
  color: lightgray
}
.hashtags {
  font-size: 0.8rem;
  font-style: italic;
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
  color: lightblue;
}

</style>
