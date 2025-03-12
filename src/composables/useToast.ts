import { ref, h, render, type Ref } from 'vue';
import { defineStore } from 'pinia';
import ToastContainer from './ToastContainer.vue';
import { useIntervalFn } from '@vueuse/core';

export const useToastStore = defineStore('toast', () => {
	const formatCurrency = (amount: number): string => {
		return amount.toLocaleString('vi-VN', {
			style: 'currency',
			currency: 'VND',
		});
	};

	const showToast = (message: string, type: string = 'info') => {
		const toast = ref<{
			id: number;
			message: string;
			type: string;
			progress: number;
			paused: boolean;
			containerId: string;
		} | null>(null);

		const id = Date.now();
		const containerId = `toast-container-${id}`;
		const formattedMessage = formatCurrency(parseFloat(message));
		toast.value = {
			id,
			message: formattedMessage,
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
		toast: Ref<
			{
				id: number;
				message: string;
				type: string;
				progress: number;
				paused: boolean;
				containerId: string;
			} | null,
			| {
					id: number;
					message: string;
					type: string;
					progress: number;
					paused: boolean;
					containerId: string;
			  }
			| {
					id: number;
					message: string;
					type: string;
					progress: number;
					paused: boolean;
					containerId: string;
			  }
			| null
		>,
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
