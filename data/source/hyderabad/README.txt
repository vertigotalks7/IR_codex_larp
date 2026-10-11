Hyderabad Metro Rail GTFS feed
==============================

Feed publisher: Open Data Telangana
Download page / mirror: https://data.opencity.in/dataset/hyderabad-metro-rail-gtfs
Original operator source: https://hmrl.co.in/open-data/
Feed start date in feed_info.txt: 2026-07-03
Retrieved for this repository: 2026-10-11
Attribution: Contains data provided by Hyderabad Metro Rail Ltd.

The archive is a static GTFS feed. The local copy includes the feed_info,
routes, trips, shapes, stops, and stop_times records, along with other feed
tables. Route geometry is taken from GTFS shapes, not inferred from station
coordinates. The builder checks feed_info.txt against the recorded snapshot
date before generating the SQLite cache and browser GeoJSON.

See the OpenCity dataset page and HMRL open-data terms for the current license
and attribution requirements. This repository does not claim the live GTFS
feed continues to be unchanged after the recorded 2026-07-03 feed date.
