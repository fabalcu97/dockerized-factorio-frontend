import { makeRequest } from '$lib';

export async function load() {
	return makeRequest('/mods', { method: 'GET' });
}
