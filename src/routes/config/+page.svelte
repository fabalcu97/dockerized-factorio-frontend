<script lang="ts">
	import _ from 'lodash';
	import { makeRequest } from '$lib';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Settings as SettingsIcon, Ban, ListChecks, ShieldCheck } from 'lucide-svelte';
	import AddList from '../../components/AddList.svelte';
	import Settings from '../../components/Settings.svelte';
	import type { Configs } from '../$types';
	import { invalidateAll } from '$app/navigation';

	export let data: Configs;

	let adminsList: Configs['admins'] = [];
	let bansList: Configs['bans'] = [];
	let whitelist: Configs['whitelist'] = [];
	let settings: Configs['settings'] = {};

	const updateConfig = async () => {
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		console.log({ admins: adminsList, bans: bansList, whitelist, settings });

		await makeRequest('/server-config/save', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				admins: adminsList,
				bans: bansList,
				whitelist,
				settings
			})
		});
		data = await makeRequest('/server-config', { method: 'GET' });
	};

	const resetConfiguration = async () => {
		await makeRequest('/server-config/reset', {
			method: 'POST'
		});
		await invalidateAll();
	};

	const updateAdmins = (admins: CustomEvent<string[]>) => adminsList = admins.detail;
	const updateBans = (bans: CustomEvent<string[]>) => bansList = bans.detail;
	const updateWhitelist = (updatedWhitelist: CustomEvent<string[]>) => whitelist = updatedWhitelist.detail;
	const updateSettings = (updatedSettings: CustomEvent<Configs['settings']>) => settings = updatedSettings.detail;

	$: {
		adminsList = data.admins;
		bansList = data.bans;
		whitelist = data.whitelist;
		settings = data.settings;
	}
</script>

<div class="flex flex-col h-screen overflow-hidden">
	<header class="w-full card-header p-3">
		<h2 class="text-xl font-semibold text-center">Server Configuration</h2>
	</header>
	<section class="flex-1 overflow-y-scroll  hide-scrollbar bg-surface-100">
		<Accordion autocollapse>
			<AccordionItem open>
				<svelte:fragment slot="lead">
					<ShieldCheck size="24" />
				</svelte:fragment>
				<div slot="summary" class="flex justify-between">
					<span>Admins</span>
					{#if !_.isEqual(adminsList, data.admins)}
						<span class="chip variant-filled-warning">Modified</span>
					{/if}
				</div>
				<AddList slot="content" placeholder="Username" list={adminsList} on:listChange={updateAdmins} />
			</AccordionItem>
			<AccordionItem>
				<svelte:fragment slot="lead">
					<Ban size="24" />
				</svelte:fragment>
				<div slot="summary" class="flex justify-between">
					<span>Ban List</span>
					{#if !_.isEqual(bansList, data.bans)}
						<span class="chip variant-filled-warning">Modified</span>
					{/if}
				</div>
				<AddList slot="content" placeholder="Username" list={bansList} on:listChange={updateBans} />
			</AccordionItem>
			<AccordionItem>
				<svelte:fragment slot="lead">
					<ListChecks size="24" />
				</svelte:fragment>
				<div slot="summary" class="flex justify-between">
					<span>Whitelist</span>
					{#if !_.isEqual(whitelist, data.whitelist)}
						<span class="chip variant-filled-warning">Modified</span>
					{/if}
				</div>
				<AddList slot="content" placeholder="Username" list={whitelist} on:listChange={updateWhitelist} />
			</AccordionItem>
			<AccordionItem open>
				<svelte:fragment slot="lead">
					<SettingsIcon size="24" />
				</svelte:fragment>
				<div slot="summary" class="flex justify-between">
					<span>Settings</span>
					{#if !_.isEqual(settings, data.settings)}
						<span class="chip variant-filled-warning">Modified</span>
					{/if}
				</div>
				<Settings slot="content" settings={settings} on:update={updateSettings} />
			</AccordionItem>
		</Accordion>
	</section>
	<footer class="w-full flex flex-row gap-4 card-footer text-center p-3">
		<button class="btn btn-sm rounded-md flex-auto variant-filled-secondary" on:click={resetConfiguration}>Reset to
			Default
		</button>
		<button type="button" class="btn btn-sm rounded-md flex-auto variant-filled-primary"
		        on:click={updateConfig}>
			Save All Changes
		</button>
	</footer>
</div>