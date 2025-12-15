import { useState, useEffect } from 'react';
import SignUpModal from './SignUpModal';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

declare const google: any;

const Navbar = () => {
	const [showSignUp, setShowSignUp] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const { user, login, logout, isAuthenticated } = useAuth();

	useEffect(() => {
		// Initialize Google Sign-In
		if (typeof google !== 'undefined' && google.accounts) {
			google.accounts.id.initialize({
				client_id: '1053566652974-hubbhc366hubee59f4a8fdfek1lif8qb.apps.googleusercontent.com',
				callback: handleGoogleCallback,
				use_fedcm_for_prompt: false,
			});

			// Render Google Sign-In button in navbar
			const googleBtn = document.querySelector('.navbar-google-signin');
			if (googleBtn && !isAuthenticated) {
				google.accounts.id.renderButton(googleBtn, {
					theme: 'outline',
					size: 'medium',
				});
			}
		}
	}, [isAuthenticated]);

	const handleGoogleCallback = async (response: { credential: string }) => {
		try {
			await login({ token: response.credential, provider: 'google' });
		} catch (error) {
			console.error('Google sign-in error:', error);
		}
	};

	const handleLogout = async () => {
		await logout();
		if (typeof google !== 'undefined') {
			google.accounts.id.disableAutoSelect();
		}
	};

	return (
		<>
			<nav id="navbar">
				<div className="wrapper-container">
					<div className="container">
						<div className="web-items">
							<div className="website-name">
								<img src="/src/assets/Logo.png" alt="JobGenie Logo" className="logo" />
								<h1>JobGenie</h1>
							</div>
							<nav className="nav-links">
								<ul>
									<li><a href="#wishlist">Wishlist</a></li>
									<li><a href="#resume">Resume</a></li>
								</ul>
							</nav>
						</div>
						<div className="user-info">
							{isAuthenticated ? (
								<>
									<div className="userDetails">
										Hello, {user?.name || user?.given_name || 'User'}
									</div>
									<button className="logout-btn" onClick={handleLogout}>
										Logout
									</button>
								</>
							) : (
								<>
									<button className="loginBtn" onClick={() => setShowLogin(true)}>
										Login
									</button>
									<button className="signUpBtn" onClick={() => setShowSignUp(true)}>
										Sign Up
									</button>
									<div className="navbar-google-signin"></div>
								</>
							)}
						</div>
					</div>
				</div>
			</nav>

			<SignUpModal
				isOpen={showSignUp}
				onClose={() => setShowSignUp(false)}
				onSwitchToLogin={() => {
					setShowSignUp(false);
					setShowLogin(true);
				}}
			/>

			<LoginModal
				isOpen={showLogin}
				onClose={() => setShowLogin(false)}
				onSwitchToSignUp={() => {
					setShowLogin(false);
					setShowSignUp(true);
				}}
			/>
		</>
	);
};

export default Navbar;