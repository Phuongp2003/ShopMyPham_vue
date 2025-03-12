import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue'; // Import the login view
import OrdersView from '@/views/OrdersView.vue'; // Import the orders view
import ReviewView from '@/views/ReviewView.vue'; // Import the review view

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/login',
			name: 'login',
			component: LoginView, // Add the login route
		},
		{
			path: '/orders',
			name: 'orders',
			component: OrdersView, // Add the orders route
		},
		{
			path: '/review/:orderId',
			name: 'review',
			component: ReviewView, // Add the review route
		},
		{
			path: '/about',
			name: 'about',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/AboutView.vue'),
		},
	],
});

export default router;
