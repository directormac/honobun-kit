<script lang="ts">
	import { delay } from '@honobun-kit/shared/utils';
	import { Button } from '@honobun-kit/ui/button';
	import { cn } from '@honobun-kit/ui/utils';
	import { onMount } from 'svelte';

	let status = $state('Disconnected');
	let currentTime = $state(new Date().toString());
	let pingMessage = $state('Not pinged');

	let ws: WebSocket;
	let wsPing: WebSocket;

	onMount(() => {
		wsPing = new WebSocket('ws://localhost:3000/api/ws/ping');

		setTimeout(() => {
			ws = new WebSocket('ws://localhost:3000/api/ws');
			ws.onopen = () => {
				status = 'Connected';
			};

			ws.onmessage = (event) => {
				currentTime = event.data;
			};
		}, 1000);

		return () => {
			ws.close();
			wsPing.close();
		};
	});

	const healthCheck = async () => {
		await delay(2500);
		return await fetch('/api/healthcheck').then((check) => check.text());
	};

	const ping = () => {
		if (wsPing) {
			wsPing.send('ping');
		}
		wsPing.onmessage = (event) => {
			pingMessage = event.data;
		};
	};
</script>

<main class="grid place-items-center">
	<h1 class="text-4xl font-semibold">Welcome to Honobun kit</h1>
	<p class={cn(status === 'Connected' ? 'text-green-500' : 'text-red-500')}>
		{status}
	</p>
	<p>{currentTime}</p>

	<Button
		size="lg"
		onclick={ping}
		class={cn(pingMessage === 'Not pinged' ? 'bg-white' : 'bg-green-500')}
		>Ping Server</Button
	>
	<p>{pingMessage}</p>

	<div>
		{#await healthCheck()}
			Checking health..
		{:then check}
			{#if check === 'OK'}
				<p>
					Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
				</p>
			{/if}
		{/await}
	</div>
</main>
