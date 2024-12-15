<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title class="title">{{ xhibprops.title }}</ion-card-title>
        </ion-card-header>
        <exhibition-image :image-url="xhibprops.imageUrl" @click="navigateToDetails"></exhibition-image>
        <ion-card-content>
          <span class="description">{{ xhibprops.description }} </span>
        <br/>
          <span class="host">Hosted by: {{ xhibprops.host }}</span>
        <br/>
          <span class="date">{{ xhibprops.date }}</span>
        </ion-card-content>
        <ion-card-subtitle>
            <span class="hashtags">{{ xhibprops.hashtags }}</span>
        </ion-card-subtitle>

      </ion-card>
</template>

<script setup lang="ts">
import { IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCard, onIonViewDidEnter } from '@ionic/vue';
import { GeoPoint } from 'firebase/firestore';
import ExhibitionImage from './ExhibitionImage.vue';
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'vue-router';

interface Xhibprops {
    id: number;
    title: string;
    description: string;
    host: string;
    date: string;
    location: GeoPoint;
    imageUrl: string;
    hashtags: string[];
    postIDs: string[];
}


const props = defineProps<{
    xhibprops: Xhibprops;
}>();
const router = useRouter();
const user = ref<User | null>(null);
const auth = getAuth();
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

const navigateToDetails = () => {
    if(!user.value) {
        router.push('/login');
        return;
    }
    else {
        router.push('/exhibitions/' + props.xhibprops.id);
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
.host {
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
.date{
    font-size: 1.5rem;
    font-weight: bold;
    color: lightgray;
}
.hashtags {
    font-size: 0.8rem;
    font-style: italic;
}
</style>