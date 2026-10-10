import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';

const ZONE_COLORS = {
  'Southern Railway': '#1d4ed8',
  'Northern Railway': '#b91c1c',
  'Western Railway': '#d97706',
  'Central Railway': '#7c3aed',
  'Eastern Railway': '#047857',
  'South Central Railway': '#ea580c',
  'South Eastern Railway': '#0891b2',
  'North Central Railway': '#db2777',
  'North Western Railway': '#a16207',
  'East Coast Railway': '#0f766e',
  'East Central Railway': '#4338ca',
  'West Central Railway': '#4d7c0f',
  'South Western Railway': '#9333ea',
  'South East Central Railway': '#c026d3',
  'Northeast Frontier Railway': '#0284c7',
  'Konkan Railway': '#e11d48',
  'Other': '#475569'
};

function normalizeZone(z) {
  if (!z) return 'Other';
  const clean = z.trim();
  if (clean === 'Westem Railway') return 'Western Railway';
  if (clean === 'Southen Railway') return 'Southern Railway';
  if (clean.includes('Northeast Frontier') || clean.includes('North Frontier')) return 'Northeast Frontier Railway';
  if (clean.includes('East Coast')) return 'East Coast Railway';
  if (clean.includes('East Central')) return 'East Central Railway';
  if (clean.includes('Eastern Railway')) return 'Eastern Railway';
  return clean || 'Other';
}

function perpendicularDistance(p, p1, p2) {
  let dx = p2[0] - p1[0];
  let dy = p2[1] - p1[1];
  if (dx === 0 && dy === 0) {
    return Math.hypot(p[0] - p1[0], p[1] - p1[1]);
  }
  const t = ((p[0] - p1[0]) * dx + (p[1] - p1[1]) * dy) / (dx * dx + dy * dy);
  const clampedT = Math.max(0, Math.min(1, t));
  const projX = p1[0] + clampedT * dx;
  const projY = p1[1] + clampedT * dy;
  return Math.hypot(p[0] - projX, p[1] - projY);
}

function simplifyPoints(points, tolerance = 0.00025) {
  if (points.length <= 2) return points;
  let maxDist = 0;
  let maxIndex = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (d > maxDist) {
      maxDist = d;
      maxIndex = i;
    }
  }
  if (maxDist > tolerance) {
    const left = simplifyPoints(points.slice(0, maxIndex + 1), tolerance);
    const right = simplifyPoints(points.slice(maxIndex), tolerance);
    return left.slice(0, left.length - 1).concat(right);
  } else {
    return [points[0], points[points.length - 1]];
  }
}

function roundCoord(c) {
  return [Math.round(c[0] * 100000) / 100000, Math.round(c[1] * 100000) / 100000];
}

function isValidIndiaCoord(c) {
  return c[0] >= 65 && c[0] <= 98 && c[1] >= 6 && c[1] <= 38;
}

console.log('Reading c:/PROJECTS/codex_new/Railway_Network_.geojson...');
const stream = fs.createReadStream('c:/PROJECTS/codex_new/Railway_Network_.geojson', { encoding: 'utf8' });
const rl = readline.createInterface({ input: stream });

const groupMap = new Map();
const junctionMap = new Map();
let rawFeatureCount = 0;

for await (const line of rl) {
  const trimmed = line.trim();
  if (trimmed.startsWith('{"type":"Feature"') || trimmed.startsWith('{ "type": "Feature"')) {
    try {
      const cleanLine = trimmed.endsWith(',') ? trimmed.slice(0, -1) : trimmed;
      const feat = JSON.parse(cleanLine);
      rawFeatureCount++;
      const p = feat.properties || {};
      const coords = feat.geometry?.coordinates;
      if (!coords || coords.length < 2) continue;

      const validCoords = coords.filter(isValidIndiaCoord);
      if (validCoords.length < 2) continue;

      const simplified = simplifyPoints(validCoords, 0.00025).map(roundCoord);
      const zone = normalizeZone(p.railwayzone);
      const gauge = (p.type || 'Broad Gauge').trim() || 'Broad Gauge';
      const fromJunc = (p.fromjunction || 'Track').trim();
      const toJunc = (p.tojunction || 'Track').trim();

      const key = `${zone}__${fromJunc}__${toJunc}__${gauge}`;

      if (!groupMap.has(key)) {
        groupMap.set(key, {
          properties: {
            id: `ir-${p.id || p.objectid || rawFeatureCount}`,
            name: `${fromJunc} ↔ ${toJunc}`,
            from: fromJunc,
            to: toJunc,
            zone,
            gauge,
            color: ZONE_COLORS[zone] || '#475569',
            speed: p.speed || 100,
            lanes: p.nooflanes || 1,
            length: p.tracklength || 0,
            stations: p.noofstations || 0,
            bridge: p.bridge_yn === 'Y',
            tunnel: p.tunnel_yn === 'Y',
            system: 'rail',
            kind: 'railway'
          },
          lineStrings: []
        });
      }
      groupMap.get(key).lineStrings.push(simplified);

      // Junction records
      if (fromJunc && fromJunc !== 'Track') {
        if (!junctionMap.has(fromJunc)) {
          junctionMap.set(fromJunc, { coord: simplified[0], zones: new Set(), connections: 0 });
        }
        const j = junctionMap.get(fromJunc);
        j.zones.add(zone);
        j.connections++;
      }
      if (toJunc && toJunc !== 'Track') {
        if (!junctionMap.has(toJunc)) {
          junctionMap.set(toJunc, { coord: simplified[simplified.length - 1], zones: new Set(), connections: 0 });
        }
        const j = junctionMap.get(toJunc);
        j.zones.add(zone);
        j.connections++;
      }
    } catch (e) {}
  }
}

console.log(`Processed ${rawFeatureCount} raw features into ${groupMap.size} route sections.`);

const routeFeatures = [];
for (const [key, grp] of groupMap.entries()) {
  let geom;
  if (grp.lineStrings.length === 1) {
    geom = { type: 'LineString', coordinates: grp.lineStrings[0] };
  } else {
    geom = { type: 'MultiLineString', coordinates: grp.lineStrings };
  }
  routeFeatures.push({
    type: 'Feature',
    properties: grp.properties,
    geometry: geom
  });
}

const allJunctions = [];
const majorJunctions = [];
for (const [name, info] of junctionMap.entries()) {
  const primaryZone = Array.from(info.zones)[0] || 'Other';
  const feat = {
    type: 'Feature',
    properties: {
      id: `junc-${name.replace(/\s+/g, '-').toLowerCase()}`,
      name,
      zones: Array.from(info.zones).join(', '),
      primaryZone,
      color: ZONE_COLORS[primaryZone] || '#475569',
      connections: info.connections,
      kind: 'railway-junction'
    },
    geometry: {
      type: 'Point',
      coordinates: info.coord
    }
  };
  allJunctions.push(feat);
  if (info.connections >= 4 || name.toLowerCase().includes('junction') || name.toLowerCase().includes('central') || name.toLowerCase().includes('terminus')) {
    majorJunctions.push(feat);
  }
}

console.log(`Extracted ${allJunctions.length} total junctions (${majorJunctions.length} major junction hubs).`);

// Zone stats
const zoneBreakdown = {};
for (const f of routeFeatures) {
  const z = f.properties.zone;
  if (!zoneBreakdown[z]) {
    zoneBreakdown[z] = {
      name: z,
      routes: 0,
      totalKm: 0,
      maxSpeed: 0,
      color: ZONE_COLORS[z] || '#475569'
    };
  }
  zoneBreakdown[z].routes++;
  zoneBreakdown[z].totalKm += f.properties.length;
  zoneBreakdown[z].maxSpeed = Math.max(zoneBreakdown[z].maxSpeed, f.properties.speed);
}

const outputDir = path.resolve('c:/PROJECTS/codex_new/public/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write files
const routesFile = path.join(outputDir, 'railway-routes.json');
fs.writeFileSync(routesFile, JSON.stringify({
  type: 'FeatureCollection',
  name: 'Indian_Railways_Network_GIS',
  features: routeFeatures
}));

const junctionsFile = path.join(outputDir, 'railway-junctions.json');
fs.writeFileSync(junctionsFile, JSON.stringify({
  type: 'FeatureCollection',
  name: 'Indian_Railways_Junctions_GIS',
  features: allJunctions
}));

const majorJunctionsFile = path.join(outputDir, 'railway-major-junctions.json');
fs.writeFileSync(majorJunctionsFile, JSON.stringify({
  type: 'FeatureCollection',
  name: 'Indian_Railways_Major_Junctions_GIS',
  features: majorJunctions
}));

const metaFile = path.join(outputDir, 'railway-meta.json');
fs.writeFileSync(metaFile, JSON.stringify({
  totalRoutes: routeFeatures.length,
  totalJunctions: allJunctions.length,
  totalMajorJunctions: majorJunctions.length,
  zones: zoneBreakdown,
  gauges: ['Broad Gauge', 'Metre Gauge', 'Narrow Gauge'],
  colors: ZONE_COLORS,
  source: 'Official Indian Railways GIS Network (Railway_Network_.geojson)'
}, null, 2));

console.log(`Routes: ${(fs.statSync(routesFile).size / (1024*1024)).toFixed(2)} MB`);
console.log(`All Junctions: ${(fs.statSync(junctionsFile).size / (1024*1024)).toFixed(2)} MB`);
console.log(`Major Junctions: ${(fs.statSync(majorJunctionsFile).size / (1024*1024)).toFixed(2)} MB`);
console.log(`Metadata written to ${metaFile}`);
