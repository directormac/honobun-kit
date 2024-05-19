import { loaderClient } from '$lib/client';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const client = loaderClient({ fetch });

	const res = await client.api.healthcheck.$get();
	if (!res.ok) {
		error(res.status, res.statusText);
	}
};
