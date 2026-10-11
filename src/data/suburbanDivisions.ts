export interface SuburbanDivision {
  id: string
  name: string
  city: string
  shortName: string
  color: string
  bounds: { minLon: number; maxLon: number; minLat: number; maxLat: number }
  center: [number, number]
  zoom: number
}

// These are map focus areas, not operator-defined suburban service boundaries.
export const SUBURBAN_DIVISIONS: SuburbanDivision[] = [
  {
    id: 'mumbai',
    name: 'Mumbai urban rail tracks',
    city: 'Mumbai',
    shortName: 'Mumbai',
    color: '#0284c7',
    bounds: { minLon: 72.75, maxLon: 73.4, minLat: 18.88, maxLat: 20 },
    center: [72.88, 19.08],
    zoom: 10,
  },
  {
    id: 'kolkata',
    name: 'Kolkata urban rail tracks',
    city: 'Kolkata',
    shortName: 'Kolkata',
    color: '#059669',
    bounds: { minLon: 88, maxLon: 88.75, minLat: 22.25, maxLat: 23.15 },
    center: [88.36, 22.57],
    zoom: 9.8,
  },
  {
    id: 'chennai',
    name: 'Chennai urban rail tracks',
    city: 'Chennai',
    shortName: 'Chennai',
    color: '#ea580c',
    bounds: { minLon: 79.6, maxLon: 80.35, minLat: 12.65, maxLat: 13.45 },
    center: [80.2, 13.06],
    zoom: 10.2,
  },
  {
    id: 'delhi',
    name: 'Delhi NCR urban rail tracks',
    city: 'Delhi NCR',
    shortName: 'Delhi NCR',
    color: '#dc2626',
    bounds: { minLon: 76.8, maxLon: 77.55, minLat: 28.3, maxLat: 29.05 },
    center: [77.21, 28.65],
    zoom: 9.8,
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad urban rail tracks',
    city: 'Hyderabad',
    shortName: 'Hyderabad',
    color: '#7c3aed',
    bounds: { minLon: 78.25, maxLon: 78.6, minLat: 17.3, maxLat: 17.58 },
    center: [78.47, 17.4],
    zoom: 11.2,
  },
  {
    id: 'pune',
    name: 'Pune urban rail tracks',
    city: 'Pune',
    shortName: 'Pune',
    color: '#d97706',
    bounds: { minLon: 73.35, maxLon: 73.95, minLat: 18.5, maxLat: 18.8 },
    center: [73.85, 18.55],
    zoom: 10.5,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru city rail tracks',
    city: 'Bengaluru',
    shortName: 'Bengaluru',
    color: '#7c3aed',
    bounds: { minLon: 77.35, maxLon: 77.95, minLat: 12.72, maxLat: 13.2 },
    center: [77.59, 12.98],
    zoom: 10,
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad urban rail tracks',
    city: 'Ahmedabad',
    shortName: 'Ahmedabad',
    color: '#0891b2',
    bounds: { minLon: 72.4, maxLon: 72.8, minLat: 22.9, maxLat: 23.2 },
    center: [72.57, 23.03],
    zoom: 10,
  },
  {
    id: 'jaipur',
    name: 'Jaipur urban rail tracks',
    city: 'Jaipur',
    shortName: 'Jaipur',
    color: '#db2777',
    bounds: { minLon: 75.6, maxLon: 76.0, minLat: 26.7, maxLat: 27.0 },
    center: [75.81, 26.92],
    zoom: 10,
  },
  {
    id: 'lucknow',
    name: 'Lucknow urban rail tracks',
    city: 'Lucknow',
    shortName: 'Lucknow',
    color: '#16a34a',
    bounds: { minLon: 80.7, maxLon: 81.1, minLat: 26.7, maxLat: 27.0 },
    center: [80.95, 26.85],
    zoom: 10,
  },
  {
    id: 'nagpur',
    name: 'Nagpur urban rail tracks',
    city: 'Nagpur',
    shortName: 'Nagpur',
    color: '#ca8a04',
    bounds: { minLon: 79.0, maxLon: 79.35, minLat: 20.95, maxLat: 21.25 },
    center: [79.09, 21.15],
    zoom: 10,
  },
  {
    id: 'bhopal',
    name: 'Bhopal urban rail tracks',
    city: 'Bhopal',
    shortName: 'Bhopal',
    color: '#ea580c',
    bounds: { minLon: 77.2, maxLon: 77.55, minLat: 23.1, maxLat: 23.4 },
    center: [77.4, 23.25],
    zoom: 10,
  },
]
