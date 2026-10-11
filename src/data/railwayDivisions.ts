/**
 * Administrative railway divisions published by Railway Board. This is a
 * directory, not a division-wide service, station, or route dataset.
 */
export const RAILWAY_ADMIN_SOURCE = {
  label: 'Railway Board directory',
  url: 'https://dir.railnet.gov.in/',
  asOf: 'updated through July 2026',
} as const

export const RAILWAY_BASE_ROSTER_SOURCE = {
  label: 'Railway Board · zones and divisions roster',
  url: 'https://indianrailways.gov.in/railwayboard/uploads/directorate/eff_res/Re_organization/List%20of%20Zones%20%26%20Divisions061123.pdf',
  asOf: '2023-11-06',
} as const

export const SOUTH_COAST_EFFECTIVE_SOURCE = {
  label: 'Ministry of Railways · South Coast Railway effective date',
  url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2256199&lang=1&reg=20',
  asOf: 'effective 2026-06-01',
} as const

export const RAILWAY_DIVISION_REORGANIZATION_SOURCE = {
  label: 'Ministry of Railways · Visakhapatnam and Rayagada divisions',
  url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2100854&lang=2&reg=48',
  asOf: '2025-02-07',
} as const

export type RailwayHistoryZone = {
  id: string
  name: string
  code: string
  headquarters: string
  formedYear: number
  divisions: readonly string[]
}

export const RAILWAY_HISTORY_ZONES: readonly RailwayHistoryZone[] = [
  { id: 'CR', name: 'Central Railway', code: 'CR', headquarters: 'Mumbai', formedYear: 1951, divisions: ['Mumbai', 'Bhusaval', 'Nagpur', 'Solapur', 'Pune'] },
  { id: 'ER', name: 'Eastern Railway', code: 'ER', headquarters: 'Kolkata', formedYear: 1952, divisions: ['Asansol', 'Howrah', 'Malda', 'Sealdah'] },
  { id: 'ECR', name: 'East Central Railway', code: 'ECR', headquarters: 'Hajipur', formedYear: 2002, divisions: ['Sonpur', 'Samastipur', 'Danapur', 'Dhanbad', 'Pt. Deen Dayal Upadhyaya'] },
  { id: 'ECoR', name: 'East Coast Railway', code: 'ECoR', headquarters: 'Bhubaneswar', formedYear: 2003, divisions: ['Khurda Road', 'Sambalpur', 'Rayagada'] },
  { id: 'NR', name: 'Northern Railway', code: 'NR', headquarters: 'New Delhi', formedYear: 1952, divisions: ['Ambala', 'Delhi', 'Lucknow', 'Moradabad', 'Ferozpur'] },
  { id: 'NCR', name: 'North Central Railway', code: 'NCR', headquarters: 'Prayagraj', formedYear: 2003, divisions: ['Prayagraj', 'Agra', 'Jhansi'] },
  { id: 'NER', name: 'North Eastern Railway', code: 'NER', headquarters: 'Gorakhpur', formedYear: 1952, divisions: ['Lucknow', 'Izzatnagar', 'Varanasi'] },
  { id: 'NFR', name: 'Northeast Frontier Railway', code: 'NFR', headquarters: 'Guwahati', formedYear: 1958, divisions: ['Alipurduar', 'Katihar', 'Lumding', 'Rangiya', 'Tinsukia'] },
  { id: 'NWR', name: 'North Western Railway', code: 'NWR', headquarters: 'Jaipur', formedYear: 2002, divisions: ['Ajmer', 'Bikaner', 'Jaipur', 'Jodhpur'] },
  { id: 'SR', name: 'Southern Railway', code: 'SR', headquarters: 'Chennai', formedYear: 1951, divisions: ['Chennai', 'Madurai', 'Palakkad', 'Tiruchchirappalli', 'Thiruvananthapuram', 'Salem'] },
  { id: 'SCR', name: 'South Central Railway', code: 'SCR', headquarters: 'Secunderabad', formedYear: 1966, divisions: ['Hyderabad', 'Nanded', 'Secunderabad'] },
  { id: 'SCoR', name: 'South Coast Railway', code: 'SCoR', headquarters: 'Visakhapatnam', formedYear: 2026, divisions: ['Guntakal', 'Guntur', 'Vijayawada', 'Visakhapatnam'] },
  { id: 'SER', name: 'South Eastern Railway', code: 'SER', headquarters: 'Kolkata', formedYear: 1955, divisions: ['Adra', 'Chakradharpur', 'Kharagpur', 'Ranchi'] },
  { id: 'SECR', name: 'South East Central Railway', code: 'SECR', headquarters: 'Bilaspur', formedYear: 2003, divisions: ['Raipur', 'Nagpur', 'Bilaspur'] },
  { id: 'SWR', name: 'South Western Railway', code: 'SWR', headquarters: 'Hubballi', formedYear: 2003, divisions: ['Bengaluru', 'Hubballi', 'Mysuru'] },
  { id: 'WR', name: 'Western Railway', code: 'WR', headquarters: 'Mumbai', formedYear: 1951, divisions: ['Mumbai Central', 'Vadodara', 'Ratlam', 'Ahmedabad', 'Rajkot', 'Bhavnagar'] },
  { id: 'WCR', name: 'West Central Railway', code: 'WCR', headquarters: 'Jabalpur', formedYear: 2003, divisions: ['Bhopal', 'Jabalpur', 'Kota'] },
  { id: 'METRO', name: 'Metro Railway, Kolkata', code: 'METRO', headquarters: 'Kolkata', formedYear: 2010, divisions: [] },
] as const

export const RAILWAY_OPERATING_DIVISION_COUNT = RAILWAY_HISTORY_ZONES
  .reduce((total, zone) => total + zone.divisions.length, 0)

export const RAILWAY_OPERATING_ZONE_COUNT = RAILWAY_HISTORY_ZONES
  .filter((zone) => zone.id !== 'METRO').length
