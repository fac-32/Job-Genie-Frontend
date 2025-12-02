console.log('JobGenie is running!');

const app = document.getElementById('app');

async function fetchData() {
	try {
		const response = await fetch('http://localhost:3000/');
		const data = await response.json();
		if (app) {
			app.innerHTML = `<p>Data from backend: ${JSON.stringify(data)}</p>`;
		}
	} catch (error) {
		if (app) {
			app.innerHTML = `<p>Failed to load data from backend: ${error}</p>`;
		}
		console.error('Error fetching data:', error);
	}
}

fetchData();
