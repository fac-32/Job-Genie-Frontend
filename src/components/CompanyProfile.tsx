import React from 'react';
import CompanyHeader from './CompanyHeader.js';
import CompanyOverviewCard from './CompanyOverviewCard.js';
import CompanyInfoCard from './CompanyInfoCard.js';
import JobCategoryCard from './JobCategoryCard.js';
import './CompanyProfile.css';

interface Company {
  name: string;
  description: string;
  industry: string;
  size: string;
  website: string;
  location: string;
  logo?: string | undefined;
}

interface JobCategory {
  categoryName: string;
  jobCount: number;
}

interface CompanyProfileProps {
  company: Company;
  jobCategories: JobCategory[];
  onCategoryClick?: (categoryName: string) => void;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ 
  company, 
  jobCategories,
  onCategoryClick 
}) => {
  return (
    <div className="company-profile">
      <CompanyHeader companyName={company.name} />
      
      <div className="profile-content">
        {/* Overview Section */}
        <section className="overview-section">
          {/* Left: Large Overview Card */}
          <div className="overview-main">
            <CompanyOverviewCard
              companyName={company.name}
              logo={company.logo}
              description={company.description}
            />
          </div>
          
          {/* Right: Two Info Cards */}
          <div className="overview-sidebar">
            <CompanyInfoCard
              title="Company Details"
              items={[
                { label: 'Industry', value: company.industry, icon: '🏢' },
                { label: 'Company Size', value: company.size, icon: '👥' },
                { label: 'Location', value: company.location, icon: '📍' },
              ]}
            />
            <CompanyInfoCard
              title="Contact"
              items={[
                { label: 'Website', value: company.website, icon: '🌐' },
              ]}
            />
          </div>
        </section>

        {/* Job Categories Section */}
        <section className="categories-section">
          <h2 className="section-title">Available Positions</h2>
          <div className="categories-grid">
            {jobCategories.map((category, index) => (
              <JobCategoryCard
                key={index}
                categoryName={category.categoryName}
                jobCount={category.jobCount}
                onClick={() => onCategoryClick?.(category.categoryName)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CompanyProfile;
