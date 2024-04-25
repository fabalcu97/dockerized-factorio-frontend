<script>
	import { FileDropzone, getModalStore } from '@skeletonlabs/skeleton';
	import { Download, Trash2 } from 'lucide-svelte';
	import _ from 'lodash';
	import { downloadFile, makeRequest } from '$lib';

	const modalStore = getModalStore();

	/** @type {import('../$types').Saves} */
	export let data;
	/** @type {FileList} */
	let files;

	/** @type {File[]} */
	let savesToUpload = [];

	/**
	 * @param {string} saveToRemove
	 */
	const deleteSaveFromUploadList = (saveToRemove) => {
		savesToUpload = savesToUpload.filter(({ name }) => {
			return name !== saveToRemove;
		});
	};

	const uploadSaves = async () => {
		const formData = new FormData();
		for (let i = 0; i < savesToUpload.length; i++) {
			formData.append('saves', savesToUpload[i]);
		}
		await makeRequest('/saves/upload', {
			method: 'POST',
			body: formData
		});
		const saves = await makeRequest('/saves', { method: 'GET' });
		data = { saves };
		savesToUpload = [];
	};

	/**
	 * @param {string} saveName
	 */
	const deleteSaveFromServer = async (saveName) => {
		new Promise((resolve) => {
			/** @type {import('@skeletonlabs/skeleton').ModalSettings}*/
			const modal = {
				type: 'confirm',
				title: 'Are you sure you want to delete this save?',
				response: resolve
			};
			modalStore.trigger(modal);
		})
			.then(async (confirm) => {
				if (!confirm) {
					return;
				}
				try {
					await makeRequest(`/saves/${saveName}`, { method: 'DELETE' });
					const saves = await makeRequest('/saves', { method: 'GET' });
					data = { saves };
				} catch (e) {
					console.log(e);
				}
			});
	};

	/**
	 * @param {string} saveName
	 */
	const downloadSaveFromServer = async (saveName) => {
		try {
			const blob = await downloadFile(`/saves/download?saveName=${saveName}`, { method: 'GET' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = saveName;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		} catch (e) {
			console.log(e);
		}
	};

	$: {
		if (files) {
			if (files.length < 10) {
				for (let i = 0; i < files.length; i++) {
					savesToUpload = _.uniqBy([...savesToUpload, files[i]], 'name');
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
	}
</script>

<div class="flex flex-col h-screen overflow-hidden">
	<header class="w-full card-header p-3">
		<h2 class="text-xl font-semibold text-center">Saves ({data.saves.length})</h2>
	</header>
	<section class="flex-1 overflow-y-scroll  hide-scrollbar bg-surface-100">
		<ul class="py-2 divide-y-4 flex flex-col">
			{#each data.saves as save (save)}
				<li
					class={`px-5 list-none flex flex-row justify-between overflow-auto py-2`}>

					<span>{save}</span>
					<div>
						<button class="btn-icon-sm text-neutral-900"
										on:click={() => downloadSaveFromServer(save)}>
							<Download />
						</button>
						<button class="btn-icon-sm text-error-500"
										on:click={() => deleteSaveFromServer(save)}>
							<Trash2 />
						</button>
					</div>
				</li>
			{/each}
		</ul>
	</section>
	<footer class="w-full card-footer text-center p-3">
		<div class={`flex flex-col divide-y-2 max-h-28 overflow-auto ${savesToUpload.length ? 'mb-2' : ''}`}>
			{#each savesToUpload as save (save.name)}
				<div class="flex items-center justify-between w-full">
					<span>{save.name}</span>
					<button class="btn-icon-sm text-error-500"
									on:click={() => deleteSaveFromUploadList(save.name)}>
						<Trash2 />
					</button>
				</div>
			{/each}
		</div>
		<FileDropzone name="saves" padding="p-4" bind:files multiple accept=".zip" />
		<button type="button" class="btn variant-filled-primary w-full mt-2" disabled={savesToUpload.length === 0}
						on:click={uploadSaves}>
			Upload Saves
		</button>
	</footer>
</div>