import './assets/tailwind.css'; // Import Tailwind CSS

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth'; // Import the authentication store

const app = createApp(App);

app.use(createPinia());
app.use(router);

const authStore = useAuthStore(); // Initialize the authentication store
authStore.checkAuthStatus(); // Check authentication status on app mount

app.mount('#app');
