import { api } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const ok = await api.healthcheck.$get().then((ok) => ok.text());

	console.log(ok);
};
