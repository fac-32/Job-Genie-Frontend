import type { Company, Job } from '../types/company.types';
import './CompanyCard.css';

interface CompanyCardProps {
	company: Company;
	jobs: Job[];
	loading?: boolean;
	error?: string;
}

export function CompanyCard({
	company,
	jobs,
	loading,
	error,
}: CompanyCardProps) {
	// Show loading state
	if (loading) {
		return (
			<div className="company-card loading">
				<p>Loading company information...</p>
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className="company-card error">
				<h3>Error</h3>
				<p>{error}</p>
			</div>
		);
	}

	// Show company card
	return (
		<div className="company-card">
			{/* Company Header */}
			<div className="company-header">
				{company.logo && (
					<img
						src={company.logo}
						alt={`${company.name} logo`}
						className="company-logo"
					/>
				)}
				<h2 className="company-name">{company.name}</h2>
			</div>

			{/* Company Description */}
			<p className="company-description">{company.description}</p>

			{/* Company Info */}
			<div className="company-info">
				<div className="info-item">
					<span className="info-label">👥 Size:</span>
					<span className="info-value">{company.size}</span>
				</div>
				<div className="info-item">
					<span className="info-label">🏭 Industry:</span>
					<span className="info-value">{company.industry}</span>
				</div>
				<div className="info-item">
					<span className="info-label">🌐 Website:</span>
					<a
						href={company.website}
						target="_blank"
						rel="noopener noreferrer"
						className="info-link"
					>
						{company.website}
					</a>
				</div>
			</div>

			{/* Jobs List */}
			<div className="jobs-section">
				<h3 className="jobs-title">📋 Open Roles ({jobs.length})</h3>
				{jobs.length === 0 ? (
					<p className="no-jobs">No open positions at the moment.</p>
				) : (
					<ul className="jobs-list">
						{jobs.map((job) => (
							<li key={job.id} className="job-item">
								<div className="job-header">
									<h4 className="job-title">{job.title}</h4>
									{job.matchScore !== undefined && (
										<span className="match-score">{job.matchScore}% Match</span>
									)}
								</div>
								<p className="job-location">📍 {job.location}</p>
								<p className="job-description">{job.description}</p>

								{/* Requirements */}
								<div className="job-requirements">
									<strong>Requirements:</strong>
									<div className="skills-tags">
										{job.requirements.map((skill, index) => (
											<span key={index} className="skill-tag">
												{skill}
											</span>
										))}
									</div>
								</div>

								{/* Salary */}
								{job.salary && (
									<p className="job-salary">
										💰 £{job.salary.min.toLocaleString()} - £
										{job.salary.max.toLocaleString()}
									</p>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
