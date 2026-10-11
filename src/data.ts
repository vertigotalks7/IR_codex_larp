export type TransportKind = 'metro' | 'railway'
export type Status = 'operational' | 'planned'
export type MetroSystemId = 'delhi' | 'bengaluru' | 'chennai' | 'hyderabad' | 'kochi' | 'mumbai' | 'pune' | 'noida' | 'gurugram-rapid' | 'navi-mumbai'

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
  { id: 'delhi', name: 'Delhi Metro', city: 'Delhi NCR', opened: 2002, lines: ['Red', 'Yellow', 'Blue', 'Green', 'Violet', 'Pink', 'Magenta', 'Grey', 'Airport Express'], color: '#f2c94c', center: [77.21, 28.62], source: 'https://delhimetrorail.com/pages/about-us/present-network', dataSource: 'https://www.openstreetmap.org/' },
  { id: 'bengaluru', name: 'Namma Metro', city: 'Bengaluru', opened: 2011, lines: ['Purple', 'Green', 'Yellow'], color: '#9b59b6', center: [77.59, 12.98], source: 'https://english.bmrc.co.in/', dataSource: 'https://github.com/Vonter/bmrcl-gtfs' },
  { id: 'chennai', name: 'Chennai Metro', city: 'Chennai', opened: 2015, lines: ['Blue', 'Green'], color: '#2f80ed', center: [80.24, 13.05], source: 'https://chennaimetrorail.org/metro-line-map/', dataSource: 'https://www.openstreetmap.org/' },
  { id: 'hyderabad', name: 'Hyderabad Metro', city: 'Hyderabad', opened: 2017, lines: ['Red', 'Blue', 'Green'], color: '#e74c3c', center: [78.47, 17.41], source: 'https://hmrl.co.in/', dataSource: 'https://data.opencity.in/dataset/hyderabad-metro-rail-gtfs' },
  { id: 'kochi', name: 'Kochi Metro', city: 'Kochi', opened: 2017, lines: ['Blue'], color: '#00a6a6', center: [76.32, 10.03], source: 'https://kochimetro.org/phase-1-status/', dataSource: 'https://www.openstreetmap.org/' },
  { id: 'mumbai', name: 'Mumbai Metro', city: 'Mumbai', opened: 2014, lines: ['Line 1', 'Line 2', 'Line 3', 'Line 7', 'Line 9'], color: '#f2994a', center: [72.88, 19.14], source: 'https://mmrda.maharashtra.gov.in/en/node/1229', dataSource: 'https://www.openstreetmap.org/' },
  { id: 'pune', name: 'Pune Metro', city: 'Pune', opened: 2022, lines: ['Purple', 'Aqua'], color: '#27ae60', center: [73.86, 18.54], source: 'https://www.mahametro.org/route_maps.html', dataSource: 'https://www.openstreetmap.org/' },
  { id: 'noida', name: 'Noida Metro', city: 'Noida–Greater Noida', opened: 2019, lines: ['Aqua'], color: '#17889a', center: [77.52, 28.56], source: 'https://www.nmrcnoida.com/Projects/Present-Network', dataSource: 'https://www.openstreetmap.org/' },
  { id: 'gurugram-rapid', name: 'Rapid Metro Gurugram', city: 'Gurugram', opened: 2013, lines: ['Rapid Metro'], color: '#526a7d', center: [77.08, 28.49], source: 'https://gmrl.org.in/MillenniumCity.aspx', dataSource: 'https://www.openstreetmap.org/' },
  { id: 'navi-mumbai', name: 'Navi Mumbai Metro', city: 'Navi Mumbai', opened: 2023, lines: ['Line 1'], color: '#2478ad', center: [73.07, 19.03], source: 'https://cidco.maharashtra.gov.in/Page?Token=76747ABE287', dataSource: 'https://www.openstreetmap.org/' },
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

export function isVisible(opened: number, year: number, status: Status, closed?: number) {
  return opened <= year && (!closed || year < closed) && (status === 'operational' || year >= opened)
}
