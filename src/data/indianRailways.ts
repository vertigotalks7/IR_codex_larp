export interface RailwayStationStop {
  id: string
  code: string
  name: string
  coordinates: [number, number]
  arrival: string
  departure: string
  day: number
  distanceKm: number
  haltMinutes: number
}

export interface TrainService {
  number: string
  name: string
  type: string
  origin: string
  destination: string
  operator: string
  zone: string
  distanceKm: number
  totalDuration: string
  date: string
  stops: RailwayStationStop[]
  coordinates: [number, number][]
}

export const train17216Stops: RailwayStationStop[] = [
  { id: 'DMM', code: 'DMM', name: 'Dharmavaram Jn', coordinates: [77.7152, 14.4261], arrival: 'Start', departure: '17:50', day: 1, distanceKm: 0, haltMinutes: 0 },
  { id: 'ATP', code: 'ATP', name: 'Anantapur', coordinates: [77.5953, 14.6864], arrival: '18:18', departure: '18:20', day: 1, distanceKm: 34, haltMinutes: 2 },
  { id: 'GYF', code: 'GYF', name: 'Gooty Fort', coordinates: [77.6350, 15.1160], arrival: '19:03', departure: '19:05', day: 1, distanceKm: 91, haltMinutes: 2 },
  { id: 'TU', code: 'TU', name: 'Tadipatri', coordinates: [78.0150, 14.9080], arrival: '19:38', departure: '19:40', day: 1, distanceKm: 139, haltMinutes: 2 },
  { id: 'KDP', code: 'KDP', name: 'Kondapuram', coordinates: [78.1360, 14.9870], arrival: '19:58', departure: '20:00', day: 1, distanceKm: 167, haltMinutes: 2 },
  { id: 'MOO', code: 'MOO', name: 'Muddanuru', coordinates: [78.3390, 14.6710], arrival: '20:14', departure: '20:15', day: 1, distanceKm: 187, haltMinutes: 1 },
  { id: 'YA', code: 'YA', name: 'Yerraguntla Jn', coordinates: [78.5360, 14.6360], arrival: '21:05', departure: '21:15', day: 1, distanceKm: 203, haltMinutes: 10 },
  { id: 'PRDT', code: 'PRDT', name: 'Proddatur', coordinates: [78.5520, 14.7330], arrival: '21:31', departure: '21:32', day: 1, distanceKm: 217, haltMinutes: 1 },
  { id: 'JMDG', code: 'JMDG', name: 'Jammalamadugu', coordinates: [78.4060, 14.8460], arrival: '21:48', departure: '21:50', day: 1, distanceKm: 235, haltMinutes: 2 },
  { id: 'KLKA', code: 'KLKA', name: 'Koilakuntla', coordinates: [78.3240, 15.2340], arrival: '22:29', departure: '22:30', day: 1, distanceKm: 281, haltMinutes: 1 },
  { id: 'BGNP', code: 'BGNP', name: 'Banaganapalle', coordinates: [78.2280, 15.3180], arrival: '22:44', departure: '22:45', day: 1, distanceKm: 293, haltMinutes: 1 },
  { id: 'NDL', code: 'NDL', name: 'Nandyal Jn', coordinates: [78.4840, 15.4800], arrival: '23:40', departure: '23:45', day: 1, distanceKm: 334, haltMinutes: 5 },
  { id: 'GID', code: 'GID', name: 'Giddalur', coordinates: [78.9280, 15.3780], arrival: '00:51', departure: '00:52', day: 2, distanceKm: 388, haltMinutes: 1 },
  { id: 'MRK', code: 'MRK', name: 'Markapur Road', coordinates: [79.2800, 15.7350], arrival: '01:52', departure: '01:53', day: 2, distanceKm: 441, haltMinutes: 1 },
  { id: 'VKN', code: 'VKN', name: 'Vinukonda', coordinates: [79.7460, 16.0540], arrival: '02:51', departure: '02:52', day: 2, distanceKm: 503, haltMinutes: 1 },
  { id: 'NRT', code: 'NRT', name: 'Narasaraopet', coordinates: [80.0500, 16.2360], arrival: '03:26', departure: '03:27', day: 2, distanceKm: 540, haltMinutes: 1 },
  { id: 'GNT', code: 'GNT', name: 'Guntur Jn', coordinates: [80.4365, 16.2980], arrival: '04:40', departure: '04:45', day: 2, distanceKm: 585, haltMinutes: 5 },
  { id: 'BZA', code: 'BZA', name: 'Vijayawada Jn', coordinates: [80.6200, 16.5186], arrival: '05:50', departure: '06:00', day: 2, distanceKm: 617, haltMinutes: 10 },
  { id: 'GDV', code: 'GDV', name: 'Gudivada Jn', coordinates: [80.9930, 16.4350], arrival: '06:43', departure: '06:45', day: 2, distanceKm: 661, haltMinutes: 2 },
  { id: 'GVL', code: 'GVL', name: 'Gudlavalleru', coordinates: [81.0470, 16.3530], arrival: '07:09', departure: '07:10', day: 2, distanceKm: 672, haltMinutes: 1 },
  { id: 'PAV', code: 'PAV', name: 'Pedana', coordinates: [81.1440, 16.2620], arrival: '07:39', departure: '07:40', day: 2, distanceKm: 683, haltMinutes: 1 },
  { id: 'MTM', code: 'MTM', name: 'Machilipatnam', coordinates: [81.1370, 16.1880], arrival: '08:35', departure: 'End', day: 2, distanceKm: 694, haltMinutes: 0 },
]

// Detailed track alignment path passing through all 22 stations and key railway junctions
export const train17216Coordinates: [number, number][] = [
  // 1. Dharmavaram Jn to Anantapur
  [77.7152, 14.4261],
  [77.6980, 14.4620],
  [77.6710, 14.5150],
  [77.6430, 14.5680],
  [77.6200, 14.6150],
  [77.6040, 14.6520],
  [77.5953, 14.6864], // Anantapur
  // 2. Anantapur to Gooty Fort
  [77.5920, 14.7320],
  [77.5900, 14.7950],
  [77.5940, 14.8620],
  [77.6010, 14.9350],
  [77.6150, 15.0120],
  [77.6280, 15.0680],
  [77.6350, 15.1160], // Gooty Fort
  // 3. Gooty Fort to Tadipatri
  [77.6820, 15.0850],
  [77.7450, 15.0420],
  [77.8120, 15.0080],
  [77.8820, 14.9750],
  [77.9450, 14.9410],
  [78.0150, 14.9080], // Tadipatri
  // 4. Tadipatri to Kondapuram
  [78.0480, 14.9280],
  [78.0820, 14.9540],
  [78.1120, 14.9720],
  [78.1360, 14.9870], // Kondapuram
  // 5. Kondapuram to Muddanuru
  [78.1820, 14.9250],
  [78.2350, 14.8450],
  [78.2880, 14.7620],
  [78.3390, 14.6710], // Muddanuru
  // 6. Muddanuru to Yerraguntla Jn
  [78.3950, 14.6520],
  [78.4620, 14.6410],
  [78.5360, 14.6360], // Yerraguntla Jn
  // 7. Yerraguntla Jn to Proddatur
  [78.5410, 14.6720],
  [78.5470, 14.7080],
  [78.5520, 14.7330], // Proddatur
  // 8. Proddatur to Jammalamadugu
  [78.5200, 14.7650],
  [78.4720, 14.8020],
  [78.4060, 14.8460], // Jammalamadugu
  // 9. Jammalamadugu to Koilakuntla
  [78.3820, 14.9250],
  [78.3610, 15.0120],
  [78.3450, 15.1150],
  [78.3240, 15.2340], // Koilakuntla
  // 10. Koilakuntla to Banaganapalle
  [78.2950, 15.2650],
  [78.2620, 15.2920],
  [78.2280, 15.3180], // Banaganapalle
  // 11. Banaganapalle to Nandyal Jn
  [78.2750, 15.3620],
  [78.3380, 15.4050],
  [78.4120, 15.4450],
  [78.4840, 15.4800], // Nandyal Jn
  // 12. Nandyal Jn to Giddalur (Nallamala hills pass)
  [78.5520, 15.4650],
  [78.6350, 15.4420],
  [78.7280, 15.4180],
  [78.8250, 15.3950],
  [78.9280, 15.3780], // Giddalur
  // 13. Giddalur to Markapur Road
  [79.0120, 15.4520],
  [79.0980, 15.5350],
  [79.1850, 15.6320],
  [79.2800, 15.7350], // Markapur Road
  // 14. Markapur Road to Vinukonda
  [79.3850, 15.8120],
  [79.4950, 15.8920],
  [79.6150, 15.9750],
  [79.7460, 16.0540], // Vinukonda
  // 15. Vinukonda to Narasaraopet
  [79.8250, 16.1050],
  [79.9120, 16.1620],
  [80.0500, 16.2360], // Narasaraopet
  // 16. Narasaraopet to Guntur Jn
  [80.1650, 16.2550],
  [80.2850, 16.2750],
  [80.3620, 16.2880],
  [80.4365, 16.2980], // Guntur Jn
  // 17. Guntur Jn to Vijayawada Jn (Krishna River crossing)
  [80.4950, 16.3450],
  [80.5520, 16.4150],
  [80.5980, 16.4820],
  [80.6200, 16.5186], // Vijayawada Jn
  // 18. Vijayawada Jn to Gudivada Jn
  [80.6850, 16.4950],
  [80.7850, 16.4750],
  [80.8950, 16.4520],
  [80.9930, 16.4350], // Gudivada Jn
  // 19. Gudivada Jn to Gudlavalleru
  [81.0180, 16.3980],
  [81.0470, 16.3530], // Gudlavalleru
  // 20. Gudlavalleru to Pedana
  [81.0820, 16.3120],
  [81.1150, 16.2850],
  [81.1440, 16.2620], // Pedana
  // 21. Pedana to Machilipatnam
  [81.1420, 16.2250],
  [81.1370, 16.1880], // Machilipatnam
]

export const train17216: TrainService = {
  number: '17216',
  name: 'DMM MTM Express',
  type: 'Express',
  origin: 'Dharmavaram Jn (DMM)',
  destination: 'Machilipatnam (MTM)',
  operator: 'Indian Railways',
  zone: 'South Central Railway (SCR)',
  distanceKm: 694,
  totalDuration: '14h 45m',
  date: '2026-10-10',
  stops: train17216Stops,
  coordinates: train17216Coordinates,
}
