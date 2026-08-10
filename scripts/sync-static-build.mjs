import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const templatePath = resolve(projectRoot, 'dist/index.html');
const serverEntryPath = resolve(projectRoot, '.ssr/entry-server.mjs');
const { render } = await import(pathToFileURL(serverEntryPath));
const template = await readFile(templatePath, 'utf8');
const rootToken = '<div id="root"></div>';
const moduleScriptPattern = /\s*<script type="module"[^>]+src="\/Portfolio\/assets\/app\.js"><\/script>/;
const moduleScript = template.match(moduleScriptPattern)?.[0].trim();

if (!template.includes(rootToken)) {
  throw new Error('The production template is missing the expected React root.');
}

if (!moduleScript) {
  throw new Error('The production template is missing the expected client entry.');
}

const renderedHtml = template
  .replace(moduleScriptPattern, '')
  .replace(rootToken, `<div id="root">${render()}</div>`)
  .replace('</body>', `  ${moduleScript}\n</body>`);
await writeFile(templatePath, renderedHtml, 'utf8');

const files = [
  ['dist/index.html', 'index.html'],
  ['dist/assets/app.js', 'assets/app.js'],
  ['dist/assets/app.css', 'assets/app.css'],
];

for (const [source, destination] of files) {
  const sourcePath = resolve(projectRoot, source);
  const destinationPath = resolve(projectRoot, destination);
  await stat(sourcePath);
  await mkdir(dirname(destinationPath), { recursive: true });
  await copyFile(sourcePath, destinationPath);
}

console.log('Synced the verified static build to the GitHub Pages root.');
