<template>
  <div class="relative m-4 w-36">
    <div class="overflow-hidden relative w-full h-36">
      <div class="transition-transform duration-300 hover:scale-105">
        <img :src="image" :alt="name" class="w-full h-full object-cover" />
      </div>
      <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-70 flex items-center justify-center">
        <p class="text-white">View Details</p>
      </div>
    </div>
    <div class="text-center mt-2">
      <p class="font-bold">{{ name }}</p>
      <p>{{ price }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  name: String,
  image: String,
  price: String
});
</script>
