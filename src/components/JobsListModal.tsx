import Modal from './Modal';
import type { Job } from '../types/company.types';
import './JobsListModal.css';

interface JobsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onBack: () => void;
}

function JobsListModal({ 
  isOpen, 
  onClose, 
  companyName, 
  jobs,
  onSelectJob,
  onBack 
}: JobsListModalProps) {
  
  const getMatchBadgeClass = (score?: number) => {
    if (!score) return 'low';
    if (score >= 60) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  };

  const formatSalary = (salary?: { min: number; max: number }) => {
    if (!salary) return 'Not provided';
    return `£${(salary.min / 1000).toFixed(0)}k - £${(salary.max / 1000).toFixed(0)}k`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${companyName} - Available Positions`}>
      <div className="jobs-list-modal">
        {jobs.length === 0 ? (
          <div className="no-jobs">
            <p>No jobs available at the moment</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="job-card"
                onClick={() => onSelectJob(job)}
              >
                <div className="job-card-header">
                  <h3 className="job-card-title">{job.title}</h3>
                  {job.matchScore !== undefined && (
                    <span className={`match-badge ${getMatchBadgeClass(job.matchScore)}`}>
                      {job.matchScore}% Match
                    </span>
                  )}
                </div>

                <div className="job-card-meta">
                  <span className="job-meta-item">
                    📍 {job.location}
                  </span>
                  <span className="job-meta-item">
                    💰 {formatSalary(job.salary)}
                  </span>
                </div>

                <p className="job-card-description">{job.description}</p>

                <div className="job-card-footer">
                  <span className="experience-badge">{job.experienceLevel}</span>
                  <span className="view-details-link">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="back-button" onClick={onBack}>
          ← Back to Company Overview
        </button>
      </div>
    </Modal>
  );
}

export default JobsListModal;
