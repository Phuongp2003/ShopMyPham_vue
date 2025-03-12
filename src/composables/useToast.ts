import { ref, h, render, type Ref } from 'vue';
import { defineStore } from 'pinia';
import ToastContainer from './ToastContainer.vue';
import { useIntervalFn } from '@vueuse/core';

export const useToastStore = defineStore('toast', () => {
	const showToast = (message: string, type: string = 'info', id?: string) => {
		const toast = ref<{
			id: string;
			message: string;
			type: string;
			progress: number;
			paused: boolean;
			containerId: string;
		} | null>(null);

		const toastId = id || `toast-container-${Date.now().toString()}`;
		const containerId = toastId;
		toast.value = {
			id: toastId,
			message,
			type,
			progress: 100,
			paused: false,
			containerId,
		};

		const container = document.createElement('div');
		container.id = containerId;
		document.body.appendChild(container);
		render(
			h(ToastContainer, { toast: toast.value, closeToast }),
			container
		);

		const interval = useIntervalFn(() => {
			if (toast.value && !toast.value.paused) {
				toast.value.progress -= 1;
				if (toast.value.progress <= 0) {
					interval.pause();
					closeToast(toast, containerId);
				}
			}
		}, 50);
	};

	const closeToast = (
		toast: Ref<{
			id: string;
			message: string;
			type: string;
			progress: number;
			paused: boolean;
			containerId: string;
		} | null>,
		containerId: string
	) => {
		toast.value = null;
		let container = document.getElementById(containerId);
		while (container && container.parentNode) {
			container.parentNode.removeChild(container);
			container = document.getElementById(containerId);
		}
	};

	return { showToast, closeToast };
});
