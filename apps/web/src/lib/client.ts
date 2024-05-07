import { client, getClient } from '@honobun-kit/shared/client';

// This is needed if loading from the +page.ts
const loaderClient = (params: Parameters<typeof getClient>[0]) =>
	getClient({ ...params, path: '' });

// The exported client can be used in .svelte or any ts files
export { client, loaderClient };
