import React from 'react';
import './CompanyInfoCard.css';

interface InfoItem {
  label: string;
  value: string;
  icon?: string;
}

interface CompanyInfoCardProps {
  title: string;
  items: InfoItem[];
}

const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({ title, items }) => {
  return (
    <div className="company-info-card">
      <h3 className="info-card-title">{title}</h3>
      <div className="info-items">
        {items.map((item, index) => (
          <div key={index} className="info-item">
            {item.icon && <span className="info-icon">{item.icon}</span>}
            <div className="info-content">
              <span className="info-label">{item.label}</span>
              <span className="info-value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyInfoCard;
