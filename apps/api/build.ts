import { $ } from 'bun';

await $`rm -rf ./dist`;

await Bun.build({
	entrypoints: ['./src/index.ts'],
	outdir: './dist',
	target: 'bun',
	format: 'esm',
	splitting: true,
	minify: true
});

await $`cp -r public dist/public`;

await $`tsc -p ./tsconfig.build.json`;

await $`rm tsconfig.build.tsbuildinfo`;

console.log('Build complete .... ');
