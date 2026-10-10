import fs from 'node:fs';
import path from 'node:path';

// Define the 6 Indian Suburban Rail Divisions
const SUBURBAN_DIVISIONS = [
  {
    id: 'mumbai',
    name: 'Mumbai Suburban Railway',
    city: 'Mumbai',
    shortName: 'Mumbai Suburban',
    operator: 'Central Railway (CR) & Western Railway (WR)',
    zones: ['Central Railway', 'Western Railway'],
    lines: ['Western Line', 'Central Main Line', 'Harbour Line', 'Trans-Harbour Line', 'Nerul-Uran Line'],
    color: '#0284c7', // Sky Blue
    bounds: { minLon: 72.75, maxLon: 73.40, minLat: 18.88, maxLat: 20.00 },
    center: [72.88, 19.08],
    zoom: 10.0,
    dailyRidership: '7.5 Million+',
    routeKm: 465,
    electrification: '25 kV AC OHE',
    gauge: 'Broad Gauge (1676 mm)'
  },
  {
    id: 'kolkata',
    name: 'Kolkata Suburban Railway',
    city: 'Kolkata',
    shortName: 'Kolkata Suburban',
    operator: 'Eastern Railway (ER) & South Eastern Railway (SER)',
    zones: ['Eastern Railway', 'South Eastern Railway'],
    lines: ['Howrah Division (Main & Chord)', 'Sealdah Division (North & South)', 'Circular Railway'],
    color: '#059669', // Emerald Green
    bounds: { minLon: 88.00, maxLon: 88.75, minLat: 22.25, maxLat: 23.15 },
    center: [88.36, 22.57],
    zoom: 9.8,
    dailyRidership: '3.5 Million+',
    routeKm: 1501,
    electrification: '25 kV AC OHE',
    gauge: 'Broad Gauge (1676 mm)'
  },
  {
    id: 'chennai',
    name: 'Chennai Suburban Railway',
    city: 'Chennai',
    shortName: 'Chennai Suburban',
    operator: 'Southern Railway (SR)',
    zones: ['Southern Railway'],
    lines: ['South Line (Beach–Tambaram–Chengalpattu)', 'West Line (Central–Arakkonam)', 'North Line (Central–Gummidipoondi)', 'MRTS (Beach–Velachery)'],
    color: '#ea580c', // Bright Orange
    bounds: { minLon: 79.60, maxLon: 80.35, minLat: 12.65, maxLat: 13.45 },
    center: [80.20, 13.06],
    zoom: 10.2,
    dailyRidership: '1.2 Million+',
    routeKm: 212,
    electrification: '25 kV AC OHE',
    gauge: 'Broad Gauge (1676 mm)'
  },
  {
    id: 'delhi',
    name: 'Delhi NCR Suburban / EMU Network',
    city: 'Delhi NCR',
    shortName: 'Delhi NCR Suburban',
    operator: 'Northern Railway (NR)',
    zones: ['Northern Railway'],
    lines: ['Delhi Ring Railway', 'Delhi–Ghaziabad–Aligarh', 'Delhi–Panipat', 'Delhi–Palwal', 'Delhi–Rohtak'],
    color: '#dc2626', // Crimson Red
    bounds: { minLon: 76.80, maxLon: 77.55, minLat: 28.30, maxLat: 29.05 },
    center: [77.21, 28.65],
    zoom: 9.8,
    dailyRidership: '350,000+',
    routeKm: 340,
    electrification: '25 kV AC OHE',
    gauge: 'Broad Gauge (1676 mm)'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad MMTS',
    city: 'Hyderabad',
    shortName: 'Hyderabad MMTS',
    operator: 'South Central Railway (SCR)',
    zones: ['South Central Railway'],
    lines: ['Falaknuma–Secunderabad–Lingampalli', 'Hyderabad–Lingampalli', 'Secunderabad–Bolarum–Medchal'],
    color: '#7c3aed', // Purple
    bounds: { minLon: 78.25, maxLon: 78.60, minLat: 17.30, maxLat: 17.58 },
    center: [78.47, 17.40],
    zoom: 11.2,
    dailyRidership: '160,000+',
    routeKm: 50,
    electrification: '25 kV AC OHE',
    gauge: 'Broad Gauge (1676 mm)'
  },
  {
    id: 'pune',
    name: 'Pune Suburban Railway',
    city: 'Pune',
    shortName: 'Pune Suburban',
    operator: 'Central Railway (CR)',
    zones: ['Central Railway'],
    lines: ['Pune–Shivajinagar–Chinchwad–Talegaon–Lonavala Line'],
    color: '#d97706', // Amber
    bounds: { minLon: 73.35, maxLon: 73.95, minLat: 18.50, maxLat: 18.80 },
    center: [73.85, 18.55],
    zoom: 10.5,
    dailyRidership: '100,000+',
    routeKm: 63,
    electrification: '25 kV AC OHE',
    gauge: 'Broad Gauge (1676 mm)'
  }
];

function isInside(coord, b) {
  return coord[0] >= b.minLon && coord[0] <= b.maxLon && coord[1] >= b.minLat && coord[1] <= b.maxLat;
}

// 1. Filter tracks from railway-routes.json
const routesData = JSON.parse(fs.readFileSync('c:/PROJECTS/codex_new/public/data/railway-routes.json', 'utf8'));
const suburbanRoutesFeatures = [];

for (const div of SUBURBAN_DIVISIONS) {
  let count = 0;
  for (const f of routesData.features) {
    let matches = false;
    function checkCoords(c) {
      if (Array.isArray(c[0])) {
        return c.some(checkCoords);
      }
      return isInside(c, div.bounds);
    }

    if (checkCoords(f.geometry.coordinates)) {
      suburbanRoutesFeatures.push({
        type: 'Feature',
        properties: {
          ...f.properties,
          divisionId: div.id,
          divisionName: div.name,
          color: div.color,
          system: 'suburban',
          kind: 'suburban-rail'
        },
        geometry: f.geometry
      });
      count++;
    }
  }
  console.log(`Suburban ${div.name}: ${count} track sections matched.`);
}

// 2. Filter stations from DataMeet stations
const stationsData = JSON.parse(fs.readFileSync('c:/PROJECTS/codex_new/public/data/railway-stations-datameet.json', 'utf8'));
const suburbanStationFeatures = [];

for (const div of SUBURBAN_DIVISIONS) {
  let count = 0;
  for (const f of stationsData.features) {
    if (isInside(f.geometry.coordinates, div.bounds)) {
      suburbanStationFeatures.push({
        type: 'Feature',
        properties: {
          ...f.properties,
          divisionId: div.id,
          divisionName: div.name,
          divisionCity: div.city,
          color: div.color,
          kind: 'suburban-station'
        },
        geometry: f.geometry
      });
      count++;
    }
  }
  console.log(`Suburban ${div.name}: ${count} stations matched.`);
}

const outDir = path.resolve('c:/PROJECTS/codex_new/public/data');
const routesOutPath = path.join(outDir, 'suburban-routes.json');
fs.writeFileSync(routesOutPath, JSON.stringify({
  type: 'FeatureCollection',
  name: 'Indian_Suburban_Railway_Network_GIS',
  features: suburbanRoutesFeatures
}));
console.log(`Saved ${routesOutPath}: ${(fs.statSync(routesOutPath).size / (1024*1024)).toFixed(2)} MB (${suburbanRoutesFeatures.length} features)`);

const stationsOutPath = path.join(outDir, 'suburban-stations.json');
fs.writeFileSync(stationsOutPath, JSON.stringify({
  type: 'FeatureCollection',
  name: 'Indian_Suburban_Railway_Stations',
  features: suburbanStationFeatures
}));
console.log(`Saved ${stationsOutPath}: ${(fs.statSync(stationsOutPath).size / 1024).toFixed(1)} KB (${suburbanStationFeatures.length} stations)`);

const metaOutPath = path.join(outDir, 'suburban-meta.json');
fs.writeFileSync(metaOutPath, JSON.stringify({
  divisions: SUBURBAN_DIVISIONS,
  totalRoutes: suburbanRoutesFeatures.length,
  totalStations: suburbanStationFeatures.length
}, null, 2));
console.log(`Saved metadata to ${metaOutPath}`);
