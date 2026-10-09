import { copyFile, mkdir, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

const outputDirectory = 'dist';
const requiredStaticEntries = [
  'admin',
  'assets',
  'clients',
  'googlec442c9f4730b0bd6.html',
  'hello.txt',
  'index.html',
  'js',
  'pages',
  'portfolio',
  'robots.txt',
  'sitemap.xml'
];
const optionalStaticEntries = ['blog', 'case-studies', 'data'];
const bundledEntryPoints = new Set([
  path.join('admin', 'assets', 'dashboard.js'),
  path.join('admin', 'assets', 'login.js'),
  path.join('assets', 'js', 'public-firestore.js')
]);

async function clearFiles(directory, outputRoot = directory) {
  await mkdir(directory, { recursive: true });
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await clearFiles(entryPath, outputRoot);
    } else {
      try {
        await rm(entryPath, { force: true, maxRetries: 5, retryDelay: 200 });
      } catch (error) {
        const sourcePath = path.relative(outputRoot, entryPath);
        if (error.code !== 'EPERM') throw error;
        await stat(sourcePath);
        console.info('[Build] Locked output file will be replaced from source.', { source: sourcePath });
      }
    }
  }));
}

async function copyEntry(source, destination) {
  const sourceStats = await stat(source);
  if (!sourceStats.isDirectory()) {
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
    return;
  }

  await mkdir(destination, { recursive: true });
  const entries = await readdir(source);
  await Promise.all(entries.map((entry) => {
    const sourcePath = path.join(source, entry);
    if (bundledEntryPoints.has(sourcePath)) return Promise.resolve();
    return copyEntry(sourcePath, path.join(destination, entry));
  }));
}

await clearFiles(outputDirectory);
await Promise.all(requiredStaticEntries.map((entry) => copyEntry(entry, path.join(outputDirectory, entry))));
await Promise.all(optionalStaticEntries.map(async (entry) => {
  try {
    await copyEntry(entry, path.join(outputDirectory, entry));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    console.info('[Build] Optional content directory not present; skipped.', { source: entry });
  }
}));

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
