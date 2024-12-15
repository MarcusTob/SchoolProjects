<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Back</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
          <ion-label>New user?</ion-label>
          <ion-toggle @ion-change="inRegisterMode = !inRegisterMode"></ion-toggle>
        </ion-item>
        <ion-item v-if="inRegisterMode">
          <ion-label position="stacked">First Name</ion-label>
          <ion-input v-model="userDetails.firstName" type="text"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input v-model="userDetails.email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Password</ion-label>
          <ion-input v-model="userDetails.password" type="password"></ion-input>
        </ion-item>
        <ion-button v-if="inRegisterMode" @click="register">
          Register
        </ion-button>
        <ion-button v-else @click="login">
          Login
        </ion-button>
      </ion-list>
      <ion-button @click="googleLogin">
        Login with Google
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonBackButton, IonButtons, IonInput
 } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/firebase.authservice';
import { getIdToken } from "firebase/auth";

const router = useRouter();
const inRegisterMode = ref(false);

const userDetails = ref({
  firstName: '',
  email: '',
  password: ''
});

const register = async() => {
  try {
    await authService.register(userDetails.value.email, userDetails.value.password);
    await login();
    console.log("Login successful");
  } catch (error) {
    console.error(error);
  }
}
const login = async() => {
  try{
    const user = await authService.login(userDetails.value.email, userDetails.value.password);
    const idToken = await user.getIdToken(true);
    localStorage.setItem("auth_token", idToken);

    router.replace('/home');
    console.log('Logged in:', user);
    console.log('UserID:', user.uid);
  }
  catch(error){
    console.error(error);
    console.log("email:", userDetails.value.email);
  }
}
const googleLogin = async() => {
  try {
    const user = await authService.googleLogin();
    const idToken = await getIdToken(user);
    localStorage.setItem("auth_token", idToken);
    router.replace('/home');
    console.log('Logged in:', user);
    console.log('UserID:', user.uid);
  } catch (error) {
    console.error(error);
  }
}

</script>

<style scoped>

</style>