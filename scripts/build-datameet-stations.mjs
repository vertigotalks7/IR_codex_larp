import fs from 'node:fs';
import path from 'node:path';

const datameetPath = 'c:/PROJECTS/codex_new/data/source/datameet/stations.json';
const datameet = JSON.parse(fs.readFileSync(datameetPath, 'utf8'));

console.log(`Loaded ${datameet.features.length} stations from DataMeet.`);

// Zone expansion map
const ZONE_NAMES = {
  CR: 'Central Railway',
  ECoR: 'East Coast Railway',
  ECR: 'East Central Railway',
  ER: 'Eastern Railway',
  KR: 'Konkan Railway',
  NCR: 'North Central Railway',
  NER: 'North Eastern Railway',
  NFR: 'Northeast Frontier Railway',
  NR: 'Northern Railway',
  NWR: 'North Western Railway',
  SCR: 'South Central Railway',
  SECR: 'South East Central Railway',
  SER: 'South Eastern Railway',
  SR: 'Southern Railway',
  SWR: 'South Western Railway',
  WCR: 'West Central Railway',
  WR: 'Western Railway',
  '?': 'Indian Railways'
};

const processedStations = [];
const majorJunctions = [];
const zoneStats = {};
const stateStats = {};

for (const f of datameet.features) {
  const p = f.properties || {};
  const coords = f.geometry?.coordinates;
  if (!coords || coords.length < 2) continue;

  const lon = Math.round(coords[0] * 100000) / 100000;
  const lat = Math.round(coords[1] * 100000) / 100000;

  // Filter valid India coordinates
  if (lon < 65 || lon > 98 || lat < 6 || lat > 38) continue;

  const rawZone = (p.zone || '?').trim();
  const zoneFull = ZONE_NAMES[rawZone] || 'Indian Railways';
  const name = (p.name || 'Station').trim();
  const code = (p.code || '').trim().toUpperCase();
  const state = (p.state || 'India').trim();
  const address = (p.address || '').trim();

  const isJunction = name.toLowerCase().includes('junction') || name.toLowerCase().includes(' jn') || name.toLowerCase().includes('central') || name.toLowerCase().includes('terminus');

  zoneStats[zoneFull] = (zoneStats[zoneFull] || 0) + 1;
  stateStats[state] = (stateStats[state] || 0) + 1;

  const stationFeat = {
    type: 'Feature',
    properties: {
      id: `stn-${code.toLowerCase()}`,
      code,
      name,
      zone: zoneFull,
      zoneCode: rawZone,
      state,
      address,
      isJunction,
      kind: isJunction ? 'railway-junction' : 'railway-station'
    },
    geometry: {
      type: 'Point',
      coordinates: [lon, lat]
    }
  };

  processedStations.push(stationFeat);
  if (isJunction) {
    majorJunctions.push(stationFeat);
  }
}

console.log(`Valid stations: ${processedStations.length} (${majorJunctions.length} junctions)`);
console.log('Top States:', Object.entries(stateStats).sort((a,b) => b[1] - a[1]).slice(0, 8));
console.log('Top Zones:', Object.entries(zoneStats).sort((a,b) => b[1] - a[1]).slice(0, 8));

const outDir = path.resolve('c:/PROJECTS/codex_new/public/data');
const allStationsPath = path.join(outDir, 'railway-stations-datameet.json');
fs.writeFileSync(allStationsPath, JSON.stringify({
  type: 'FeatureCollection',
  name: 'DataMeet_Indian_Railways_Stations',
  features: processedStations
}));
console.log(`Saved ${allStationsPath}: ${(fs.statSync(allStationsPath).size / (1024*1024)).toFixed(2)} MB`);

// Also save major junctions from DataMeet
const majorJunctionsPath = path.join(outDir, 'railway-junctions-datameet.json');
fs.writeFileSync(majorJunctionsPath, JSON.stringify({
  type: 'FeatureCollection',
  name: 'DataMeet_Indian_Railways_Major_Junctions',
  features: majorJunctions
}));
console.log(`Saved ${majorJunctionsPath}: ${(fs.statSync(majorJunctionsPath).size / (1024*1024)).toFixed(2)} MB`);
