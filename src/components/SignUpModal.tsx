import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Modal.css';

declare const google: any;

interface SignUpModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSwitchToLogin: () => void;
}

const SignUpModal = ({ isOpen, onClose, onSwitchToLogin }: SignUpModalProps) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
        phone: 0,
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);
	const { signup } = useAuth();

	useEffect(() => {
		// Render Google Sign-In button in modal
		if (isOpen && typeof google !== 'undefined' && google.accounts) {
			setTimeout(() => {
				const googleBtn = document.querySelector('.signup-google-signin');
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
			await signup(formData);
			setSuccess('Account created successfully! Please check your email to verify.');
			setFormData({ name: '', email: '', password: '', phone: 0 });

			// Switch to login after 2 seconds
			setTimeout(() => {
				onSwitchToLogin();
			}, 2000);
		} catch (err: any) {
			setError(err.message || 'Sign up failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setFormData({ name: '', email: '', password: '', phone: 0 });
		setError('');
		setSuccess('');
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="modal" onClick={handleClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<span className="close" onClick={handleClose}>&times;</span>
				<h2>Create Account</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="signup-name">Full Name</label>
						<input
							type="text"
							id="signup-name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="signup-email">Email</label>
						<input
							type="email"
							id="signup-email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="signup-password">Password</label>
						<input
							type="password"
							id="signup-password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							minLength={6}
						/>
					</div>
                    <div className="form-group">
                        <label htmlFor="signup-phone">Phone Number</label>
                        <input
                            type="tel"
                            id="signup-phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
					{error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}
					{success && <div className="success-message" style={{ display: 'block' }}>{success}</div>}
					<div className="form-actions">
						<button type="submit" disabled={loading}>
							{loading ? 'Signing up...' : 'Sign Up'}
						</button>
					</div>
				</form>
				<div className="divider">
					<span>OR</span>
				</div>
				<div className="signup-google-signin"></div>
				<div className="switch-auth">
					Already have an account? <a onClick={onSwitchToLogin}>Login</a>
				</div>
			</div>
		</div>
	);
};

export default SignUpModal;