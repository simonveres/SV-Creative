import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

const outputDirectory = 'dist';
const staticEntries = [
  'admin',
  'assets',
  'blog',
  'case-studies',
  'clients',
  'data',
  'googlec442c9f4730b0bd6.html',
  'hello.txt',
  'index.html',
  'js',
  'pages',
  'portfolio',
  'robots.txt',
  'sitemap.xml'
];

async function clearFiles(directory) {
  await mkdir(directory, { recursive: true });
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await clearFiles(entryPath);
    } else {
      await rm(entryPath, { force: true, maxRetries: 5, retryDelay: 200 });
    }
  }));
}

await clearFiles(outputDirectory);
await Promise.all(staticEntries.map((entry) => cp(entry, path.join(outputDirectory, entry), { recursive: true })));

try {
  await build({
    entryPoints: [
      'admin/assets/dashboard.js',
      'admin/assets/login.js',
      'assets/js/public-firestore.js'
    ],
    outbase: '.',
    outdir: outputDirectory,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022'
  });
} catch (error) {
  console.error('[Build] Firebase SDK bundling failed.', {
    stage: 'sdk-bundle',
    errorName: typeof error?.name === 'string' ? error.name : 'unknown',
    errorCode: typeof error?.code === 'string' ? error.code : 'unknown'
  });
  throw error;
}

console.info('Static site bundle written to dist/.');
