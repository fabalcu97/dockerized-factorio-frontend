<script lang="ts">
	import { Plus, Minus } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let placeholder: string = 'Type something...';
	export let list: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '1', '2', '31', '23', '12', '3'];
	let newValue: string = '';

	const dispatch = createEventDispatcher();

	const keyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			addToList();
		}
	};

	const addToList = () => {
		if (newValue.trim() === '') return;
		list = [...list, newValue];
		newValue = '';
		dispatch('listChange', list);
	};

	const removeFromList = (index: number) => {
		list = list.filter((_, i) => i !== index);
		dispatch('listChange', list);
	};
</script>

<div class="card flex flex-col px-4 py-2 divide-surface-200 divide-y-2 max-h-64">
	<div class="flex gap-4 px-4 py-1">
		<input autocomplete="off"
					 class="input bg-transparent border-none rounded-none placeholder-surface-400 outline-none" type="text"
					 placeholder={placeholder} on:keydown={keyDown} bind:value={newValue} />
		<button class="btn btn-sm rounded-sm variant-filled-primary" on:click={addToList}>
			<Plus />
		</button>
	</div>
	<div class="divide-surface-200 divide-y-2 overflow-auto">
		{#each list as item, idx}
			<div class="flex items-center gap-4 mx-2 py-1">
			<span class="flex-1 bg-transparent border-none text-surface-900">
				{item}
			</span>
				<button class="btn btn-sm rounded-sm variant-filled-error" on:click={() => removeFromList(idx)}>
					<Minus />
				</button>
			</div>
		{/each}
	</div>
</div>