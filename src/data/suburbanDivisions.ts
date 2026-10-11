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
]
