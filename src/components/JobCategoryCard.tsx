import React from 'react';
import './JobCategoryCard.css';

interface JobCategoryCardProps {
	categoryName: string;
	jobCount: number;
	onClick?: () => void;
}

const JobCategoryCard: React.FC<JobCategoryCardProps> = ({
	categoryName,
	jobCount,
	onClick,
}) => {
	return (
		<div className="job-category-card" onClick={onClick}>
			<h4 className="category-name">{categoryName}</h4>
			<p className="job-count">
				{jobCount} {jobCount === 1 ? 'job' : 'jobs'}
			</p>
		</div>
	);
};

export default JobCategoryCard;
