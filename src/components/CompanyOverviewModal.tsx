import { useState } from 'react';
import Modal from './Modal';
import type { Company, Job } from '../types/company.types';
import './CompanyOverviewModal.css';

interface CompanyOverviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	company: Company;
	jobs: Job[];
	onViewJobs: () => void;
}

function CompanyOverviewModal({
	isOpen,
	onClose,
	company,
	jobs,
	onViewJobs,
}: CompanyOverviewModalProps) {
	const [logoError, setLogoError] = useState(false);

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={`${company.name} Careers`}>
			<div className="company-overview-modal">
				{/* Company Logo */}
				<div className="company-logo-container">
					{company.logo && !logoError ? (
						<img
							src={company.logo}
							alt={`${company.name} logo`}
							className="company-logo"
							onError={() => setLogoError(true)}
						/>
					) : (
						<div className="company-logo-placeholder">
							{company.name.charAt(0).toUpperCase()}
						</div>
					)}
				</div>

				<div className="company-info">
					<p className="company-description">{company.description}</p>

					<div className="company-details-grid">
						<div className="detail-item">
							<span className="detail-icon">🏢</span>
							<div className="detail-content">
								<h4>Industry</h4>
								<p>{company.industry}</p>
							</div>
						</div>

						<div className="detail-item">
							<span className="detail-icon">👥</span>
							<div className="detail-content">
								<h4>Company Size</h4>
								<p>{company.size}</p>
							</div>
						</div>
					</div>

					<div className="contact-info">
						<h4>🌐 Website</h4>
						<a href={company.website} target="_blank" rel="noopener noreferrer">
							{company.website}
						</a>
					</div>
				</div>

				<div className="jobs-section">
					<h3>
						Available Positions
						<span className="jobs-count">
							({jobs.length} {jobs.length === 1 ? 'job' : 'jobs'})
						</span>
					</h3>

					<button className="view-jobs-button" onClick={onViewJobs}>
						View All Positions →
					</button>
				</div>
			</div>
		</Modal>
	);
}

export default CompanyOverviewModal;
