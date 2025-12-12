import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Modal.css';

declare const google: any;

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSwitchToSignUp: () => void;
}

const LoginModal = ({ isOpen, onClose, onSwitchToSignUp }: LoginModalProps) => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();

	useEffect(() => {
		// Render Google Sign-In button in modal
		if (isOpen && typeof google !== 'undefined' && google.accounts) {
			setTimeout(() => {
				const googleBtn = document.querySelector('.login-google-signin');
				if (googleBtn) {
					google.accounts.id.renderButton(googleBtn, {
						theme: 'outline',
						size: 'large',
						width: '100%',
					});
				}
			}, 100);
		}
	}, [isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(true);

		try {
			await login({ email: formData.email, password: formData.password });
			setSuccess('Login successful!');
			setFormData({ email: '', password: '' });

			// Close modal after 1 second
			setTimeout(() => {
				onClose();
			}, 1000);
		} catch (err: any) {
			setError(err.message || 'Login failed. Please check your credentials.');
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setFormData({ email: '', password: '' });
		setError('');
		setSuccess('');
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="modal" onClick={handleClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<span className="close" onClick={handleClose}>&times;</span>
				<h2>Login</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="login-email">Email</label>
						<input
							type="email"
							id="login-email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="login-password">Password</label>
						<input
							type="password"
							id="login-password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>
					{error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}
					{success && <div className="success-message" style={{ display: 'block' }}>{success}</div>}
					<div className="form-actions">
						<button type="submit" disabled={loading}>
							{loading ? 'Logging in...' : 'Login'}
						</button>
					</div>
				</form>
				<div className="divider">
					<span>OR</span>
				</div>
				<div className="login-google-signin"></div>
				<div className="switch-auth">
					Don't have an account? <a onClick={onSwitchToSignUp}>Sign Up</a>
				</div>
			</div>
		</div>
	);
};

export default LoginModal;