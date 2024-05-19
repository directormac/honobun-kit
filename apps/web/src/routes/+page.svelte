<script lang="ts">
	import { delay } from '@honobun-kit/shared/utils';
	import { Button } from '@honobun-kit/ui/button';
	import { cn } from '@honobun-kit/ui/utils';
	import { onMount } from 'svelte';

	let status = $state('Disconnected');
	let currentTime = $state(new Date().toISOString());
	let status2 = $state('Disconnected');
	let currentTime2 = $state(new Date().toISOString());
	let pingMessage = $state('Not pinged');
	let pingMessage2 = $state('Not pinged');

	let ws: WebSocket;
	let wsPing: WebSocket;

	onMount(() => {
		wsPing = new WebSocket('ws://localhost:3000/ws/ping');

		const eventSource = new EventSource('/api/current-time');

		eventSource.onopen = () => {
			status2 = 'Connected';
		};

		eventSource.onmessage = (event) => {
			currentTime2 = event.data;
		};

		eventSource.onerror = () => {
			status2 = 'Disconnected';
		};

		setTimeout(() => {
			ws = new WebSocket('ws://localhost:3000/ws');
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

	const ping2 = () => {};
</script>

<main class="grid place-items-center">
	<h1 class="text-4xl font-semibold">Welcome to Honobun kit</h1>
	<div class="gap-x4 grid grid-cols-2 py-4">
		<div class="grid place-items-center gap-y-4">
			<p class={cn(status === 'Connected' ? 'text-green-500' : 'text-red-500')}>
				Websocket server - {status}
			</p>
			<p>{currentTime}</p>

			<Button
				size="lg"
				onclick={ping}
				class={cn(pingMessage === 'Not pinged' ? 'bg-white' : 'bg-green-500')}
				>Ping Websocket server</Button
			>
			<p>{pingMessage}</p>
		</div>

		<div class="grid place-items-center gap-y-4">
			<p
				class={cn(status2 === 'Connected' ? 'text-green-500' : 'text-red-500')}
			>
				Server - {status2}
			</p>
			<p>{currentTime2}</p>

			<Button
				size="lg"
				onclick={ping}
				class={cn(pingMessage === 'Not pinged' ? 'bg-white' : 'bg-green-500')}
				>Ping server</Button
			>
			<p>{pingMessage}</p>
		</div>
	</div>
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
