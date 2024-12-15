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
      <ion-title>Your posts</ion-title>
        <div v-for="post in posts" :key="post.id">
            <post-card
            :key="post.id"
            :postprops="post">
          </post-card>
          <ion-button @click="deletePost(post.id)">
            <ion-icon :icon="trashBinOutline"></ion-icon>
          </ion-button>
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
  IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonFooter,
  loadingController
 } from '@ionic/vue';
import { add, albumsOutline, homeOutline, personOutline, trashBinOutline } from 'ionicons/icons';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {IPostsResponse} from '@/models/PostModels';
import PostCard from '@/components/PostCard.vue';
import {
  collection,
  getDocs,
  getFirestore,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
const router = useRouter();
const auth = getAuth();
const user = ref<User | null>(null);
const db = getFirestore();
const posts = ref<IPostsResponse["posts"]>([]);

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
  await fetchPosts();
});

const fetchPosts = async () => {
  const loading = await loadingController.create({
    message: 'Loading posts...',
    duration: 3000
  });

  try {
    await loading.present();
    const results: IPostsResponse["posts"] = [];
    const postsSnapshot = await getDocs(collection(db, "posts"));

    postsSnapshot.forEach((doc) => {
      const post = { id: doc.id, ...doc.data() };
      // Only include posts where the author matches the logged-in user's email
      if (post.author === user.value?.email) {
        results.push(post);
      }
    });
    posts.value = [...results];
    console.log(results);

  } catch (error) {
    console.error(error);
  } finally {
    await loading.dismiss();
  }
};
const deletePost = async (postId: string) => {
  try {
    await deleteDoc(doc(db, "posts", postId));
    console.log("Post deleted");
    await fetchPosts();
  } catch (error) {
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