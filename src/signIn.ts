declare const google: any;

window.addEventListener('load', function () {
	const signInBtn = document.querySelector<HTMLElement>('.g_id_signin');
	const signOutBtn = document.querySelector<HTMLElement>('.g_id_signout');
	const userContainer = document.querySelector<HTMLElement>('.userDetails');
	const signUpBtn = document.querySelector<HTMLElement>('.signUpBtn');
	const loginBtn = document.querySelector<HTMLElement>('.loginBtn');

	initializeModals();
	initializeEmailAuth();

	if (signOutBtn && userContainer && signInBtn && signUpBtn && loginBtn) {
		signOutBtn.style.display = 'none';
		userContainer.style.display = 'none';

		signOutBtn.addEventListener('click', async () => {
			console.log('signout button was clicked');

			try {
				await fetch(`http://localhost:3000/auth/logout`, {
					method: 'POST',
					credentials: 'include',
				});
			} catch (error) {
				console.error('Logout error:', error);
			}

			userContainer.textContent = '';
			signOutBtn.style.display = 'none';
			userContainer.style.display = 'none';
			signUpBtn.style.display = 'block';
			loginBtn.style.display = 'block';
			signInBtn.style.display = 'block';
			google.accounts.id.disableAutoSelect();
			console.log('User signed out');
		});
	}
});

async function handleCredentialResponse(response: {
	credential: string;
}): Promise<void> {
	const g_token = response.credential;
	const validity = await fetch('http://localhost:3000/auth/google', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token: g_token }),
		credentials: 'include',
	});

	const responsePayload = await validity.json();

	if (!responsePayload.ok) {
		console.error(responsePayload.error);
		return;
	}

	updateUIForLoggedInUser(responsePayload);
}

function updateUIForLoggedInUser(userData: any): void {
	const userContainer = document.querySelector<HTMLElement>('.userDetails');
	const signInBtn = document.querySelector<HTMLElement>('.g_id_signin');
	const signOutBtn = document.querySelector<HTMLElement>('.g_id_signout');
	const signUpBtn = document.querySelector<HTMLElement>('.signUpBtn');
	const loginBtn = document.querySelector<HTMLElement>('.loginBtn');

	if (userContainer && signInBtn && signOutBtn && signUpBtn && loginBtn) {
		const name: string =
			userData.given_name || userData.name || userData.email.split('@')[0];
		userContainer.textContent = `Hello, ${name}`;
		console.log(`username = ${name}`);
		console.log(`email = ${userData.email}`);

		userContainer.style.display = 'block';
		signOutBtn.style.display = 'block';

		signUpBtn.style.display = 'none';
		loginBtn.style.display = 'none';

		// Close any open modals
		const modals = document.querySelectorAll<HTMLElement>('.modal');
		modals.forEach((modal) => (modal.style.display = 'none'));
	}
}

function initializeModals(): void {
	const signupModal = document.getElementById('signupModal') as HTMLElement;
	const loginModal = document.getElementById('loginModal') as HTMLElement;
	const signUpBtn = document.querySelector<HTMLElement>('.signUpBtn');
	const loginBtn = document.querySelector<HTMLElement>('.loginBtn');
	const closeBtns = document.querySelectorAll<HTMLElement>('.close');
	const switchToLogin = document.getElementById('switchToLogin') as HTMLElement;
	const switchToSignup = document.getElementById(
		'switchToSignup'
	) as HTMLElement;

	// Open modals
	signUpBtn?.addEventListener('click', () => {
		if (signupModal) signupModal.style.display = 'block';
	});

	loginBtn?.addEventListener('click', () => {
		if (loginModal) loginModal.style.display = 'block';
	});

	// Close modals
	closeBtns.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;
			const modalId = target.getAttribute('data-modal');
			const modal = document.getElementById(modalId || '');
			if (modal) modal.style.display = 'none';
		});
	});

	switchToLogin?.addEventListener('click', () => {
		if (signupModal) signupModal.style.display = 'none';
		if (loginModal) loginModal.style.display = 'block';
	});

	switchToSignup?.addEventListener('click', () => {
		if (loginModal) loginModal.style.display = 'none';
		if (signupModal) signupModal.style.display = 'block';
	});

	window.addEventListener('click', (e) => {
		if (e.target === signupModal) {
			signupModal.style.display = 'none';
		}
		if (e.target === loginModal) {
			loginModal.style.display = 'none';
		}
	});
}

function initializeEmailAuth(): void {
	const signupForm = document.getElementById('signupForm') as HTMLFormElement;
	const loginForm = document.getElementById('loginForm') as HTMLFormElement;

	// Sign Up Form Handler
	signupForm?.addEventListener('submit', async (e) => {
		e.preventDefault();

		const errorEl = document.getElementById('signup-error');
		const successEl = document.getElementById('signup-success');
		if (errorEl) errorEl.style.display = 'none';
		if (successEl) successEl.style.display = 'none';

		const formData = {
			name: (document.getElementById('signup-name') as HTMLInputElement).value,
			email: (document.getElementById('signup-email') as HTMLInputElement)
				.value,
			password: (document.getElementById('signup-password') as HTMLInputElement)
				.value,
			phoneNumber: (document.getElementById('signup-phone') as HTMLInputElement)
				.value,
		};
		try {
			const response = await fetch(`http://localhost:3000/auth/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
				credentials: 'include',
			});
			const data = await response.json();
			if (response.ok) {
				if (successEl) {
					successEl.textContent =
						'Account created successfully! Please check your email to verify.';
					successEl.style.display = 'block';
				}
				signupForm.reset();
				setTimeout(() => {
					const signupModal = document.getElementById('signupModal');
					const loginModal = document.getElementById('loginModal');
					if (signupModal) signupModal.style.display = 'none';
					if (loginModal) loginModal.style.display = 'block';
				}, 2000);
			} else {
				if (errorEl) {
					errorEl.textContent =
						data.error || 'Sign up failed. Please try again.';
					errorEl.style.display = 'block';
				}
			}
		} catch (error) {
			if (errorEl) {
				errorEl.textContent = 'Network error. Please try again.';
				errorEl.style.display = 'block';
			}
			console.error('Signup error:', error);
		}
	});

	loginForm?.addEventListener('submit', async (e) => {
		e.preventDefault();

		const errorEl = document.getElementById('login-error');
		const successEl = document.getElementById('login-success');
		if (errorEl) errorEl.style.display = 'none';
		if (successEl) successEl.style.display = 'none';

		const formData = {
			email: (document.getElementById('login-email') as HTMLInputElement).value,
			password: (document.getElementById('login-password') as HTMLInputElement)
				.value,
		};

		try {
			const response = await fetch(`http://localhost:3000/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
				credentials: 'include',
			});

			const data = await response.json();

			if (response.ok) {
				if (successEl) {
					successEl.textContent = 'Login successful!';
					successEl.style.display = 'block';
				}

				// Update UI to show logged in state
				updateUIForLoggedInUser(data);

				setTimeout(() => {
					const loginModal = document.getElementById('loginModal');
					if (loginModal) loginModal.style.display = 'none';
				}, 1000);
			} else {
				if (errorEl) {
					errorEl.textContent =
						data.error || 'Login failed. Please check your credentials.';
					errorEl.style.display = 'block';
				}
			}
		} catch (error) {
			if (errorEl) {
				errorEl.textContent = 'Network error. Please try again.';
				errorEl.style.display = 'block';
			}
			console.error('Login error:', error);
		}
	});
}

(window as any).handleCredentialResponse = handleCredentialResponse;
