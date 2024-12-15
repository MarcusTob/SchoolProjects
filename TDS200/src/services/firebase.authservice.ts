import { Capacitor } from "@capacitor/core";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    initializeAuth,
    indexedDBLocalPersistence
} from "firebase/auth";
import { firebaseApp } from "@/main";

export const authService = {
    async register(email: string, password: string){
        const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password)
        return userCredential?.user;
    },

    async login(email: string, password: string){
        const userCredential = await signInWithEmailAndPassword(getAuth(), email, password)
        return userCredential?.user;
    },
    async currentUser() {
        return whichAuth().currentUser
    },
    async logout(){
        return await signOut(getAuth());
    },
    async googleLogin() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(getAuth(), provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;
            return user;
          } catch (error) {
              console.error("Error during Google Sign-In:", error);
              return null; 
          }
      }

}

export const whichAuth = () => {
    let auth;
    if (Capacitor.isNativePlatform()) {
      auth = initializeAuth(firebaseApp, {
        persistence: indexedDBLocalPersistence,
      });
    } else {
      auth = getAuth(firebaseApp);
    }
    return auth;
  }
  