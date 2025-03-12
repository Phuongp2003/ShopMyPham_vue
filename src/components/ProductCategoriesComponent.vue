<template>
  <section class="product-categories text-center my-8">
    <h2 class="text-2xl font-bold mb-4">Danh mục sản phẩm</h2>
    <div class="categories flex justify-around flex-wrap">
      <ProductComponent
        v-for="product in products"
        :key="product.id"
        :name="product.name"
        :image="`/images/${product.image}`"
        :price="`${product.price} VND`"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductComponent from './ProductComponent.vue';

const products = ref([]);

onMounted(async () => {
  const response = await fetch('/data/sample.json');
  const sampleData = await response.json();
  products.value = sampleData.products;
});
</script>
