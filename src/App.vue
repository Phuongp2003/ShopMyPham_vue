<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderComponent from '@/components/HeaderComponent.vue';
</script>

<template>
  <div class="flex flex-col h-screen">
    <HeaderComponent class="flex-shrink-0"/>
    <div class="flex-grow overflow-hidden">
      <RouterView class="h-full overflow-y-scroll scrollbar-hide"/>
    </div>
    <div id="toasts-box" class="fixed bottom-4 right-4 gap-2 flex flex-col"></div>
  </div>
</template>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
