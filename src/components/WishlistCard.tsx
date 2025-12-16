import { useState } from 'react';
import './WishlistCard.css';

interface Company {
	id: string;
	name: string;
	industry: string;
	size: string;
	city: string[] | string;
	country: string;
	description: string;
	logoUrl: string;
	websiteUrl: string;
}

interface WishlistCardProps {
	company: Company;
	onDelete: (companyId: string) => void;
	jobCount?: number;
	onClick?: () => void;
}

const WishlistCard = ({ company, onDelete, jobCount = 0, onClick }: WishlistCardProps) => {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [logoError, setLogoError] = useState(false);

	// Format city display (handle both string and array)
	const cityDisplay = Array.isArray(company.city)
		? company.city.join(', ')
		: company.city;

	// Get first letter for logo fallback
	const firstLetter = company.name.charAt(0).toUpperCase();

	const handleDeleteClick = () => {
		setShowDeleteDialog(true);
	};

	const handleConfirmDelete = () => {
		onDelete(company.id);
		setShowDeleteDialog(false);
	};

	const handleCancelDelete = () => {
		setShowDeleteDialog(false);
	};

	return (
		<>
			<div className="wishlist-card" onClick={() => {
        		console.log('Card clicked', company.name);
          		onClick && onClick();
        		}}
			>
				{/* Logo Section */}
				<div className="wishlist-card-logo">
					{company.logoUrl && !logoError ? (
						<img
							src={company.logoUrl}
							alt={`${company.name} logo`}
							onError={() => setLogoError(true)}
						/>
					) : (
						<div className="wishlist-card-logo-placeholder">{firstLetter}</div>
					)}
				</div>

				{/* Content Section */}
				<div className="wishlist-card-content">
					{/* Header with Name and Delete Button */}
					<div className="wishlist-card-header">
						<h3 className="company-name">{company.name}</h3>
						<button
							className="delete-button"
							onClick={handleDeleteClick}
							aria-label="Delete company from wishlist"
							title="Remove from wishlist"
						>
							🗑️ Remove
						</button>
					</div>

					{/* Company Details Grid */}
					<div className="company-details">
						<div className="detail-item">
							<span className="detail-icon">🏢</span>
							<div className="detail-text">
								<span className="detail-label">Industry</span>
								<span className="detail-value">{company.industry}</span>
							</div>
						</div>

						<div className="detail-item">
							<span className="detail-icon">👥</span>
							<div className="detail-text">
								<span className="detail-label">Company Size</span>
								<span className="detail-value">{company.size}</span>
							</div>
						</div>

						<div className="detail-item">
							<span className="detail-icon">📍</span>
							<div className="detail-text">
								<span className="detail-label">Location</span>
								<span className="detail-value">
									{cityDisplay}, {company.country}
								</span>
							</div>
						</div>
					</div>

					{/* Description */}
					<div className="company-description">
						<p>{company.description}</p>
					</div>

					{/* Website Link */}
					<div className="company-website">
						<a
							href={company.websiteUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="website-link"
						>
							🌐 Visit Website →
						</a>
					</div>	
				</div>
				{/* Job Count */}
				<div className="wishlist-card-footer">
					<button
						className="jobs-count-btn"
						onClick={(e) => {
						e.stopPropagation();   // don't trigger whole-card click
						console.log('Job roles button clicked', company.name);
						onClick && onClick();  // open jobs modal in parent
						}}
					>
						Job roles: {jobCount}
					</button>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			{showDeleteDialog && (
				<div className="delete-dialog-overlay" onClick={handleCancelDelete}>
					<div
						className="delete-dialog"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="dialog-icon">⚠️</div>
						<h3>Remove from Wishlist?</h3>
						<p>
							Are you sure you want to remove <strong>{company.name}</strong>{' '}
							from your wishlist?
						</p>
						<div className="dialog-actions">
							<button
								className="dialog-button cancel-button"
								onClick={handleCancelDelete}
							>
								Cancel
							</button>
							<button
								className="dialog-button confirm-button"
								onClick={handleConfirmDelete}
							>
								Remove
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default WishlistCard;