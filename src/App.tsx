import { useState, useEffect } from 'react';
import CompanyProfile from './components/CompanyProfile.js';
import { getCompanyOverview } from './services/api';
import type { Company, Job } from './types/company.types';
import './App.css';

function App() {
  // State management
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('Google');

  // Fetch company data
  const fetchCompanyData = async (companyName: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getCompanyOverview(companyName);
      
      if (response.success) {
        setCompany(response.data.company);
        setJobs(response.data.jobs);
      } else {
        setError('Failed to load company data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCompanyData(searchTerm);
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanyData(searchTerm);
  };

  // Group jobs by category
  const categorizeJobs = (jobs: Job[]) => {
    const categories: { [key: string]: Job[] } = {};
    
    jobs.forEach(job => {
      const category = job.title.includes('Frontend') || job.title.includes('React') 
        ? 'Frontend Development'
        : job.title.includes('Backend') 
        ? 'Backend Development'
        : job.title.includes('Full Stack')
        ? 'Full Stack Development'
        : 'Software Engineering';
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(job);
    });
    
    return Object.entries(categories).map(([categoryName, categoryJobs]) => ({
      categoryName,
      jobCount: categoryJobs.length
    }));
  };

  const handleCategoryClick = (categoryName: string) => {
    console.log('Category clicked:', categoryName);
    // TODO: Implement job details view
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
            placeholder="Search for a company..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      {/* Company Profile */}
      {company && !loading && (
        <CompanyProfile
          company={{
            name: company.name,
            description: company.description,
            industry: company.industry,
            size: company.size,
            website: company.website,
            location: 'London, UK',
            logo: company.logo
          }}
          jobCategories={categorizeJobs(jobs)}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {/* Initial Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading company data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={() => fetchCompanyData(searchTerm)} className="retry-button">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
