import { makeRequest } from '$lib';

export async function load() {
	return await makeRequest('/server-config', { method: 'GET' });
}
