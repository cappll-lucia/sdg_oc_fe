export default (function () {
	let token: string | null = null;

	return {
		get() {
			if (!token) token = localStorage.getItem('token');
			return token;
		},

		set(_token: string) {
			localStorage.setItem('token', _token);
		},

		delete() {
			localStorage.removeItem('token');
			token = null;
		},
	};
})();