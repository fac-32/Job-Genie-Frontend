import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import WishlistGenerator from './components/WishlistGenerator';

import './App.css';

function App() {
	// State management
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const { user, loading: authLoading } = useAuth();


	if (authLoading) {
        return (
            <div className="app">
                <Navbar />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading JobGenie...</p>
                </div>
            </div>
        );
    }

	return (
        <div className="app">
            <Navbar />
            {user ? (
                <WishlistGenerator />
            ) : (
                <div className="welcome-container">
                    <h1>Welcome to JobGenie</h1>
                    <p>
                        Please <strong>sign in</strong> to generate your wishlist of 
                        dream companies and track open roles.
                    </p>
                    <div className="signin-prompt">
                        <a href="/auth/signin" className="signin-btn">
                            Get Started → Sign In
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
