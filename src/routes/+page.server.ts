import { makeRequest } from '$lib';

export async function load() {
	return await makeRequest('/mods', { method: 'GET' });
}
