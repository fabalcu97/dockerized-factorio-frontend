<script>
	import { FileDropzone, SlideToggle, getModalStore } from '@skeletonlabs/skeleton';
	import { Trash2 } from 'lucide-svelte';
	import _ from 'lodash';
	import { makeRequest } from '$lib';

	const modalStore = getModalStore();

	/** @type {import('../$types').ModsList} */
	export let data;
	/** @type {FileList} */
	let files;

	/** @type {File[]} */
	let modsToUpload = [];

	/**
	 * @param {string} modToRemove
	 */
	const deleteModFromUploadList = (modToRemove) => {
		modsToUpload = modsToUpload.filter(({ name }) => {
			return name !== modToRemove;
		});
	};

	const uploadMods = async () => {
		const formData = new FormData();
		for (let i = 0; i < modsToUpload.length; i++) {
			formData.append('mods', modsToUpload[i]);
		}
		await makeRequest('/mods/upload', {
			method: 'POST',
			body: formData
		});
		data = await makeRequest('/mods', { method: 'GET' });
		modsToUpload = [];
	};

	/**
	 * @param {string} modName
	 */
	const deleteModFromServer = async (modName) => {
		new Promise((resolve) => {
			/** @type {import('@skeletonlabs/skeleton').ModalSettings}*/
			const modal = {
				type: 'confirm',
				title: 'Are you sure you want to delete this mod?',
				response: resolve
			};
			modalStore.trigger(modal);
		})
			.then(async (confirm) => {
				if (!confirm) {
					return;
				}
				await makeRequest(`/mods/${modName}`, { method: 'DELETE' });
				data = await makeRequest('/mods', { method: 'GET' });
			});
	};

	/**
	 * @param {string} modName
	 */
	const toggleMod = async (modName) => {
		await makeRequest(`/mods/${modName}/toggle`, { method: 'POST' });
		data = await makeRequest('/mods', { method: 'GET' });
	};

	$: {
		if (files)
			if (files.length < 10) {
				for (let i = 0; i < files.length; i++) {
					modsToUpload = _.uniqBy([...modsToUpload, files[i]], 'name');
				}
				files = null;
			} else {
				modalStore.trigger({
					type: 'alert',
					title: 'Too many files',
					body: 'You can only upload up to 10 files at a time.'
				});
			}
	}
</script>

<div class="flex flex-col h-screen overflow-hidden">
	<header class="w-full card-header p-3">
		<h2 class="text-xl font-semibold text-center">Mods ({data.mods.length})</h2>
	</header>
	<section class="flex-1 overflow-y-scroll  hide-scrollbar bg-surface-100">
		<ul class="py-2 divide-y-4 flex flex-col">
			{#each data.mods as item (item.name)}
				<li
					class={`px-5 list-none flex flex-row justify-between overflow-auto py-2`}>
					<div class="flex items-center ">
						<SlideToggle name="slide" bind:checked={item.enabled} on:change={() => toggleMod(item.name)} />
						<span class="ml-5">{item.name} (v{item.version})</span>
					</div>
					<button class="btn-icon-sm text-error-500"
									on:click={() => deleteModFromServer(item.name)}>
						<Trash2 />
					</button>
				</li>
			{/each}
		</ul>
	</section>
	<footer class="w-full card-footer text-center p-3">
		<div class={`flex flex-col divide-y-2 max-h-28 overflow-auto ${modsToUpload.length ? 'mb-2' : ''}`}>
			{#each modsToUpload as mod (mod.name)}
				<div class="flex items-center justify-between w-full">
					<span>{mod.name}</span>
					<button class="btn-icon-sm text-error-500"
									on:click={() => deleteModFromUploadList(mod.name)}>
						<Trash2 />
					</button>
				</div>
			{/each}
		</div>
		<FileDropzone name="mods" padding="p-4" bind:files multiple accept=".zip" />
		<button type="button" class="btn variant-filled-primary w-full mt-2" disabled={modsToUpload.length === 0}
						on:click={uploadMods}>
			Upload Mods
		</button>
	</footer>
</div>