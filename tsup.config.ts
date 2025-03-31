import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/lib/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  dts: false,
  outDir: 'dist',
  format: ['esm', 'cjs'],
  tsconfig: 'tsconfig.prod.json',
});
