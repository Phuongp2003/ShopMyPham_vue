<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Đánh giá sản phẩm</h1>
    <div v-for="product in orderProducts" :key="product.id" class="mb-4 p-4 bg-gray-100 rounded shadow">
      <div class="flex mb-2">
        <img :src="`/images/${product.image}`" alt="product.name" class="w-16 h-16 mr-4"/>
        <div>
          <p>{{ product.name }}</p>
          <p>Số lượng: {{ getProductQuantity(order.productIds, product.id) }}</p>
        </div>
      </div>
      <div v-if="product.reviewed" class="grid grid-cols-2 gap-4">
        <div>
          <div class="flex mb-2">
            <StartIcon v-for="star in 5" :key="star" :class="{'text-yellow-500': star <= product.rating, 'text-gray-300': star > product.rating}" class="w-6 h-6"/>
          </div>
          <p class="mb-2">Nhận xét: {{ product.comment }}</p>
          <p class="mb-2">Thời gian đánh giá: {{ product.reviewTime }}</p>
        </div>
        <div>
          <div v-if="product.images.length">
            <img v-for="image in product.images" :src="image" :alt="product.name" class="w-16 h-16 mr-2"/>
          </div>
          <div v-else>
            <p>Không có ảnh</p>
          </div>
        </div>
        <div class="flex justify-between col-span-2">
          <button @click="editReview(product)" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Sửa</button>
        </div>
      </div>
      <div v-else>
        <div class="mb-2">
          <label for="rating" class="block mb-1">Chọn số sao:</label>
          <div class="flex">
            <StartIcon v-for="star in 5" :key="star" :class="{'text-yellow-500': star <= product.rating, 'text-gray-300': star > product.rating}" class="w-6 h-6 cursor-pointer" @click="product.rating = star"/>
          </div>
          <p v-if="product.ratingError" class="text-red-500">{{ product.ratingError }}</p>
        </div>
        <div class="mb-2">
          <label for="comment" class="block mb-1">Nhận xét:</label>
          <textarea id="comment" v-model="product.comment" class="w-full p-2 border rounded"></textarea>
        </div>
        <div class="mb-2">
          <label for="images" class="block mb-1">Hình ảnh:</label>
          <input type="file" id="images" multiple @change="handleImageUpload($event, product)" class="w-full p-2 border rounded"/>
        </div>
      </div>
    </div>
    <div class="flex justify-between">
      <RouterLink to="/orders" class="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400">Trở lại</RouterLink>
      <button @click="submitReview" class="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600">Gửi</button>
      <button v-if="orderProducts.some(product => product.reviewed)" @click="deleteReview" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Xóa đánh giá</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StartIcon from '../icons/StartIcon.vue';
import { useToastStore } from '../composables/useToast';

const route = useRoute();
const router = useRouter();
const orderId = route.params.orderId;
const order = ref(null);
const products = ref([]);
const orderProducts = ref([]);
const allReviews = ref({});
const toastStore = useToastStore();

onMounted(async () => {
  const response = await fetch(
					`/data/sample.json`
				);
  const sampleData = await response.json();
  order.value = sampleData.orders.find(order => order.id === parseInt(orderId));
  products.value = sampleData.products;
  allReviews.value = JSON.parse(sessionStorage.getItem('reviews')) || {};
  const storedReviews = allReviews.value[orderId] || [];
  orderProducts.value = getProductDetails(order.value.productIds).map(product => {
    const storedReview = storedReviews.find(review => review.id === product.id);
    return {
      ...product,
      rating: storedReview ? storedReview.rating : null,
      comment: storedReview ? storedReview.comment : '',
      images: storedReview ? storedReview.images : [],
      reviewed: !!storedReview,
      reviewTime: storedReview ? storedReview.reviewTime : '',
      ratingError: ''
    };
  });
});

const getProductDetails = (productIds) => {
  return products.value.filter(product => productIds.includes(product.id));
};

const getProductQuantity = (productIds, productId) => {
  return productIds.filter(id => id === productId).length;
};

const handleImageUpload = (event, product) => {
  const files = event.target.files;
  const images = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (e) => {
      const uniqueName = `${Date.now()}_${file.name}`;
      images.push(e.target.result);
      product.images.push(`/uploads/${uniqueName}`);
    };
    reader.readAsDataURL(file);
  }
};

const submitReview = () => {
  let hasError = false;
  orderProducts.value.forEach(product => {
    if (product.rating < 1) {
      product.ratingError = 'Số sao phải lớn hơn 1';
      hasError = true;
    } else {
      product.ratingError = '';
    }
  });

  if (hasError) {
    toastStore.showToast('Vui lòng kiểm tra lại các lỗi trên form', 'error');
    return;
  }

  const reviews = orderProducts.value.map(product => ({
    id: product.id,
    rating: product.rating,
    comment: product.comment,
    images: product.images,
    reviewTime: new Date().toLocaleString()
  }));
  allReviews.value[orderId] = reviews;
  sessionStorage.setItem('reviews', JSON.stringify(allReviews.value));
  orderProducts.value.forEach(product => {
    if (!product.reviewed) {
      product.reviewed = true;
      product.reviewTime = new Date().toLocaleString();
    }
  });
  toastStore.showToast('Đánh giá của bạn đã được gửi', 'success');
  router.push('/orders');
};

const editReview = (product) => {
  product.reviewed = false;
};

const deleteReview = () => {
  delete allReviews.value[orderId];
  sessionStorage.setItem('reviews', JSON.stringify(allReviews.value));
  toastStore.showToast('Đánh giá của bạn đã được xóa', 'success');
  router.push('/orders');
};
</script>
