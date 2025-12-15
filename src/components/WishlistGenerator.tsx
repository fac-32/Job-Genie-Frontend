import { useState, FormEvent } from 'react';
import './WishlistGenerator.css';

interface WishlistFilters {
	industry?: string;
	size?: string;
	city?: string;
	country?: string;
}

interface Company {
	id: string;
	name: string;
	industry: string;
	size: string;
	city: string[] | string; // Backend might return string or array
	country: string;
	description: string;
	logoUrl: string;
	websiteUrl: string;
}

interface WishlistResponse {
	success: boolean;
	total: number;
	companies: Company[];
}

const WishlistGenerator = () => {
	const [filters, setFilters] = useState<WishlistFilters>({
		industry: '',
		size: '',
		city: '',
		country: 'United Kingdom',
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setSuccess(false);
		setError(false);

		// Remove empty filters
		const cleanFilters: Record<string, string> = {};
		Object.entries(filters).forEach(([key, value]) => {
			if (value) cleanFilters[key] = value;
		});

		console.log('🎯 Generating wishlist with filters:', cleanFilters);

		try {
			const queryParams = new URLSearchParams(cleanFilters).toString();
			const url = `http://localhost:3000/api/wishlist/generate?${queryParams}`;

			console.log('📡 Making request to:', url);

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data: WishlistResponse = await response.json();

			if (response.ok && data.success) {
				console.log('✅ Wishlist generated successfully!');
				console.log(`📊 Total companies: ${data.total}`);
				console.log('🏢 Companies:', data.companies);

				// Log each company nicely
				data.companies.forEach((company, index) => {
					// Handle city as either string or array
					const cityDisplay = Array.isArray(company.city) 
						? company.city.join(', ') 
						: company.city;
					
					console.log(`
Company ${index + 1}:
  Name: ${company.name}
  Industry: ${company.industry}
  Size: ${company.size}
  Location: ${cityDisplay}, ${company.country}
  Description: ${company.description}
  Website: ${company.websiteUrl}
  Logo: ${company.logoUrl}
					`);
				});

				const jobsRes = await fetch(`http://localhost:3000/jobs`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						companies: data.companies,
						roleKeywords: roleKeywordsArray,
					}),
				});
				const jobsData = await jobsRes.json();
				console.log('🏆 Recommended Jobs:', jobsData.jobs);

				// Display recommended jobs to the user
				if (jobsData.jobs && jobsData.jobs.length > 0) {
					alert('Here are some recommended jobs for you:\n' + jobsData.jobs.map((job: any) => `- ${job.title} at ${job.company}`).join('\n'));
				} else {
					alert('No recommended jobs found.');
				}

				setSuccess(true);
				setTimeout(() => setSuccess(false), 5000);
			} else {
				console.error('❌ Failed to generate wishlist:', data);
				setError(true);
				setTimeout(() => setError(false), 5000);
			}
		} catch (err) {
			console.error('❌ Error generating wishlist:', err);
			setError(true);
			setTimeout(() => setError(false), 5000);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section id="wishlist-generator" className="wishlist-generator">
			<div className="wishlist-container">
				<h2>Generate Your Dream Company Wishlist</h2>
				<p className="wishlist-description">
					Filter companies by your preferences and let AI generate your
					personalized wishlist
				</p>

				<form onSubmit={handleSubmit} className="wishlist-form">
					<div className="filter-grid">
						{/* Industry Filter */}
						<div className="filter-group">
							<label htmlFor="industry">Industry</label>
							<select
								id="industry"
								name="industry"
								value={filters.industry}
								onChange={(e) =>
									setFilters({ ...filters, industry: e.target.value })
								}
							>
								<option value="">All Industries</option>
								<option value="Artificial Intelligence">
									Artificial Intelligence
								</option>
								<option value="Fintech">Fintech</option>
								<option value="SaaS">SaaS</option>
								<option value="E-commerce">E-commerce</option>
								<option value="Gaming">Gaming</option>
								<option value="Cybersecurity">Cybersecurity</option>
								<option value="Cloud Computing">Cloud Computing</option>
								<option value="Biotechnology">Biotechnology</option>
								<option value="EdTech">EdTech</option>
								<option value="HealthTech">HealthTech</option>
							</select>
						</div>

						{/* Company Size Filter */}
						<div className="filter-group">
							<label htmlFor="size">Company Size</label>
							<select
								id="size"
								name="size"
								value={filters.size}
								onChange={(e) => setFilters({ ...filters, size: e.target.value })}
							>
								<option value="">All Sizes</option>
								<option value="1-50">1-50 employees</option>
								<option value="51-200">51-200 employees</option>
								<option value="201-500">201-500 employees</option>
								<option value="500+">500+ employees</option>
							</select>
						</div>

						{/* City Filter */}
						<div className="filter-group">
							<label htmlFor="city">City</label>
							<select
								id="city"
								name="city"
								value={filters.city}
								onChange={(e) => setFilters({ ...filters, city: e.target.value })}
							>
								<option value="">All Cities</option>
								<option value="London">London</option>
								<option value="Manchester">Manchester</option>
								<option value="Birmingham">Birmingham</option>
								<option value="Edinburgh">Edinburgh</option>
								<option value="Glasgow">Glasgow</option>
								<option value="Bristol">Bristol</option>
								<option value="Leeds">Leeds</option>
								<option value="Liverpool">Liverpool</option>
								<option value="Cambridge">Cambridge</option>
								<option value="Oxford">Oxford</option>
							</select>
						</div>

						{/* Country Filter (Fixed to UK for now) */}
						<div className="filter-group">
							<label htmlFor="country">Country</label>
							<select
								id="country"
								name="country"
								value={filters.country}
								onChange={(e) =>
									setFilters({ ...filters, country: e.target.value })
								}
							>
								<option value="United Kingdom">United Kingdom</option>
							</select>
						</div>
					</div>

					<button type="submit" className="generate-btn" disabled={loading}>
						<span className={loading ? 'btn-hidden' : ''}>Generate Wishlist</span>
						{loading && <span className="btn-loader">Generating...</span>}
					</button>
				</form>

				{/* Loading indicator */}
				{loading && (
					<div className="loading-indicator">
						<div className="spinner"></div>
						<p>AI is generating your personalized wishlist...</p>
					</div>
				)}

				{/* Success message */}
				{success && (
					<div className="success-box">
						<p>✅ Successfully generated wishlist! Check your console for details.</p>
					</div>
				)}

				{/* Error message */}
				{error && (
					<div className="error-box">
						<p>❌ Failed to generate wishlist. Please try again.</p>
					</div>
				)}
			</div>
		</section>
	);
};

export default WishlistGenerator;