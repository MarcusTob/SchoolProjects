<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title class="title">{{ postprops.title }}</ion-card-title>
        </ion-card-header>
        <!-- <router-link :to="'detail/' + postprops.id"> -->
            <post-image :image-url="postprops.imageUrl" @click="navigateToDetails"></post-image>
        <!-- </router-link> -->
        <span class="author">By: {{ postprops.author }}</span>
        <ion-card-content>
            <br/>
            <span class="description">{{ postprops.description }} </span>
            <br/>
            <span class="exhibition">Exhibition: {{ postprops.exhibition }}</span>
            <br/>
        </ion-card-content>
        
        <ion-card-subtitle>
            <span class="uploaded">Posted at {{ postprops.createdAt }}</span>
        </ion-card-subtitle>
        <ion-card-subtitle>
            <span class="hashtags">{{ postprops.hashtags }}</span>
        </ion-card-subtitle>
        <ion-buttons>
            <ion-button @click="toggleLike" style="font-size:40px;">
                <ion-icon v-if="hasLiked" :icon="heart" style="color:red;"></ion-icon>
                <ion-icon v-else :icon="heartOutline"></ion-icon>
            </ion-button>
            <ion-subtitle>
                {{ postprops.likeAmount }}
            </ion-subtitle>
        </ion-buttons>
      </ion-card>
</template>

<script setup lang="ts">
import { onIonViewDidEnter, loadingController, IonContent, IonButtons, IonButton, IonCardContent,
     IonCardHeader, IonCardTitle, IonCardSubtitle, IonCard, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon 
} from '@ionic/vue';
import PostImage from "@/components/PostImage.vue";
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { heartOutline, heart } from 'ionicons/icons';
import { arrayRemove, doc, getFirestore, updateDoc } from 'firebase/firestore';

interface Postprops {
    id: number;
    title: string;
    description: string;
    author: string;
    exhibition: string;
    imageUrl: string;
    hashtags: string[];
    createdAt: string;
    likedBy: string[];
    likeAmount: number;
}

const props = defineProps<{
    postprops: Postprops;
    
}>();

const hasLiked = ref(false);
const db = getFirestore();
const router = useRouter();
const user = ref<User | null>(null);
const auth = getAuth();
onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            // User is logged in, sets user
            user.value = firebaseUser;
            //check if the user has liked the post
            if(user.value && props.postprops.likedBy.includes(user.value.email!)) {
                hasLiked.value = true;
            }
            console.log(hasLiked.value);
        } else {
            // No user is logged in, user = null
            user.value = null;
        }
    });
});

const toggleLike = async () => {
    if(!user.value) {
        router.push('/login');
        return;
    }
    const postRef = doc(db, "posts", props.postprops.id);
    try {
        if(hasLiked.value) {
            //checks if user has liked, if true -1 to likeAmount and remove user.email from likedBy array
            await updateDoc(postRef, {
                likeAmount: props.postprops.likeAmount - 1,
                likedBy: arrayRemove(user.value.email!)
            });
            //update counter display
            props.postprops.likeAmount -= 1;
            hasLiked.value = false;
        } else {
            //else, +1 to likeAmount and add user.email to likedBy array
            await updateDoc(postRef, {
                likeAmount: props.postprops.likeAmount + 1,
                likedBy: [...props.postprops.likedBy, user.value.email!]
            });
            //update counter display
            props.postprops.likeAmount += 1;
            hasLiked.value = true;
        }
    }
    catch (error) {
        console.error(error);
    }
}
const navigateToDetails = () => {
    if(!user.value) {
        router.push('/login');
        return;
    }
    else {
        router.push('/detail/' + props.postprops.id);
    }
}
</script>
<style scoped>
ion-card {
    background-color: black;
    color: white;
    margin: 2%;
}

.title {
    font-size: 2rem;
    font-weight: bold;
    color: white;
}
.description {
    font-size: 1.5rem;
    color: white;
}
.exhibition{
    font-size: 1rem;
    font-style: italic;
    color: lightgray;
}
.author {
    font-size: 1rem;
    color: lightgray;
    font-style: italic;
    padding: 2%;
}
ion-card-subtitle {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2%;
}
.uploaded{
    font-size: 1rem;
    font-weight: light;
    color: lightgray;
}
.hashtags {
    font-size: 0.8rem;
    font-style: italic;
}
</style>