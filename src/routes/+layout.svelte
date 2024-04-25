<script lang="ts">
	import '../app.pcss';
	import { AppShell, initializeStores, Modal } from '@skeletonlabs/skeleton';
	import * as Icons from 'lucide-svelte';
	import { page } from '$app/stores';

	initializeStores();
</script>


<Modal />
<AppShell slotSidebarLeft="w-56 p-4 border-r-2">
	<svelte:fragment slot="sidebarLeft">
		<nav class="list-nav ">
			<ul>
				<li>
					<a href='/'
					   class={`w-full flex justify-between ${$page.url.pathname === '/' && 'bg-primary-50'}`}>
						<span>Home</span>
						<svelte:component this={Icons['Home']} />
					</a>
				</li>
				<li>
					<a href='/config'
					   class={`w-full flex justify-between ${$page.url.pathname === '/config' && 'bg-primary-50'}`}>
						<span>Config</span>
						<svelte:component this={Icons['Settings']} />
					</a>
				</li>
				<li>
					<a href='/saves'
					   class={`w-full flex justify-between ${$page.url.pathname === '/saves' && 'bg-primary-50'}`}>
						<span>Saves</span>
						<svelte:component this={Icons['Save']} />
					</a>
				</li>
				<li>
					<a href='/mods'
					   class={`w-full flex justify-between ${$page.url.pathname === '/mods' && 'bg-primary-50'}`}>
						<span>Mods</span>
						<svelte:component this={Icons['Puzzle']} />
					</a>
				</li>
			</ul>
		</nav>
	</svelte:fragment>
	<slot />
</AppShell>
