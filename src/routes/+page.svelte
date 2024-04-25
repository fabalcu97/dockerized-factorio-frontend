<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { getWsConnection, makeRequest } from '$lib';

	const MAX_LOG_COUNT = 200;

	let interval: NodeJS.Timeout;
	let logsEnabled: boolean = true;
	let status: string = 'unknown';
	let socket: WebSocket;
	let statusSocket: WebSocket;
	let logs: string[] = [];

	const fetchStatus = () => {
		statusSocket = getWsConnection('/app-management/inspect');
		statusSocket.onmessage = (data) => {
			const { Status: newStatus } = JSON.parse(data.data);
			status = newStatus;
		};
	};

	const startServer = async () => {
		await makeRequest(
			'/app-management/start', { method: 'POST' });
	};

	const stopServer = async () => {
		try {
			await makeRequest(
				'/app-management/stop', { method: 'POST' });
			socket.close();
		} catch (err) {
			console.error(err);
		}
	};

	const startLogs = () => {
		if (!logsEnabled) {
			socket.close();
			return;
		}
		socket = getWsConnection('/app-management/logs');
		socket.onmessage = (data) => {
			if (!logsEnabled) {
				return;
			}
			logs = [...logs, data.data];
			if (logs.length > MAX_LOG_COUNT) {
				return logs = logs.slice(-MAX_LOG_COUNT);
			}
		};
	};

	onMount(() => {
		fetchStatus();
		startLogs();
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	const scrollToBottom = (node?: HTMLElement) => {
		const scroll = () => node?.scroll({
			top: node?.scrollHeight + 40,
			behavior: 'auto'
		});
		scroll();

		return { update: scroll };
	};
</script>

<div class="flex flex-col h-screen overflow-hidden">

	<header class="w-full card-header p-3 flex">
		<h2 class="text-xl font-semibold flex-10 text-center">Factorio Server </h2>
		<div class="flex justify-end gap-2 flex-auto items-center capitalize">
			<span>{status}</span>
			<div class={`badge-icon variant-filled-${status !== 'running' ? 'error':'primary'}`} />
		</div>
	</header>
	<div class="flex p-4" style="justify-content: space-between">
		<button type="button" class="btn variant-filled-primary" on:click={startServer}>
			Start Factorio Server
		</button>
		<button type="button" class="btn variant-filled-secondary" on:click={stopServer}>
			Stop Factorio Server
		</button>
		<div class="flex items-center gap-2">
			<span>Logs {logsEnabled ? 'enabled' : 'disabled'}</span>
			<SlideToggle name="autoscroll" bind:checked={logsEnabled} on:change={startLogs} />
		</div>
	</div>
	<section use:scrollToBottom={logs} class="p-4 pb-6 max-h-max overflow-auto bg-surface-100">
		<div class="logs flex flex-col">
			{#each logs as log}
				<span>{log}</span>
			{/each}
		</div>
	</section>
</div>