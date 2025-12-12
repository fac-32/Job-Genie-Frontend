interface WishlistFilters {
	industry?: string;
	size?: string;
	city?: string;
	country?: string;
}

interface Company {
	id: string;
	name: string;
	industry: string;
	size: string;
	city: string[];
	country: string;
	description: string;
	logoUrl: string;
	websiteUrl: string;
}

interface WishlistResponse {
	success: boolean;
	total: number;
	companies: Company[];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	const wishlistForm = document.getElementById(
		'wishlistForm'
	) as HTMLFormElement;

	if (wishlistForm) {
		wishlistForm.addEventListener('submit', handleWishlistGeneration);
	}
});

async function handleWishlistGeneration(event: Event): Promise<void> {
	event.preventDefault();

	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);

	// Get filter values
	const filters: WishlistFilters = {
		industry: formData.get('industry') as string,
		size: formData.get('size') as string,
		city: formData.get('city') as string,
		country: formData.get('country') as string,
	};

	// Remove empty filters
	Object.keys(filters).forEach((key) => {
		if (!filters[key as keyof WishlistFilters]) {
			delete filters[key as keyof WishlistFilters];
		}
	});

	console.log('🎯 Generating wishlist with filters:', filters);

	// Show loading state
	showLoading();
	hideMessages();

	try {
		// Build query string
		const queryParams = new URLSearchParams(
			filters as Record<string, string>
		).toString();
		const url = `http://localhost:3000/api/wishlist/generate?${queryParams}`;

		console.log('📡 Making request to:', url);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data: WishlistResponse = await response.json();

		hideLoading();

		if (response.ok && data.success) {
			console.log('✅ Wishlist generated successfully!');
			console.log(`📊 Total companies: ${data.total}`);
			console.log('🏢 Companies:', data.companies);

			// Log each company nicely
			data.companies.forEach((company, index) => {
				console.log(`
Company ${index + 1}:
  Name: ${company.name}
  Industry: ${company.industry}
  Size: ${company.size}
  Location: ${company.city.join(', ')}, ${company.country}
  Description: ${company.description}
  Website: ${company.websiteUrl}
  Logo: ${company.logoUrl}
        `);
			});

			showSuccess();
		} else {
			console.error('❌ Failed to generate wishlist:', data);
			showError();
		}
	} catch (error) {
		console.error('❌ Error generating wishlist:', error);
		hideLoading();
		showError();
	}
}

function showLoading(): void {
	const loadingIndicator = document.getElementById('loadingIndicator');
	const generateBtn = document.getElementById(
		'generateBtn'
	) as HTMLButtonElement;
	const btnText = generateBtn?.querySelector('.btn-text') as HTMLElement;
	const btnLoader = generateBtn?.querySelector('.btn-loader') as HTMLElement;

	if (loadingIndicator) {
		loadingIndicator.style.display = 'block';
	}

	if (generateBtn) {
		generateBtn.disabled = true;
	}

	if (btnText) {
		btnText.style.display = 'none';
	}

	if (btnLoader) {
		btnLoader.style.display = 'inline-block';
	}
}

function hideLoading(): void {
	const loadingIndicator = document.getElementById('loadingIndicator');
	const generateBtn = document.getElementById(
		'generateBtn'
	) as HTMLButtonElement;
	const btnText = generateBtn?.querySelector('.btn-text') as HTMLElement;
	const btnLoader = generateBtn?.querySelector('.btn-loader') as HTMLElement;

	if (loadingIndicator) {
		loadingIndicator.style.display = 'none';
	}

	if (generateBtn) {
		generateBtn.disabled = false;
	}

	if (btnText) {
		btnText.style.display = 'inline-block';
	}

	if (btnLoader) {
		btnLoader.style.display = 'none';
	}
}

function showSuccess(): void {
	const successMessage = document.getElementById('successMessage');
	if (successMessage) {
		successMessage.style.display = 'block';
		// Auto-hide after 5 seconds
		setTimeout(() => {
			successMessage.style.display = 'none';
		}, 5000);
	}
}

function showError(): void {
	const errorMessage = document.getElementById('errorMessage');
	if (errorMessage) {
		errorMessage.style.display = 'block';
		// Auto-hide after 5 seconds
		setTimeout(() => {
			errorMessage.style.display = 'none';
		}, 5000);
	}
}

function hideMessages(): void {
	const successMessage = document.getElementById('successMessage');
	const errorMessage = document.getElementById('errorMessage');

	if (successMessage) {
		successMessage.style.display = 'none';
	}

	if (errorMessage) {
		errorMessage.style.display = 'none';
	}
}
