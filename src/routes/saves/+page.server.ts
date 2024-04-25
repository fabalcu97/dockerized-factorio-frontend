import { makeRequest } from '$lib';

export async function load() {
	const saves = await makeRequest('/saves', {
			method: 'GET'
		}
	);
	return {
		saves
	};
}
