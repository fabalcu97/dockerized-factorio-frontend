const BASE_URL = 'http://0.0.0.0:3000/api';
const BASE_WS_URL = 'ws://0.0.0.0:3000/api';

export const makeRequest = async (url: string, options: RequestInit) => {
	try {
		const response = await fetch(`${BASE_URL}${url}`, options);
		if (!response.ok) {
			console.error({ response });
			return {};
		}
		return response.json();
	} catch (error) {
		console.error({ error });
		return {};
	}
};

export const downloadFile = async (url: string, options: RequestInit) => {
	try {
		const response = await fetch(`${BASE_URL}${url}`, options);
		if (!response.ok) {
			console.error({ response });
			return new Blob();
		}
		return response.blob();
	} catch (error) {
		console.error({ error });
		return new Blob();
	}
};

export const getWsConnection = (url: string) => {
	return new WebSocket(`${BASE_WS_URL}${url}`);
};