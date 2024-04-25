<script lang="ts">
	import { type Content, type JSONContent, JSONEditor } from 'svelte-jsoneditor';
	import { createEventDispatcher } from 'svelte';
	import type { Configs } from '../routes/$types';

	const dispatch = createEventDispatcher();
	export let settings: Configs['settings'];

	const onChange = (updatedContent: Content) => {
		dispatch('update', (updatedContent as JSONContent).json);
	};
</script>

<div class="flex flex-col gap-2 max-h-max overflow-auto">
	<JSONEditor content={{json: settings}} onChange={onChange} />
</div>