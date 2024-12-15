<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Create new post</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-button @click="triggerCamera">
          Choose image file or take image
        </ion-button>
        <section v-if="newPost.imageUrl">
          <ion-button @click="removeImagePreview">
            Remove image
          </ion-button>
          <img :src="newPost.imageUrl"/>
        </section>
        
        <ion-item>
          <ion-label position="floating">Title</ion-label>
          <ion-input v-model="newPost.title"></ion-input>
        </ion-item>

        
        <ion-item>
          <ion-label position="floating">Description</ion-label>
          <ion-textarea v-model="newPost.description"></ion-textarea>
        </ion-item>
        
        <ion-item>
          <ion-label position="floating">Exhibition</ion-label>
          <ion-select v-model="newPost.exhibition" placeholder="Select Exhibition">
            <!-- loop through the exhibition titles fetched from fetchExhibitions and display them in a selection menu -->
            <!-- this ensures typos wont affect the references in the exhibitions-->
            <ion-select-option
              v-for="title in exhibitionTitles"
              :key="title"
              :value="title"
            >
              {{ title }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Hashtags</ion-label>
          <ion-input type="text" v-model="newHashtagText"></ion-input>
          <ion-button @click="addNewHashtag">
            Add
          </ion-button>
        </ion-item>

        <ion-chip v-for="hashtag in newPost.hashtags" :key="hashtag">
          <ion-label>{{ hashtag }}</ion-label>
        </ion-chip>

        <ion-button @click="postNewPost">
          Post
        </ion-button>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { INewPost } from '@/models/PostModels';
import { IonBackButton, IonButton, IonButtons, IonChip, IonContent, IonHeader, IonIcon, IonInput, IonItem, 
  IonLabel, IonList, IonPage, IonSpinner, IonTextarea, IonTitle, IonToolbar, onIonViewDidEnter, toastController, IonSelect, IonSelectOption
} from '@ionic/vue';
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  ref as dbRef,
} from "firebase/storage";
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { Camera, CameraResultType } from '@capacitor/camera';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';


const router = useRouter();
const newHashtagText = ref('#');

const auth = getAuth();
const user = ref<User | null>(null);
const db = getFirestore();
const exhibitionTitles = ref([]);

onMounted(async () => {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      // User is logged in, sets user
      user.value = firebaseUser;
      //sets the author of post to the logged in users email
      //since im using firebase auth, and that only has email and password, i will use the email as author
      //could save user to database when a user is created and then save a username to the user, and use that username instead.
      newPost.value.author = firebaseUser.email;
    } else {
      // No user is logged in, user = null
      user.value = null;
    }
  });
  exhibitionTitles.value = await fetchExhibitions();
});

const newPost = ref<INewPost>({
  id: '',
  title: '',
  description: '',
  author: '',
  exhibition: '',
  imageUrl: '',
  hashtags: [],
  createdAt: ''
})

const postCollection = collection(getFirestore(), 'posts');

const addNewHashtag = () => {
  //ensure that every input starts with a "#"
  if(!newHashtagText.value.startsWith("#")) {
    //either fix the input for them if its missing a #
    newHashtagText.value = "#" + newHashtagText.value;
    //or alert when input is missing a #
    //alert('Hashtags must start with a "#"');
    //return;
  }
  //checks if input is empty
  if(newHashtagText.value) {
    //checks if hashtag already exists
    if(!newPost.value.hashtags.includes(newHashtagText.value)) {
      //adds hashtag to hashtags array
      newPost.value.hashtags.push(newHashtagText.value);
    } else {
      console.log('Hashtag already exists');
    }
    //resets input
    newHashtagText.value = "#";
  }
}

//post new post to database
//take newpost.exhibition and check exhibitions collection for matching title
//if newpost.exhibition and exhibition.title matches, push newpost.id to exhibitions.postIDs
const postNewPost = async() => {
  try{
    const generatedUUID = uuidv4();
    //creates unique img name
    const imageName = new Date().getTime() + '.jpg';
    const storageRef = getStorage();
    const imageRef = dbRef(storageRef, `images/${imageName}`);
    const response = await fetch(newPost.value.imageUrl);
    const imageBlob = await response.blob();
    const snapshot = await uploadBytes(imageRef, imageBlob);
    const url = await getDownloadURL(snapshot.ref);
    newPost.value.imageUrl = url;
    //sets unique ID to post, created by uuidv4
    newPost.value.id = generatedUUID;
    //sets date to post
    newPost.value.createdAt = new Date().toLocaleString();
    //uploads post to database
    await setDoc(doc(postCollection, generatedUUID), newPost.value);

    const exhibitionQuery = query(collection(db, 'exhibitions'), 
      where('title', '==', newPost.value.exhibition));
    const exhibitionSnap = await getDocs(exhibitionQuery);

    if (!exhibitionSnap.empty) {
      //xhibition in this case is unique, so we can just grab the first one
      const exhibitionDoc = exhibitionSnap.docs[0];
      const exhibitionRef = exhibitionDoc.ref;
      //adds the post to the postIDs array of the exhibition
      const postIDs = exhibitionDoc.data().postIDs || [];
      await updateDoc(exhibitionRef, {
        postIDs: [...postIDs, newPost.value.id]
      });
      console.log('Post added to exhibition' + newPost.value.exhibition);
    } else {
      console.error('Exhibition not found');
    }

    const successToast = await toastController.create({
      message: 'Post uploaded!',
      duration: 3000,
      position: 'bottom',
      color: 'success'
    });
    await successToast.present();
    router.replace('/home');
    console.log('Post uploaded', newPost.value.imageUrl);
    console.log('exhibition', newPost.value.exhibition);
  } catch (error) {
    console.error(error);
    const errorToast = await toastController.create({
      message: 'Error uploading post',
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await errorToast.present();
  }
}

const triggerCamera = async () => {
  const photo = await Camera.getPhoto ({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Uri
  });
  if (photo.webPath) {
    newPost.value.imageUrl = photo.webPath;
  }
  console.log(photo);
}

const fetchExhibitions = async () => {
  try{
    const exhibitionSnap = await getDocs(collection(db, 'exhibitions'));
    const exhibitionTitles = exhibitionSnap.docs.map(doc => doc.data().title);
    return exhibitionTitles;
  } catch (error) {
    console.error(error);
  }
}
const removeImagePreview = () => {
  newPost.value.imageUrl = '';
}

</script>
