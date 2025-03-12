<template>
  <div class="flex justify-center items-center h-screen">
    <div class="bg-pink-200 p-8 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold mb-4 text-center">Đăng nhập</h1>
      <form @submit.prevent="submitLogin" class="space-y-4">
        <div>
          <label for="username" class="block mb-2">Tên đăng nhập</label>
          <input type="text" v-model="username" id="username" required class="w-full p-2 border rounded" />
          <p v-if="usernameError" id="username-error" class="text-red-500">{{ usernameError }}</p>
        </div>
        <div>
          <label for="password" class="block mb-2">Mật khẩu</label>
          <input type="password" v-model="password" id="password" required class="w-full p-2 border rounded" />
          <p v-if="passwordError" id="password-error" class="text-red-500">{{ passwordError }}</p>
        </div>
        <button type="submit" id="login-button" class="w-full bg-blue-200 p-2 rounded hover:bg-blue-300">Đăng nhập</button>
        <p v-if="loginError" id="login-error" class="text-red-500 text-center">{{ loginError }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { useToastStore } from '../composables/useToast';

const username = ref('');
const password = ref('');
const usernameError = ref('');
const passwordError = ref('');
const loginError = ref('');
const authStore = useAuthStore();
const router = useRouter();
const toastStore = useToastStore();

const submitLogin = async () => {
  let hasError = false;

  if (!username.value) {
    usernameError.value = 'Tên đăng nhập không được để trống';
    hasError = true;
  } else {
    usernameError.value = '';
  }

  if (!password.value) {
    passwordError.value = 'Mật khẩu không được để trống';
    hasError = true;
  } else if (password.value.length < 8) {
    passwordError.value = 'Mật khẩu phải có ít nhất 8 ký tự';
    hasError = true;
  } else {
    passwordError.value = '';
  }

  if (hasError) {
    toastStore.showToast('Thông tin đăng nhập sai, vui lòng kiểm tra lại', 'error');
    return;
  }

  const error = await authStore.login(username.value, password.value);
  if (error) {
    loginError.value = error;
    toastStore.showToast(error, 'error');
  } else {
    router.push('/');
    toastStore.showToast('Đăng nhập thành công', 'success');
  }
};
</script>
