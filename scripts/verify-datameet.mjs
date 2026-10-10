import fs from 'node:fs';

console.log('--- Inspecting datameet stations.json ---');
const stationsData = JSON.parse(fs.readFileSync('c:/PROJECTS/codex_new/data/source/datameet/stations.json', 'utf8'));
console.log('Total stations in datameet:', stationsData.features.length);

const sampleStation = stationsData.features[0];
console.log('Sample station structure:', JSON.stringify(sampleStation, null, 2));

const states = new Set();
const zones = new Set();
const propKeys = new Set();

for (const f of stationsData.features) {
  const p = f.properties || {};
  Object.keys(p).forEach(k => propKeys.add(k));
  if (p.state) states.add(p.state);
  if (p.zone) zones.add(p.zone);
}

console.log('Property keys:', Array.from(propKeys));
console.log('Zones count:', zones.size, Array.from(zones));
console.log('States count:', states.size);

console.log('\n--- Inspecting datameet trains.json for Suburban Divisions ---');
const trainsData = JSON.parse(fs.readFileSync('c:/PROJECTS/codex_new/data/source/datameet/trains.json', 'utf8'));
console.log('Total trains:', trainsData.features.length);

const trainTypes = new Map();
const sampleSuburban = [];

for (const f of trainsData.features) {
  const p = f.properties || {};
  const t = p.type || 'Unknown';
  trainTypes.set(t, (trainTypes.get(t) || 0) + 1);

  const name = (p.name || '').toLowerCase();
  if (
    t.toLowerCase().includes('sub') ||
    t.toLowerCase().includes('emu') ||
    t.toLowerCase().includes('memu') ||
    name.includes('local') ||
    name.includes('suburban') ||
    name.includes('mmts') ||
    name.includes('emu')
  ) {
    if (sampleSuburban.length < 10) {
      sampleSuburban.push({
        number: p.number,
        name: p.name,
        type: p.type,
        zone: p.zone,
        from: p.from_station_name,
        to: p.to_station_name,
        dist: p.distance,
        coordsCount: f.geometry?.coordinates?.length || 0
      });
    }
  }
}

console.log('Train Types distribution:', Object.fromEntries(trainTypes));
console.log('Sample Suburban/Local trains found:', sampleSuburban);
