import { useState } from 'react';
import CompanyOverviewModal from './components/CompanyOverviewModal';
import JobsListModal from './components/JobsListModal';
import JobDetailsModal from './components/JobDetailsModal';
import { getCompanyOverview } from './services/api';
import type { Company, Job } from './types/company.types';
import './App.css';

type ModalView = 'none' | 'company' | 'jobs' | 'jobDetails';

function App() {
  // State management
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<ModalView>('none');

  // Fetch company data
  const fetchCompanyData = async (companyName: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getCompanyOverview(companyName);
      
      if (response.success) {
        setCompany(response.data.company);
        setJobs(response.data.jobs);
        setCurrentView('company'); // Open company overview modal
      } else {
        setError('Failed to load company data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchCompanyData(searchTerm);
    }
  };

  // Modal navigation handlers
  const handleViewJobs = () => {
    setCurrentView('jobs');
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setCurrentView('jobDetails');
  };

  const handleBackToJobs = () => {
    setCurrentView('jobs');
    setSelectedJob(null);
  };

  const handleBackToCompany = () => {
    setCurrentView('company');
  };

  const handleCloseAll = () => {
    setCurrentView('none');
    setSelectedJob(null);
  };

  return (
    <div className="app">
      {/* Search Bar */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a company (e.g., Google, Amazon, Meta)..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={() => fetchCompanyData(searchTerm)} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Company Overview Modal */}
      {company && (
        <CompanyOverviewModal
          isOpen={currentView === 'company'}
          onClose={handleCloseAll}
          company={company}
          jobs={jobs}
          onViewJobs={handleViewJobs}
        />
      )}

      {/* Jobs List Modal */}
      {company && (
        <JobsListModal
          isOpen={currentView === 'jobs'}
          onClose={handleCloseAll}
          companyName={company.name}
          jobs={jobs}
          onSelectJob={handleSelectJob}
          onBack={handleBackToCompany}
        />
      )}

      {/* Job Details Modal */}
      <JobDetailsModal
        isOpen={currentView === 'jobDetails'}
        onClose={handleCloseAll}
        job={selectedJob}
        onBack={handleBackToJobs}
      />

      {/* Welcome Message */}
      {!company && !loading && (
        <div className="welcome-container">
          <h1>Welcome to Job Genie</h1>
          <p>Search for companies to explore career opportunities</p>
        </div>
      )}
    </div>
  );
}

export default App;
