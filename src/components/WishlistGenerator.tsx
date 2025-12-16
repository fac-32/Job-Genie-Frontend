import { useState, FormEvent } from 'react';
import WishlistCard from './WishlistCard';
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
	city: string[] | string;
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

interface TheirStackJob {
  id: number | string;
  job_title: string;
  company_name: string;
  location?: string;
  url: string;
  date_posted?: string;
  job_seniority?: string;
}

interface JobsByWishlistResponse {
  success: boolean;
  results: {
    company: string;
    jobs: TheirStackJob[];
  }[];
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

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
	const [wishlistCompanies, setWishlistCompanies] = useState<Company[]>([]);
	const [jobsByCompany, setJobsByCompany] = useState<{ company: string; jobs: TheirStackJob[] }[]>([]);
	const [roleKeywords, setRoleKeywords] = useState('software engineer, developer');
	const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
	const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);

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
			const url = `${API_BASE_URL}/api/wishlist/generate?${queryParams}`;

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

				// Update state with companies
				setWishlistCompanies(data.companies);
				const roleKeywordsArray = roleKeywords.split(',').map((kw) => kw.trim()).filter(Boolean);
				const jobsRes = await fetch(`${API_BASE_URL}/jobs`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						postedAt: 7,
						companies: data.companies,
						jobTitles: roleKeywordsArray,
						remote: null,
					}),
				});
				const jobsData: JobsByWishlistResponse = await jobsRes.json();

				if (jobsRes.ok && jobsData.success) {
    				setJobsByCompany(jobsData.results);
					setSuccess(true);
					setTimeout(() => setSuccess(false), 5000);
				} else {
					console.error('❌ Failed to fetch jobs:', jobsData);
					setError(true);
					setTimeout(() => setError(false), 5000);
				}
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

	const handleDeleteCompany = (companyId: string) => {
		console.log('🗑️ Removing company from wishlist:', companyId);
		setWishlistCompanies((prev) =>
			prev.filter((company) => company.id !== companyId)
		);
	};

	const getJobCountForCompany = (companyName: string) => {
  		const group = jobsByCompany.find(
    		(g) => g.company.toLowerCase().includes(companyName.toLowerCase()) ||
    		companyName.toLowerCase().includes(g.company.toLowerCase())
  		);
  		return group ? group.jobs.length : 0;
	};

	const handleCompanyClick = (company: Company) => {
		setSelectedCompany(company);
		setIsJobsModalOpen(true);
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

						{/* Role Keywords Input */}
						<div className="filter-group">
							<label htmlFor="roleKeywords">Role keywords</label>
							<input
								id="roleKeywords"
								type="text"
								placeholder="e.g. software engineer, backend developer"
								value={roleKeywords}
								onChange={(e) => setRoleKeywords(e.target.value)}
							/>
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
						<p>
							✅ Successfully generated wishlist with {wishlistCompanies.length}{' '}
							{wishlistCompanies.length === 1 ? 'company' : 'companies'}!
						</p>
					</div>
				)}

				{/* Error message */}
				{error && (
					<div className="error-box">
						<p>❌ Failed to generate wishlist. Please try again.</p>
					</div>
				)}

				{/* Wishlist Cards Display */}
				{wishlistCompanies.length > 0 && (
					<div className="wishlist-results">
						<div className="results-header">
							<h3>Your Personalized Wishlist</h3>
							<p className="results-count">
								{wishlistCompanies.length}{' '}
								{wishlistCompanies.length === 1 ? 'company' : 'companies'} found
							</p>
						</div>
						<div className="wishlist-cards-container">
							{wishlistCompanies.map((company) => (
								<WishlistCard
									key={company.id}
									company={company}
									jobCount={getJobCountForCompany(company.name)}
									onClick={() => handleCompanyClick(company)}
									onDelete={handleDeleteCompany}
								/>
							))}
						</div>
					</div>
				)}
				{/* Jobs Modal */}
				{isJobsModalOpen && selectedCompany && (
					<>
						<div
							className="jobs-modal-overlay"
							onClick={() => setIsJobsModalOpen(false)}
						>
							<div
								className="jobs-modal"
								onClick={(e) => e.stopPropagation()} // prevent overlay click
							>
								<button
									className="jobs-modal-close"
									onClick={() => setIsJobsModalOpen(false)}
								>
									✕
								</button>

								<h3>Open roles at {selectedCompany.name}</h3>

								{(() => {
									const group = jobsByCompany.find(
										(g) =>
											g.company.toLowerCase().includes(selectedCompany.name.toLowerCase()) ||
											selectedCompany.name.toLowerCase().includes(g.company.toLowerCase())
									);
									const jobs = group ? group.jobs : [];
									
									if (jobs.length === 0) {
										return <p>No matching roles found for your keywords.</p>;
									}
									
									return (
										<ul className="jobs-modal-list">
											{jobs.map((job) => (
												<li key={job.id} className="jobs-modal-item">
													<a href={job.url} target="_blank" rel="noreferrer">
													{job.job_title}
													</a>{' '}
													– {job.location ?? 'Location not specified'} –{' '}
													{job.job_seniority ?? 'Seniority N/A'}
												</li>
											))}
										</ul>
									);
								})()}
							</div>
						</div>
					</>
				)}
			</div>
		</section>
	);
};

export default WishlistGenerator;