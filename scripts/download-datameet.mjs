import fs from 'node:fs';
import path from 'node:path';

const outDir = path.join(process.cwd(), 'data', 'source', 'datameet');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function download(file) {
  const url = `https://raw.githubusercontent.com/datameet/railways/master/${file}`;
  console.log(`Downloading ${url}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.statusText}`);
  const dest = path.join(outDir, file);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
  console.log(`Saved ${dest} (${(buffer.byteLength / 1024).toFixed(1)} KB)`);
}

async function main() {
  await download('stations.json');
  await download('trains.json');
  console.log('DataMeet download complete!');
}

main().catch(console.error);
