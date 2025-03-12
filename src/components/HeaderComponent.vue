<template>
  <header class="bg-pink-200 p-4 flex justify-between items-center">
    <div class="logo">
      <RouterLink to="/"><img src="/images/logo.png" alt="Logo" class="w-12 h-12" /></RouterLink>
    </div>
    <nav class="h-3/4">
      <ul class="flex justify-end list-none p-0 h-full">
        <li class="ml-4 h-full"><RouterLink id="home-link" to="/" class="h-full flex items-center text-black font-bold hover:text-pink-500">Trang chủ</RouterLink></li>
        <li class="ml-4 h-full"><RouterLink id="products-link" to="/products" class="h-full flex items-center text-black font-bold cursor-not-allowed hover:text-pink-500">Sản phẩm</RouterLink></li>
        <li class="ml-4 h-full"><RouterLink id="about-link" to="/about" class="h-full flex items-center text-black font-bold cursor-not-allowed hover:text-pink-500">Giới thiệu</RouterLink></li>
        <li class="ml-4 h-full"><RouterLink id="contact-link" to="/contact" class="h-full flex items-center text-black font-bold cursor-not-allowed hover:text-pink-500">Liên hệ</RouterLink></li>
        <li class="ml-4 h-full"><RouterLink id="cart-link" to="/cart" class="h-full flex items-center text-black font-bold cursor-not-allowed hover:text-pink-500">Giỏ hàng</RouterLink></li>
        <li class="ml-4 relative group">
          <span v-if="authStore.isAuthenticated" id="user-info" class="h-full flex items-center text-black font-bold cursor-pointer hover:text-pink-500">{{ authStore.user.name }}</span>
          <RouterLink v-else to="/login" id="login-redirect" class="h-full flex items-center text-black font-bold hover:text-pink-500">Đăng nhập</RouterLink>
          <div v-if="authStore.isAuthenticated" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden group-hover:block transform -translate-y-3">
            <RouterLink id="profile-link" to="/profile" class="block px-4 py-2 text-pink-500 hover:bg-pink-100">Thông tin tài khoản</RouterLink>
            <RouterLink id="order-link" to="/orders" class="block px-4 py-2 text-pink-500 hover:bg-pink-100">Đơn mua</RouterLink>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-pink-500 hover:bg-pink-100">Đăng xuất</button>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const showDropdown = ref(false);

authStore.checkAuthStatus();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
