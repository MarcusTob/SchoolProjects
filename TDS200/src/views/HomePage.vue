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
      <span v-if="!user">
        <ion-item>
          Log in to see posts
        </ion-item>
      </span>
      <span v-else>
        <ion-label>Sort by:</ion-label>
        <ion-select v-model="sortOption">
          <ion-select-option value="newest">Newest</ion-select-option>
          <ion-select-option value="mostLikes">Most Likes</ion-select-option>
        </ion-select>
        <div v-for="post in posts" :key="post.id" class="post-card">
            <post-card
            :key="post.id"
            :postprops="post">
            </post-card>
        </div>
      </span>

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
  IonButton, IonButtons, IonFab, IonFabButton, IonIcon,
  loadingController, IonSelect, IonSelectOption
 } from '@ionic/vue';
import { add, albumsOutline, homeOutline, personOutline } from 'ionicons/icons';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { onMounted, ref, watch } from 'vue';
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
const db = getFirestore();
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
const posts = ref<IPostsResponse["posts"]>([]);

onIonViewDidEnter(async() => {
  await fetchPosts();
});
const sortOption = ref("newest");
//when sortOption changes, fetch posts again
watch(sortOption, () => {
  fetchPosts();
});

const fetchPosts = async() => {
  const loading = await loadingController.create({
    message: 'Loading posts...',
    duration: 3000
  });
  try {
    await loading.present();
    const results: IPostsResponse["posts"] = [];
    const postsSnapshot = await getDocs(collection(db, "posts"));
    postsSnapshot.forEach((doc) => {
      results.push({id: doc.id, ...doc.data()});
    });
    //sorts the posts based on the selected sort option
    if (sortOption.value === "newest") {
      //sort based on createdAt date
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption.value === "mostLikes") {
      //sort based on likeAmount
      results.sort((a, b) => (b.likeAmount || 0) - (a.likeAmount || 0));
    }
    posts.value = [...results];
    console.log(results);

  } catch (error) {
    console.error(error);
  } finally {
    await loading.dismiss();
  }
}

const navigateToAddPost = () => {
  //if there is no logged in user, navigate to login screen
  if(!user.value) {
    navigateToLogin();
  } else {
    router.push('/new-post');
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
ion-content {
  --background: white;
}
ion-label {
  font-size: 1.5rem;
  color: black;
}
ion-select {
  font-size: 1.5rem;
  color: black;
}

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