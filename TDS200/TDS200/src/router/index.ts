import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import AuthenticationPage from '@/views/AuthenticationPage.vue';
import HomePage from '@/views/HomePage.vue';
import NewPostPage from '@/views/NewPostPage.vue';
import DetailPage from '@/views/DetailPage.vue';
import ExhibitionPage from '@/views/ExhibitionPage.vue';
import ExhibitionDetailPage from '@/views/ExhibitionDetailPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthenticationPage,
  },
  {
    path: '/new-post',
    name: 'NewPost',
    component: NewPostPage,
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: DetailPage,
  },
  {
    path: '/exhibitions',
    name: 'Exhibitions',
    component: ExhibitionPage,
  },
  {
    path: '/exhibitions/:id',
    name: 'ExhibitionDetail',
    component: ExhibitionDetailPage,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router