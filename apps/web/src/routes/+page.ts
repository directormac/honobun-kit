import type { PageLoad } from './$types';
import { api } from '$lib/client';

export const load: PageLoad = async () => {
	const ok = await api.healthcheck.$get().then((ok) => ok.text());
	console.log(ok);
	return {};
};
