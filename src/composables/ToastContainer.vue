<template>
  <Teleport to="#toasts-box">
    <div v-if="toast" :id="`${toast.id}`" class="bottom-4 right-4 p-6 rounded shadow-lg relative" :class="toastClass(toast.type)" @mouseover="pauseTimer" @mouseleave="resumeTimer">
      <button @click="closeToast(toast, toast.containerId)" class="absolute top-2 right-2 text-white z-10">✕</button>
      {{ toast.message }}
      <div class="h-1 bg-gray-600 bottom-[1px] left-0 absolute w-full">
        <div :style="{ width: toast.progress + '%' }" class="h-full bg-white"></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  toast: {
    type: Object,
    required: true
  },
  closeToast: {
    type: Function,
    required: true
  }
});

const toastClass = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-500 text-white';
    case 'error':
      return 'bg-red-500 text-white';
    case 'info':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const pauseTimer = () => {
  if (props.toast) {
    props.toast.paused = true;
  }
};

const resumeTimer = () => {
  if (props.toast) {
    props.toast.paused = false;
  }
};
</script>

<style scoped>
.fixed {
  position: fixed;
}
.bottom-4 {
  bottom: 1rem;
}
.right-4 {
  right: 1rem;
}
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}
</style>
