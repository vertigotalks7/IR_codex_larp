export type TransportKind = 'metro' | 'railway'
export type Status = 'operational' | 'planned'
export type MetroSystemId = 'delhi' | 'bengaluru' | 'chennai' | 'hyderabad' | 'kochi' | 'mumbai' | 'pune'

export type MetroSystem = {
  id: MetroSystemId
  name: string
  city: string
  opened: number
  lines: string[]
  color: string
  center: [number, number]
  source: string
  dataSource: string
}

export type Station = {
  id: string
  name: string
  city: string
  kind: TransportKind
  opened: number
  closed?: number
  coordinates: [number, number]
  lines: string[]
  source: string
  coordinateSource: string
  system: MetroSystemId
}

export type Route = {
  id: string
  name: string
  operator: string
  kind: TransportKind
  color: string
  opened: number
  status: Status
  coordinates: [number, number][]
  source: string
  system: MetroSystemId
}

export const systems: MetroSystem[] = [
  { id: 'delhi', name: 'Delhi Metro', city: 'Delhi NCR', opened: 2002, lines: ['Yellow', 'Blue', 'Magenta'], color: '#f2c94c', center: [77.21, 28.62], source: 'https://delhimetrorail.com/pages/about-us/present-network', dataSource: 'https://otd.delhi.gov.in/data/staticDMRC/' },
  { id: 'bengaluru', name: 'Namma Metro', city: 'Bengaluru', opened: 2011, lines: ['Purple', 'Green'], color: '#9b59b6', center: [77.59, 12.98], source: 'https://english.bmrc.co.in/', dataSource: 'https://github.com/Vonter/bmrcl-gtfs' },
  { id: 'chennai', name: 'Chennai Metro', city: 'Chennai', opened: 2015, lines: ['Blue', 'Green'], color: '#2f80ed', center: [80.24, 13.05], source: 'https://chennaimetrorail.org/', dataSource: 'https://github.com/ungalsoththu/ChennaiGTFS' },
  { id: 'hyderabad', name: 'Hyderabad Metro', city: 'Hyderabad', opened: 2017, lines: ['Red', 'Blue', 'Green'], color: '#e74c3c', center: [78.47, 17.41], source: 'https://hmrl.co.in/', dataSource: 'https://mobilitydatabase.org/feeds/gtfs/mdb-2457' },
  { id: 'kochi', name: 'Kochi Metro', city: 'Kochi', opened: 2017, lines: ['Blue'], color: '#00a6a6', center: [76.32, 10.03], source: 'https://kochimetro.org/', dataSource: 'https://www.urbanmobilityindia.in/Upload/Conference/e1180c5c-edea-4c77-9efb-59c56f8d8aa3.pdf' },
  { id: 'mumbai', name: 'Mumbai Metro', city: 'Mumbai', opened: 2014, lines: ['Blue', 'Red', 'Yellow'], color: '#f2994a', center: [72.88, 19.14], source: 'https://www.mmrda.maharashtra.gov.in/', dataSource: 'https://www.metro2go.in/data-sources' },
  { id: 'pune', name: 'Pune Metro', city: 'Pune', opened: 2022, lines: ['Purple', 'Aqua'], color: '#27ae60', center: [73.86, 18.54], source: 'https://www.punemetrorail.org/', dataSource: 'https://www.punemetrorail.org/' },
]

export const stations: Station[] = [
  { id: 'kashmere', name: 'Kashmere Gate', city: 'Delhi', kind: 'metro', opened: 2004, coordinates: [77.22817, 28.66750], lines: ['yellow'], system: 'delhi', source: 'https://delhimetrorail.com/pages/about-us/present-network', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
  { id: 'chandni', name: 'Chandni Chowk', city: 'Delhi', kind: 'metro', opened: 2004, coordinates: [77.23014, 28.65785], lines: ['yellow'], system: 'delhi', source: 'https://delhimetrorail.com/pages/about-us/present-network', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
  { id: 'new-delhi-metro', name: 'New Delhi', city: 'Delhi', kind: 'metro', opened: 2005, coordinates: [77.22144, 28.64307], lines: ['yellow'], system: 'delhi', source: 'https://delhimetrorail.com/pages/about-us/present-network', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
  { id: 'rajiv-chowk', name: 'Rajiv Chowk', city: 'Delhi', kind: 'metro', opened: 2005, coordinates: [77.21826, 28.63282], lines: ['yellow', 'blue'], system: 'delhi', source: 'https://delhimetrorail.com/pages/about-us/present-network', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
  { id: 'hauz-khas', name: 'Hauz Khas', city: 'Delhi', kind: 'metro', opened: 2010, coordinates: [77.20667, 28.54335], lines: ['yellow', 'magenta'], system: 'delhi', source: 'https://delhimetrorail.com/pages/about-us/present-network', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
  { id: 'huda-city', name: 'Millennium City Centre', city: 'Gurugram', kind: 'metro', opened: 2010, coordinates: [77.07268, 28.45927], lines: ['yellow'], system: 'delhi', source: 'https://delhimetrorail.com/pages/about-us/present-network', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
  { id: 'namma-east', name: 'Whitefield', city: 'Bengaluru', kind: 'metro', opened: 2023, coordinates: [77.7510, 12.9698], lines: ['purple'], system: 'bengaluru', source: 'https://english.bmrc.co.in/', coordinateSource: 'https://github.com/Vonter/bmrcl-gtfs' },
  { id: 'namma-west', name: 'Challaghatta', city: 'Bengaluru', kind: 'metro', opened: 2023, coordinates: [77.4886, 12.9565], lines: ['purple'], system: 'bengaluru', source: 'https://english.bmrc.co.in/', coordinateSource: 'https://github.com/Vonter/bmrcl-gtfs' },
  { id: 'chennai-north', name: 'Wimco Nagar', city: 'Chennai', kind: 'metro', opened: 2021, coordinates: [80.2844, 13.1703], lines: ['blue'], system: 'chennai', source: 'https://chennaimetrorail.org/', coordinateSource: 'https://github.com/ungalsoththu/ChennaiGTFS' },
  { id: 'chennai-south', name: 'Airport', city: 'Chennai', kind: 'metro', opened: 2015, coordinates: [80.1655, 12.9815], lines: ['blue'], system: 'chennai', source: 'https://chennaimetrorail.org/', coordinateSource: 'https://github.com/ungalsoththu/ChennaiGTFS' },
  { id: 'hyderabad-west', name: 'Miyapur', city: 'Hyderabad', kind: 'metro', opened: 2017, coordinates: [78.3736, 17.4968], lines: ['red'], system: 'hyderabad', source: 'https://hmrl.co.in/', coordinateSource: 'https://mobilitydatabase.org/feeds/gtfs/mdb-2457' },
  { id: 'hyderabad-east', name: 'LB Nagar', city: 'Hyderabad', kind: 'metro', opened: 2018, coordinates: [78.5520, 17.3457], lines: ['red'], system: 'hyderabad', source: 'https://hmrl.co.in/', coordinateSource: 'https://mobilitydatabase.org/feeds/gtfs/mdb-2457' },
  { id: 'kochi-north', name: 'Aluva', city: 'Kochi', kind: 'metro', opened: 2017, coordinates: [76.3500, 10.1100], lines: ['blue'], system: 'kochi', source: 'https://kochimetro.org/', coordinateSource: 'https://www.urbanmobilityindia.in/Upload/Conference/e1180c5c-edea-4c77-9efb-59c56f8d8aa3.pdf' },
  { id: 'kochi-south', name: 'Tripunithura', city: 'Kochi', kind: 'metro', opened: 2024, coordinates: [76.3420, 9.9490], lines: ['blue'], system: 'kochi', source: 'https://kochimetro.org/', coordinateSource: 'https://www.urbanmobilityindia.in/Upload/Conference/e1180c5c-edea-4c77-9efb-59c56f8d8aa3.pdf' },
  { id: 'mumbai-west', name: 'Versova', city: 'Mumbai', kind: 'metro', opened: 2014, coordinates: [72.8180, 19.1290], lines: ['blue'], system: 'mumbai', source: 'https://www.mmrda.maharashtra.gov.in/', coordinateSource: 'https://www.metro2go.in/data-sources' },
  { id: 'mumbai-east', name: 'Ghatkopar', city: 'Mumbai', kind: 'metro', opened: 2014, coordinates: [72.9080, 19.0860], lines: ['blue'], system: 'mumbai', source: 'https://www.mmrda.maharashtra.gov.in/', coordinateSource: 'https://www.metro2go.in/data-sources' },
  { id: 'pune-north', name: 'PCMC', city: 'Pune', kind: 'metro', opened: 2022, coordinates: [73.8000, 18.6280], lines: ['purple'], system: 'pune', source: 'https://www.punemetrorail.org/', coordinateSource: 'https://www.punemetrorail.org/' },
  { id: 'pune-south', name: 'Swargate', city: 'Pune', kind: 'metro', opened: 2022, coordinates: [73.8580, 18.5010], lines: ['purple'], system: 'pune', source: 'https://www.punemetrorail.org/', coordinateSource: 'https://www.punemetrorail.org/' },
]

export const routes: Route[] = [
  { id: 'yellow', name: 'Yellow Line', operator: 'Delhi Metro Rail Corporation', kind: 'metro', system: 'delhi', color: '#f2c94c', opened: 2004, status: 'operational', coordinates: [[77.22817, 28.66750], [77.23014, 28.65785], [77.22144, 28.64307], [77.21826, 28.63282], [77.20667, 28.54335], [77.07268, 28.45927]], source: 'https://delhimetrorail.com/pages/about-us/present-network' },
  { id: 'blue', name: 'Blue Line', operator: 'Delhi Metro Rail Corporation', kind: 'metro', system: 'delhi', color: '#3298dc', opened: 2005, status: 'operational', coordinates: [[77.21826, 28.63282], [77.19, 28.625], [77.16, 28.62]], source: 'https://delhimetrorail.com/pages/about-us/present-network' },
  { id: 'magenta', name: 'Magenta Line', operator: 'Delhi Metro Rail Corporation', kind: 'metro', system: 'delhi', color: '#d44c9a', opened: 2018, status: 'operational', coordinates: [[77.20667, 28.54335], [77.18, 28.535], [77.15, 28.53]], source: 'https://delhimetrorail.com/pages/about-us/present-network' },
  { id: 'blr-purple', name: 'Purple Line', operator: 'Bangalore Metro Rail Corporation', kind: 'metro', system: 'bengaluru', color: '#9b59b6', opened: 2011, status: 'operational', coordinates: [[77.4886, 12.9565], [77.58, 12.975], [77.7510, 12.9698]], source: 'https://english.bmrc.co.in/' },
  { id: 'blr-green', name: 'Green Line', operator: 'Bangalore Metro Rail Corporation', kind: 'metro', system: 'bengaluru', color: '#27ae60', opened: 2014, status: 'operational', coordinates: [[77.50, 13.05], [77.56, 12.98], [77.58, 12.93]], source: 'https://english.bmrc.co.in/' },
  { id: 'maa-blue', name: 'Blue Line', operator: 'Chennai Metro Rail', kind: 'metro', system: 'chennai', color: '#2f80ed', opened: 2015, status: 'operational', coordinates: [[80.2844, 13.1703], [80.27, 13.08], [80.1655, 12.9815]], source: 'https://chennaimetrorail.org/' },
  { id: 'maa-green', name: 'Green Line', operator: 'Chennai Metro Rail', kind: 'metro', system: 'chennai', color: '#2ecc71', opened: 2015, status: 'operational', coordinates: [[80.25, 13.08], [80.22, 13.02], [80.18, 12.98]], source: 'https://chennaimetrorail.org/' },
  { id: 'hyd-red', name: 'Red Line', operator: 'Hyderabad Metro Rail', kind: 'metro', system: 'hyderabad', color: '#e74c3c', opened: 2017, status: 'operational', coordinates: [[78.3736, 17.4968], [78.48, 17.43], [78.5520, 17.3457]], source: 'https://hmrl.co.in/' },
  { id: 'hyd-blue', name: 'Blue Line', operator: 'Hyderabad Metro Rail', kind: 'metro', system: 'hyderabad', color: '#3498db', opened: 2017, status: 'operational', coordinates: [[78.48, 17.43], [78.50, 17.40], [78.53, 17.37]], source: 'https://hmrl.co.in/' },
  { id: 'hyd-green', name: 'Green Line', operator: 'Hyderabad Metro Rail', kind: 'metro', system: 'hyderabad', color: '#2ecc71', opened: 2020, status: 'operational', coordinates: [[78.48, 17.43], [78.47, 17.39], [78.48, 17.35]], source: 'https://hmrl.co.in/' },
  { id: 'kochi-blue', name: 'Blue Line', operator: 'Kochi Metro Rail', kind: 'metro', system: 'kochi', color: '#00a6a6', opened: 2017, status: 'operational', coordinates: [[76.3500, 10.1100], [76.31, 10.02], [76.3420, 9.9490]], source: 'https://kochimetro.org/' },
  { id: 'mum-blue', name: 'Line 1 Blue', operator: 'Mumbai Metro', kind: 'metro', system: 'mumbai', color: '#3498db', opened: 2014, status: 'operational', coordinates: [[72.8180, 19.1290], [72.87, 19.11], [72.9080, 19.0860]], source: 'https://www.mmrda.maharashtra.gov.in/' },
  { id: 'mum-red', name: 'Line 7 Red', operator: 'Mumbai Metro', kind: 'metro', system: 'mumbai', color: '#e74c3c', opened: 2022, status: 'operational', coordinates: [[72.85, 19.17], [72.92, 19.21], [72.97, 19.30]], source: 'https://www.mmrda.maharashtra.gov.in/' },
  { id: 'mum-yellow', name: 'Line 2A Yellow', operator: 'Mumbai Metro', kind: 'metro', system: 'mumbai', color: '#f2c94c', opened: 2022, status: 'operational', coordinates: [[72.83, 19.16], [72.87, 19.20], [72.91, 19.24]], source: 'https://www.mmrda.maharashtra.gov.in/' },
  { id: 'pune-purple', name: 'Purple Line', operator: 'Maha Metro', kind: 'metro', system: 'pune', color: '#9b59b6', opened: 2022, status: 'operational', coordinates: [[73.8000, 18.6280], [73.84, 18.56], [73.8580, 18.5010]], source: 'https://www.punemetrorail.org/' },
  { id: 'pune-aqua', name: 'Aqua Line', operator: 'Maha Metro', kind: 'metro', system: 'pune', color: '#00a6a6', opened: 2022, status: 'operational', coordinates: [[73.88, 18.57], [73.92, 18.55], [73.95, 18.52]], source: 'https://www.punemetrorail.org/' },
]

export const years = [2002, 2004, 2010, 2014, 2017, 2018, 2022, 2024]

export function isVisible(opened: number, year: number, status: Status, closed?: number) {
  return opened <= year && (!closed || year < closed) && (status === 'operational' || year >= opened)
}

export const milestones = [
  { year: 2002, label: 'Delhi Metro begins service', detail: 'India’s first modern metro system in this dataset opens its first corridor.', coordinates: [77.22817, 28.66750] as [number, number] },
  { year: 2011, label: 'Namma Metro begins service', detail: 'Bengaluru joins the growing network of Indian metro cities.', coordinates: [77.58, 12.975] as [number, number] },
  { year: 2015, label: 'Chennai Metro begins service', detail: 'The first Chennai Metro corridor opens to passengers.', coordinates: [80.22, 13.05] as [number, number] },
  { year: 2017, label: 'Kochi and Hyderabad expand the map', detail: 'Two southern systems enter the historical atlas.', coordinates: [78.48, 17.43] as [number, number] },
  { year: 2022, label: 'Mumbai and Pune additions', detail: 'The map widens with new metro systems and multiple colored lines.', coordinates: [73.84, 18.56] as [number, number] },
]
