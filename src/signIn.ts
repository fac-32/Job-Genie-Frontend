declare const google: any;

window.addEventListener('load', function () {
	const signInBtn = document.querySelector<HTMLElement>('.g_id_signin');
	const signOutBtn = document.querySelector<HTMLElement>('.g_id_signout');
	const userContainer = document.querySelector<HTMLElement>('.userDetails');

	console.log('this is working');
	console.log(window.location.origin);

	if (signOutBtn && userContainer && signInBtn) {
		signOutBtn.style.display = 'none';
		userContainer.style.display = 'none';

		signOutBtn.addEventListener('click', () => {
			console.log('signout button was clicked');
			userContainer.textContent = '';
			signOutBtn.style.display = 'none';
			signInBtn.style.display = 'block';
			google.accounts.id.disableAutoSelect();
			console.log('User signed out');
		});

		google.accounts.id.initialize({
			client_id:
				'1053566652974-1n8a3icl9qbbt76vhlh0gdcjeeo4j476.apps.googleusercontent.com',
			callback: handleCredentialResponse,
			use_fedcm_for_prompt: false,
		});

		google.accounts.id.renderButton(signInBtn, {
			theme: 'outline',
			size: 'small',
		});
	}
});

async function handleCredentialResponse(response: {
	credential: string;
}): Promise<void> {
	const token = response.credential;
	localStorage.setItem('token', token);

	const validity = await fetch('http://localhost:3000/auth/google', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token }),
	});

	const responsePayload = decodeJwtResponse(token);

	const userContainer = document.querySelector<HTMLElement>('.userDetails');
	const signInBtn = document.querySelector<HTMLElement>('.g_id_signin');
	const signOutBtn = document.querySelector<HTMLElement>('.g_id_signout');

	if (userContainer && signInBtn && signOutBtn) {
		const name: string = responsePayload.given_name || 'User';
		userContainer.textContent = `Hello, ${name}`;
		console.log(`username = ${name}`);
		console.log(`email = ${responsePayload.email}`);

		localStorage.setItem('userEmail', responsePayload.email);

		userContainer.style.display = 'block';
		signInBtn.style.display = 'none';
		signOutBtn.style.display = 'block';
	}
}

(window as any).handleCredentialResponse = handleCredentialResponse;

interface JwtPayload {
	given_name: string;
	email: string;
	[key: string]: any;
}

function decodeJwtResponse(token: string): JwtPayload {
	let base64Url = token.split('.')[1];
	let base64 = base64Url!.replace(/-/g, '+').replace(/_/g, '/');
	let jsonPayload = decodeURIComponent(
		atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);

	return JSON.parse(jsonPayload);
}
