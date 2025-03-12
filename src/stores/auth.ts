import { defineStore } from 'pinia';
interface User {
	id: number;
	name: string;
	username: string;
	password: string;
	email: string;
}

export const useAuthStore = defineStore('auth', {
	state: () => ({
		isAuthenticated: false,
		user: null,
	}),
	actions: {
		async login(username: string, password: string) {
			try {
				const response = await fetch('/data/sample.json');
				const sampleData = await response.json();

				const user = sampleData.users.find(
					(user: User) =>
						user.username === username && user.password === password
				);

				if (user) {
					this.isAuthenticated = true;
					this.user = user;
					localStorage.setItem('user', JSON.stringify(this.user));
					return null; // No error
				} else {
					return 'Tên đăng nhập hoặc mật khẩu không đúng';
				}
			} catch (error) {
				return 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.';
			}
		},
		logout() {
			this.isAuthenticated = false;
			this.user = null;
			localStorage.removeItem('user');
		},
		checkAuthStatus() {
			const user = localStorage.getItem('user');
			if (user) {
				this.isAuthenticated = true;
				this.user = JSON.parse(user);
			}
		},
	},
});
