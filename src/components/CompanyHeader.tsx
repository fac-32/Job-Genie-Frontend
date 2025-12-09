import React from 'react';
import './CompanyHeader.css';

interface CompanyHeaderProps {
  companyName: string;
  aiLabel?: string;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ 
  companyName, 
  aiLabel = "AI24 Company" 
}) => {
  return (
    <div className="company-header">
      <h1 className="company-title">{companyName} careers</h1>
      <span className="ai-label">{aiLabel}</span>
    </div>
  );
};

export default CompanyHeader;
