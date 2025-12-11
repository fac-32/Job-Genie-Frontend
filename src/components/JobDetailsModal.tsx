import Modal from './Modal';
import type { Job } from '../types/company.types';
import './JobDetailsModal.css';

interface JobDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	job: Job | null;
	onBack: () => void;
}

function JobDetailsModal({
	isOpen,
	onClose,
	job,
	onBack,
}: JobDetailsModalProps) {
	if (!job) return null;

	const getMatchClass = (score?: number) => {
		if (!score) return 'low';
		if (score >= 60) return 'high';
		if (score >= 30) return 'medium';
		return 'low';
	};

	const formatSalary = (salary?: { min: number; max: number }) => {
		if (!salary) return null;
		return `£${salary.min.toLocaleString()} - £${salary.max.toLocaleString()}`;
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Job Details">
			<div className="job-details-modal">
				<div className="job-details-header">
					<div className="job-title-section">
						<h2 className="job-title-main">{job.title}</h2>
						{job.matchScore !== undefined && (
							<span
								className={`job-match-score ${getMatchClass(job.matchScore)}`}
							>
								{job.matchScore}% Match
							</span>
						)}
					</div>

					<div className="job-meta-grid">
						<div className="job-meta-card">
							<h4>📍 Location</h4>
							<p>{job.location}</p>
						</div>

						<div className="job-meta-card">
							<h4>🏢 Company</h4>
							<p>{job.company}</p>
						</div>

						<div className="job-meta-card">
							<h4>📊 Experience Level</h4>
							<p style={{ textTransform: 'capitalize' }}>
								{job.experienceLevel}
							</p>
						</div>
					</div>
				</div>

				<div className="job-section">
					<h3>📝 About the Role</h3>
					<p className="job-description">{job.description}</p>
				</div>

				{job.salary ? (
					<div className="salary-info">
						<h3>💰 Salary</h3>
						<p className="salary-range">{formatSalary(job.salary)}</p>
					</div>
				) : (
					<div className="salary-info">
						<h3>💰 Salary</h3>
						<p className="salary-not-provided">Not provided</p>
					</div>
				)}

				<div className="job-section">
					<h3>🎯 Requirements</h3>
					<ul className="requirements-list">
						{job.requirements.map((req, index) => (
							<li key={index} className="requirement-tag">
								{req}
							</li>
						))}
					</ul>
				</div>

				<div className="job-actions">
					<a
						href={job.jobUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="apply-button"
					>
						Apply Now on Company Website →
					</a>
					<button className="back-to-jobs-button" onClick={onBack}>
						← Back
					</button>
				</div>
			</div>
		</Modal>
	);
}

export default JobDetailsModal;
