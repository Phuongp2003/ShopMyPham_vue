<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Đơn hàng của bạn</h1>
    <div class="flex justify-start mb-4">
      <button @click="filterOrders('all')" :class="buttonClass('all')" class="px-4 py-2 rounded hover:bg-pink-300">Tất cả</button>
      <button @click="filterOrders('pending')" :class="buttonClass('pending')" class="px-4 py-2 rounded hover:bg-pink-300">Chờ giao hàng</button>
      <button @click="filterOrders('completed')" :class="buttonClass('completed')" class="px-4 py-2 rounded hover:bg-pink-300">Hoàn thành</button>
      <button @click="filterOrders('cancelled')" :class="buttonClass('cancelled')" class="px-4 py-2 rounded hover:bg-pink-300">Đã hủy</button>
    </div>
    <div v-for="order in filteredOrders" :key="order.id" class="mb-4 p-4 bg-gray-100 rounded shadow">
      <div v-for="product in getProductDetails(order.productIds)" :key="product.id" class="flex mb-2 justify-between">
        <div class="flex">
          <img :src="`/images/${product.image}`" alt="product.name" class="w-16 h-16 mr-4"/>
          <div>
            <p>{{ product.name }}</p>
            <p>Số lượng: {{ getProductQuantity(order.productIds, product.id) }}</p>
            <div v-if="product.reviewed" class="grid grid-cols-2 gap-4">
              <div>
                <div class="flex mb-2">
                  <StartIcon v-for="star in 5" :key="star" :class="{'text-yellow-500': star <= product.rating, 'text-gray-300': star > product.rating}" class="w-6 h-6"/>
                </div>
                <p>Nhận xét: {{ product.comment }}</p>
                <p>Thời gian đánh giá: {{ product.reviewTime }}</p>
              </div>
              <div>
                <div v-if="product.images.length">
                  <img v-for="image in product.images" :src="image" :alt="product.name" class="w-16 h-16 mr-2"/>
                </div>
                <div v-else>
                  <p>Không có ảnh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="font-bold">{{ formatCurrency(getProductTotal(product.price, getProductQuantity(order.productIds, product.id))) }}</p>
      </div>
      <div class="flex justify-between items-center">
        <p :class="statusClass(order.status)">{{ getStatusText(order.status) }}</p>
        <p class="font-bold">Thành tiền: {{ formatCurrency(order.total) }}</p>
      </div>
      <div v-if="order.status === 'completed' && !order.reviewed" class="mt-4">
        <RouterLink :to="{ name: 'review', params: { orderId: order.id } }" class="w-full bg-orange-500 text-white py-2 rounded text-center block hover:bg-orange-600">Đánh giá</RouterLink>
      </div>
      <div v-else-if="order.status === 'completed' && order.reviewed" class="mt-4">
        <RouterLink :to="{ name: 'review', params: { orderId: order.id } }" class="w-full bg-blue-500 text-white py-2 rounded text-center block hover:bg-blue-600">Sửa/Xóa đánh giá</RouterLink>
      </div>
    </div>
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import StartIcon from '../icons/StartIcon.vue';

const orders = ref([]);
const products = ref([]);
const filter = ref('all');
const allReviews = ref({});

onMounted(async () => {
  const response = await fetch(
					`/data/sample.json`
				);
  const sampleData = await response.json();
  orders.value = sampleData.orders.filter(order => order.userId === 3);
  products.value = sampleData.products;
  allReviews.value = JSON.parse(sessionStorage.getItem('reviews')) || {};
  orders.value.forEach(order => {
    const storedReviews = allReviews.value[order.id] || [];
    order.reviewed = storedReviews.length > 0;
    order.productIds.forEach(productId => {
      const product = products.value.find(p => p.id === productId);
      if (product) {
        const storedReview = storedReviews.find(review => review.id === productId);
        if (storedReview) {
          product.reviewed = true;
          product.rating = storedReview.rating;
          product.comment = storedReview.comment;
          product.reviewTime = storedReview.reviewTime;
          product.images = storedReview.images;
        }
      }
    });
  });
});

const filteredOrders = computed(() => {
  if (filter.value === 'all') return orders.value;
  return orders.value.filter(order => order.status === filter.value);
});

const filterOrders = (status) => {
  filter.value = status;
};

const getProductDetails = (productIds) => {
  return products.value.filter(product => productIds.includes(product.id));
};

const getProductQuantity = (productIds, productId) => {
  return productIds.filter(id => id === productId).length;
};

const getProductTotal = (price, quantity) => {
  return price * quantity;
};

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'pending':
      return 'Chờ giao hàng';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return '';
  }
};

const statusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'text-green-500';
    case 'pending':
      return 'text-yellow-500';
    case 'cancelled':
      return 'text-red-500';
    default:
      return '';
  }
};

const buttonClass = (status) => {
  return filter.value === status ? 'bg-pink-200' : 'bg-gray-200';
};

const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
</script>
