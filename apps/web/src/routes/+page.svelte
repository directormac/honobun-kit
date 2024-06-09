<script lang="ts">
	$effect(() => {
		const ws = new WebSocket('ws://localhost:3000/pubsub');

		ws.onopen = () => {
			console.log('connected');

			ws.send('Pinging!');
		};

		ws.onmessage = (data) => {
			console.log(data);
		};

		return () => {
			ws.close();
		};
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>
	Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
