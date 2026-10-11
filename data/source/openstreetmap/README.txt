Transit Time Machine metro track snapshot
========================================

Source: OpenStreetMap contributors via the Overpass API
Source URLs:
  https://www.openstreetmap.org/
  https://overpass-api.de/api/interpreter
File: metro-ways-2026-10-11.json
OSM base timestamp: 2026-10-11T00:23:05Z
Captured: 2026-10-11
License: Open Database License (ODbL)
Attribution: © OpenStreetMap contributors

The raw Overpass response contains mapped railway=subway ways from focus
bounding boxes around Delhi NCR, Bengaluru, Chennai, Hyderabad, Kochi, Mumbai,
and Pune. The build pipeline uses the raw ways only for the OSM-backed metro
systems; Hyderabad and Bengaluru use their local GTFS route shapes instead.
It filters mapped depot, crossover, siding, explicitly construction/proposed,
test, and out-of-scope line features. Geometry is the original mapped OSM way
geometry. The builder does not connect station coordinates or invent paths.

OSM is community-mapped physical infrastructure, not an operator-certified
service feed. Some way tags may be missing or stale. The generated route bundle
keeps way IDs and links to each OSM way for inspection. Station catalogs are
separate: GTFS station records are available for Hyderabad, Bengaluru, and
Chennai; the other systems currently have only their small hand-curated sample
station sets in the app.
