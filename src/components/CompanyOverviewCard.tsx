import React from 'react';
import './CompanyOverviewCard.css';

interface CompanyOverviewCardProps {
  companyName: string;
  logo?: string | undefined;
  description: string;
}

const CompanyOverviewCard: React.FC<CompanyOverviewCardProps> = ({ 
  companyName, 
  logo,
  description 
}) => {
  // Get first letter for default logo
  const firstLetter = companyName.charAt(0).toUpperCase();
  
  return (
    <div className="company-overview-card">
      <div className="company-logo-container">
        {logo ? (
          <img src={logo} alt={`${companyName} logo`} className="company-logo" />
        ) : (
          <div className="company-logo-placeholder">{firstLetter}</div>
        )}
      </div>
      <h2 className="overview-company-name">{companyName}</h2>
      <p className="overview-subtitle">Overview</p>
      <p className="overview-description">{description}</p>
    </div>
  );
};

export default CompanyOverviewCard;
