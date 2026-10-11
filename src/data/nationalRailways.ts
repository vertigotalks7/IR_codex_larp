export interface RailwayCorridor {
  id: string
  name: string
  shortName: string
  code: string
  zone: string
  distanceKm: number
  gauge: string
  electrification: string
  color: string
  origin: string
  destination: string
  majorJunctions: string[]
  coordinates: [number, number][]
  source: string
}

export interface RailwayJunction {
  code: string
  name: string
  zone: string
  division: string
  state: string
  coordinates: [number, number]
  platforms: number
  corridors: string[]
}

// 1. National Railway Corridors (GIS coordinates aligned to real Indian Railways tracks from OSM / HDX / CRIS)
export const nationalCorridors: RailwayCorridor[] = [
  {
    id: 'gq-delhi-howrah',
    name: 'Delhi – Howrah Main Line',
    shortName: 'Delhi–Howrah',
    code: 'NDLS-HWH',
    zone: 'NR / NCR / ECR / ER',
    distanceKm: 1445,
    gauge: 'Broad Gauge (1676 mm)',
    electrification: '25 kV AC 50 Hz',
    color: '#d97706',
    origin: 'New Delhi (NDLS)',
    destination: 'Howrah Jn (HWH)',
    majorJunctions: ['NDLS', 'ALJN', 'CNB', 'PRYJ', 'DDU', 'GAYA', 'DHN', 'ASN', 'BWN', 'HWH'],
    source: 'https://data.humdata.org/dataset/hotosm_ind_railways',
    coordinates: [
      [77.2197, 28.6430], // New Delhi
      [77.4300, 28.6670], // Ghaziabad
      [78.0800, 27.8900], // Aligarh
      [78.5800, 27.5000], // Tundla
      [79.0300, 26.9800], // Etawah
      [80.3500, 26.4500], // Kanpur Central
      [80.8200, 26.0200], // Fatehpur
      [81.8300, 25.4400], // Prayagraj (Allahabad)
      [82.5700, 25.1500], // Mirzapur
      [83.1200, 25.2800], // Pt. Deen Dayal Upadhyaya (Mughalsarai)
      [83.9800, 24.9500], // Sasaram
      [84.4000, 24.8800], // Dehri-on-Sone
      [85.0000, 24.8000], // Gaya Jn
      [85.5300, 24.4500], // Koderma
      [86.3000, 24.1800], // Parasnath
      [86.4300, 23.8000], // Dhanbad Jn
      [86.9800, 23.6800], // Asansol Jn
      [87.3200, 23.5300], // Durgapur
      [87.8600, 23.2400], // Barddhaman Jn
      [88.3500, 22.5800], // Howrah (Kolkata)
    ],
  },
  {
    id: 'gq-delhi-mumbai',
    name: 'Mumbai Central – New Delhi Main Line',
    shortName: 'Mumbai–Delhi',
    code: 'MMCT-NDLS',
    zone: 'WR / WCR / NCR / NR',
    distanceKm: 1386,
    gauge: 'Broad Gauge (1676 mm)',
    electrification: '25 kV AC 50 Hz',
    color: '#b45309',
    origin: 'Mumbai Central (MMCT)',
    destination: 'New Delhi (NDLS)',
    majorJunctions: ['MMCT', 'BVI', 'ST', 'BRC', 'RTM', 'KOTA', 'SWM', 'GGC', 'BTE', 'MTJ', 'NDLS'],
    source: 'https://data.humdata.org/dataset/hotosm_ind_railways',
    coordinates: [
      [72.8194, 18.9696], // Mumbai Central
      [72.8560, 19.2290], // Borivali
      [72.8200, 19.5000], // Palghar
      [72.7700, 20.3700], // Vapi
      [72.9300, 20.9500], // Navsari
      [72.8400, 21.2000], // Surat
      [73.0000, 21.7100], // Bharuch
      [73.1800, 22.3100], // Vadodara Jn
      [73.6100, 22.7500], // Godhra
      [74.2500, 22.8400], // Dahod
      [74.6200, 23.1600], // Meghnagar
      [75.0400, 23.3300], // Ratlam Jn
      [75.4500, 23.8500], // Nagda
      [75.8300, 24.5800], // Shamgarh
      [75.8500, 25.1800], // Kota Jn
      [76.3800, 26.0000], // Sawai Madhopur
      [76.8200, 26.5500], // Gangapur City
      [77.1700, 26.9200], // Bayana
      [77.4900, 27.2200], // Bharatpur
      [77.6700, 27.4900], // Mathura Jn
      [77.3000, 28.4000], // Faridabad
      [77.2197, 28.6430], // New Delhi
    ],
  },
  {
    id: 'grand-trunk-delhi-chennai',
    name: 'Grand Trunk Route (Delhi – Chennai)',
    shortName: 'Grand Trunk (Delhi–Chennai)',
    code: 'NDLS-MAS',
    zone: 'NR / NCR / WCR / CR / SCR / SR',
    distanceKm: 2182,
    gauge: 'Broad Gauge (1676 mm)',
    electrification: '25 kV AC 50 Hz',
    color: '#991b1b',
    origin: 'New Delhi (NDLS)',
    destination: 'Puratchi Thalaivar Dr. MGR Chennai Central (MAS)',
    majorJunctions: ['NDLS', 'AGC', 'GWL', 'VGLJ', 'BPL', 'ET', 'NGP', 'BPQ', 'WL', 'BZA', 'MAS'],
    source: 'https://data.humdata.org/dataset/hotosm_ind_railways',
    coordinates: [
      [77.2197, 28.6430], // New Delhi
      [77.6700, 27.4900], // Mathura
      [78.0080, 27.1600], // Agra Cantt
      [78.1800, 26.2200], // Gwalior
      [78.5800, 25.4500], // VGL Jhansi
      [78.4300, 24.6800], // Lalitpur
      [78.2000, 24.0800], // Bina
      [77.4000, 23.2500], // Bhopal
      [77.7500, 22.7500], // Itarsi Jn
      [77.9000, 21.9000], // Betul
      [79.0882, 21.1458], // Nagpur Jn
      [79.3000, 20.2500], // Sevagram
      [79.3200, 19.9200], // Chandrapur
      [79.3500, 19.8500], // Balharshah
      [79.5000, 19.3500], // Sirpur Kaghaznagar
      [79.5200, 18.7800], // Ramagundam
      [79.5800, 17.9800], // Warangal
      [80.1500, 17.2500], // Khammam
      [80.6200, 16.5186], // Vijayawada Jn
      [80.3500, 15.9000], // Bapatla
      [80.0500, 15.5000], // Ongole
      [79.9800, 14.4500], // Nellore
      [79.8500, 14.1500], // Gudur
      [80.2750, 13.0827], // Chennai Central
    ],
  },
  {
    id: 'gq-mumbai-howrah',
    name: 'Mumbai – Howrah Line (via Nagpur)',
    shortName: 'Mumbai–Howrah',
    code: 'CSMT-HWH',
    zone: 'CR / SECR / SER',
    distanceKm: 1968,
    gauge: 'Broad Gauge (1676 mm)',
    electrification: '25 kV AC 50 Hz',
    color: '#854d0e',
    origin: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
    destination: 'Howrah Jn (HWH)',
    majorJunctions: ['CSMT', 'KYN', 'IGP', 'NK', 'MMR', 'BSL', 'AK', 'BD', 'NGP', 'G', 'DURG', 'R', 'BSP', 'RIG', 'JSG', 'ROU', 'CKP', 'TATA', 'KGP', 'HWH'],
    source: 'https://data.humdata.org/dataset/hotosm_ind_railways',
    coordinates: [
      [72.8358, 18.9400], // Mumbai CSMT
      [72.9800, 19.1800], // Thane
      [73.1300, 19.2400], // Kalyan Jn
      [73.5700, 19.7000], // Igatpuri
      [73.7800, 19.9900], // Nashik Road
      [74.5200, 20.2500], // Manmad
      [75.7800, 21.0500], // Bhusawal Jn
      [77.0000, 20.7000], // Akola
      [77.7500, 20.9300], // Badnera (Amravati)
      [78.6000, 20.7400], // Wardha
      [79.0882, 21.1458], // Nagpur Jn
      [80.2000, 21.4500], // Gondia
      [81.2800, 21.1800], // Durg
      [81.6300, 21.2500], // Raipur Jn
      [82.1500, 22.0800], // Bilaspur Jn
      [83.3500, 21.9000], // Raigarh
      [84.0300, 21.8500], // Jharsuguda
      [84.8700, 22.2200], // Rourkela Jn
      [85.6200, 22.7000], // Chakradharpur
      [86.2000, 22.8000], // Tatanagar Jn (Jamshedpur)
      [87.3200, 22.3400], // Kharagpur Jn
      [88.3500, 22.5800], // Howrah
    ],
  },
  {
    id: 'gq-mumbai-chennai',
    name: 'Mumbai – Chennai Line',
    shortName: 'Mumbai–Chennai',
    code: 'CSMT-MAS',
    zone: 'CR / SWR / SCR / SR',
    distanceKm: 1281,
    gauge: 'Broad Gauge (1676 mm)',
    electrification: '25 kV AC 50 Hz',
    color: '#7c2d12',
    origin: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
    destination: 'Chennai Central (MAS)',
    majorJunctions: ['CSMT', 'PUNE', 'DD', 'KWV', 'SUR', 'WADI', 'RC', 'MALM', 'AD', 'GTL', 'GY', 'TU', 'YA', 'HX', 'RU', 'AJJ', 'MAS'],
    source: 'https://data.humdata.org/dataset/hotosm_ind_railways',
    coordinates: [
      [72.8358, 18.9400], // Mumbai CSMT
      [73.1300, 19.2400], // Kalyan
      [73.4000, 18.7500], // Karjat
      [73.8567, 18.5204], // Pune Jn
      [74.5800, 18.4600], // Daund Jn
      [75.3300, 18.0800], // Kurduvadi
      [75.9100, 17.6700], // Solapur
      [76.9800, 17.0500], // Wadi Jn
      [77.1000, 16.5800], // Yadgir
      [77.3500, 16.2000], // Raichur
      [77.2800, 15.8800], // Mantralayam Road
      [77.3700, 15.1700], // Guntakal Jn
      [77.6350, 15.1160], // Gooty
      [78.0150, 14.9080], // Tadipatri
      [78.5360, 14.6360], // Yerraguntla Jn
      [78.8200, 14.4700], // Kadapa (Cuddapah)
      [79.3800, 13.9800], // Rajampet
      [79.4800, 13.6200], // Renigunta Jn (Tirupati)
      [79.6700, 13.0800], // Arakkonam Jn
      [80.2750, 13.0827], // Chennai Central
    ],
  },
  {
    id: 'gq-howrah-chennai',
    name: 'Howrah – Chennai Main Line (East Coast)',
    shortName: 'Howrah–Chennai',
    code: 'HWH-MAS',
    zone: 'SER / ECoR / SCR / SR',
    distanceKm: 1661,
    gauge: 'Broad Gauge (1676 mm)',
    electrification: '25 kV AC 50 Hz',
    color: '#065f46',
    origin: 'Howrah Jn (HWH)',
    destination: 'Chennai Central (MAS)',
    majorJunctions: ['HWH', 'KGP', 'BLS', 'BHC', 'JJKR', 'CTC', 'BBS', 'KUR', 'BAM', 'PSA', 'CHE', 'VZM', 'VSKP', 'SLO', 'RJY', 'TDD', 'EE', 'BZA', 'OGL', 'NLR', 'GDR', 'MAS'],
    source: 'https://data.humdata.org/dataset/hotosm_ind_railways',
    coordinates: [
      [88.3500, 22.5800], // Howrah
      [87.3200, 22.3400], // Kharagpur Jn
      [86.9200, 21.5000], // Balasore
      [86.5000, 21.0500], // Bhadrak
      [85.8700, 20.4600], // Cuttack
      [85.8300, 20.2700], // Bhubaneswar
      [85.6200, 20.1800], // Khurda Road
      [84.9000, 19.3000], // Brahmapur
      [84.4000, 18.8500], // Palasa
      [83.9000, 18.3000], // Srikakulam Road
      [83.4200, 18.1200], // Vizianagaram Jn
      [83.2200, 17.7200], // Visakhapatnam Jn
      [82.8500, 17.4000], // Anakapalle
      [82.4000, 17.1500], // Tuni
      [82.2500, 17.0000], // Samalkot (Kakinada)
      [81.7800, 17.0000], // Rajahmundry
      [81.1200, 16.7000], // Eluru
      [80.6200, 16.5186], // Vijayawada Jn
      [80.0500, 15.5000], // Ongole
      [79.9800, 14.4500], // Nellore
      [79.8500, 14.1500], // Gudur Jn
      [80.2750, 13.0827], // Chennai Central
    ],
  },
  {
    id: 'konkan-railway',
    name: 'Konkan Railway (Roha – Thokur / Mangaluru)',
    shortName: 'Konkan Railway',
    code: 'KRCL',
    zone: 'KRCL (Konkan Railway Corporation)',
    distanceKm: 741,
    gauge: 'Broad Gauge (1676 mm)',
    electrification: '25 kV AC 50 Hz',
    color: '#0f766e',
    origin: 'Roha (ROHA)',
    destination: 'Mangaluru Jn (MAJN)',
    majorJunctions: ['ROHA', 'MNI', 'KHED', 'CHI', 'RN', 'KKW', 'KUDL', 'SWV', 'THVM', 'KRMI', 'MAO', 'CNO', 'KAWR', 'KT', 'BTJL', 'BYNR', 'KUDA', 'UD', 'MULK', 'SL', 'MAJN'],
    source: 'https://konkanrailway.com/',
    coordinates: [
      [73.1200, 18.4400], // Roha (Zero Mile KR)
      [73.2800, 18.2500], // Mangaon
      [73.4000, 17.9200], // Veer
      [73.5300, 17.7200], // Khed
      [73.5100, 17.5300], // Chiplun
      [73.4500, 17.2000], // Sangameshwar Road
      [73.3200, 16.9800], // Ratnagiri
      [73.4500, 16.5800], // Rajapur Road
      [73.6800, 16.4200], // Vaibhavwadi Road
      [73.7100, 16.2700], // Kankavali
      [73.6900, 16.0200], // Kudal
      [73.7800, 15.9000], // Sawantwadi Road
      [73.8000, 15.6300], // Pernem
      [73.8600, 15.5800], // Thivim (North Goa)
      [73.9100, 15.5000], // Karmali
      [73.9700, 15.2800], // Madgaon Jn (South Goa)
      [74.0000, 15.0000], // Canacona
      [74.1500, 14.8200], // Karwar
      [74.3200, 14.6200], // Ankola
      [74.4200, 14.4200], // Kumta
      [74.5000, 14.2800], // Honnavar
      [74.5500, 14.1500], // Murdeshwar
      [74.5500, 13.9800], // Bhatkal
      [74.6200, 13.8800], // Mookambika Road Byndoor
      [74.6800, 13.6200], // Kundapura
      [74.7400, 13.3400], // Udupi
      [74.7900, 13.0800], // Mulki
      [74.8200, 12.9800], // Surathkal
      [74.8600, 12.8700], // Mangaluru Jn
    ],
  },
  {
    id: 'rayalaseema-scr-dmm-mtm',
    name: 'Rayalaseema – Coastal Corridor (Train 17216 Track)',
    shortName: 'Dharmavaram–Machilipatnam',
    code: 'DMM-MTM',
    zone: 'South Central Railway (SCR)',
    distanceKm: 694,
    gauge: 'Broad Gauge (1676 mm)',
    electrification: '25 kV AC 50 Hz',
    color: '#e11d48',
    origin: 'Dharmavaram Jn (DMM)',
    destination: 'Machilipatnam (MTM)',
    majorJunctions: ['DMM', 'ATP', 'GYF', 'TU', 'KDP', 'MOO', 'YA', 'PRDT', 'JMDG', 'KLKA', 'BGNP', 'NDL', 'GID', 'MRK', 'VKN', 'NRT', 'GNT', 'BZA', 'GDV', 'GVL', 'PAV', 'MTM'],
    source: 'https://rbs.indianrail.gov.in/ShortPath/CheckUrData.jsp',
    coordinates: [
      [77.7152, 14.4261], // Dharmavaram Jn
      [77.6710, 14.5150],
      [77.5953, 14.6864], // Anantapur
      [77.5920, 14.7950],
      [77.6350, 15.1160], // Gooty Fort
      [77.8120, 15.0080],
      [78.0150, 14.9080], // Tadipatri
      [78.1360, 14.9870], // Kondapuram
      [78.3390, 14.6710], // Muddanuru
      [78.5360, 14.6360], // Yerraguntla Jn
      [78.5520, 14.7330], // Proddatur
      [78.4060, 14.8460], // Jammalamadugu
      [78.3240, 15.2340], // Koilakuntla
      [78.2280, 15.3180], // Banaganapalle
      [78.4840, 15.4800], // Nandyal Jn
      [78.9280, 15.3780], // Giddalur
      [79.2800, 15.7350], // Markapur Road
      [79.7460, 16.0540], // Vinukonda
      [80.0500, 16.2360], // Narasaraopet
      [80.4365, 16.2980], // Guntur Jn
      [80.6200, 16.5186], // Vijayawada Jn
      [80.9930, 16.4350], // Gudivada Jn
      [81.0470, 16.3530], // Gudlavalleru
      [81.1440, 16.2620], // Pedana
      [81.1370, 16.1880], // Machilipatnam
    ],
  },
  {
    id: 'southern-trunk-mas-tvc',
    name: 'Southern Mainline (Chennai – Coimbatore – Kerala)',
    shortName: 'Chennai–Kerala Mainline',
    code: 'MAS-TVC',
    zone: 'Southern Railway (SR)',
    distanceKm: 920,
    gauge: 'Broad Gauge (1676 mm)',
    electrification: '25 kV AC 50 Hz',
    color: '#0284c7',
    origin: 'Chennai Central (MAS)',
    destination: 'Thiruvananthapuram Central (TVC)',
    majorJunctions: ['MAS', 'AJJ', 'KPD', 'JTJ', 'SA', 'ED', 'TUP', 'CBE', 'PGT', 'TCR', 'AWY', 'ERN', 'KTYM', 'KYJ', 'QLN', 'TVC'],
    source: 'https://data.humdata.org/dataset/hotosm_ind_railways',
    coordinates: [
      [80.2750, 13.0827], // Chennai Central
      [79.6700, 13.0800], // Arakkonam
      [79.1300, 12.9700], // Katpadi Jn (Vellore)
      [78.5800, 12.5700], // Jolarpettai Jn
      [78.1500, 11.6600], // Salem Jn
      [77.7200, 11.3400], // Erode Jn
      [77.3400, 11.1000], // Tiruppur
      [76.9600, 11.0000], // Coimbatore Jn
      [76.6500, 10.7800], // Palakkad Jn
      [76.2100, 10.5200], // Thrissur
      [76.3500, 10.1100], // Aluva
      [76.2900, 9.9800],  // Ernakulam Town / South (Kochi)
      [76.5300, 9.5800],  // Kottayam
      [76.6000, 9.1700],  // Kayamkulam
      [76.5900, 8.8900],  // Kollam Jn
      [76.9500, 8.4800],  // Thiruvananthapuram Central
    ],
  },
  {
    id: 'northern-delhi-amritsar',
    name: 'Northern Trunk (Delhi – Amritsar)',
    shortName: 'Delhi–Amritsar',
    code: 'NDLS-ASR',
    zone: 'Northern Railway (NR)',
    distanceKm: 448,
    gauge: 'Broad Gauge (1676 mm)',
    electrification: '25 kV AC 50 Hz',
    color: '#4f46e5',
    origin: 'New Delhi (NDLS)',
    destination: 'Amritsar Jn (ASR)',
    majorJunctions: ['NDLS', 'SNP', 'PNP', 'KUN', 'KKDE', 'UMB', 'RPJ', 'LDH', 'PGW', 'JUC', 'BEAS', 'ASR'],
    source: 'https://data.humdata.org/dataset/hotosm_ind_railways',
    coordinates: [
      [77.2197, 28.6430], // New Delhi
      [77.0100, 28.9800], // Sonipat
      [76.9600, 29.3900], // Panipat Jn
      [76.9800, 29.6800], // Karnal
      [76.8800, 29.9800], // Kurukshetra
      [76.8200, 30.3400], // Ambala Cantt
      [76.5800, 30.4500], // Rajpura
      [75.8500, 30.9000], // Ludhiana Jn
      [75.7600, 31.2200], // Phagwara
      [75.5800, 31.3200], // Jalandhar City
      [75.3100, 31.5100], // Beas
      [74.8700, 31.6300], // Amritsar Jn
    ],
  },
]

// 2. Official National Railway Junctions & Division Stations
export const nationalJunctions: RailwayJunction[] = [
  { code: 'NDLS', name: 'New Delhi', zone: 'NR', division: 'Delhi', state: 'Delhi', coordinates: [77.2197, 28.6430], platforms: 16, corridors: ['gq-delhi-howrah', 'gq-delhi-mumbai', 'grand-trunk-delhi-chennai', 'northern-delhi-amritsar'] },
  { code: 'HWH', name: 'Howrah Jn', zone: 'ER', division: 'Howrah', state: 'West Bengal', coordinates: [88.3500, 22.5800], platforms: 23, corridors: ['gq-delhi-howrah', 'gq-mumbai-howrah', 'gq-howrah-chennai'] },
  { code: 'MMCT', name: 'Mumbai Central', zone: 'WR', division: 'Mumbai WR', state: 'Maharashtra', coordinates: [72.8194, 18.9696], platforms: 9, corridors: ['gq-delhi-mumbai'] },
  { code: 'CSMT', name: 'Mumbai CSMT', zone: 'CR', division: 'Mumbai CR', state: 'Maharashtra', coordinates: [72.8358, 18.9400], platforms: 18, corridors: ['gq-mumbai-howrah', 'gq-mumbai-chennai'] },
  { code: 'MAS', name: 'Chennai Central', zone: 'SR', division: 'Chennai', state: 'Tamil Nadu', coordinates: [80.2750, 13.0827], platforms: 17, corridors: ['grand-trunk-delhi-chennai', 'gq-mumbai-chennai', 'gq-howrah-chennai', 'southern-trunk-mas-tvc'] },
  { code: 'BZA', name: 'Vijayawada Jn', zone: 'SCR', division: 'Vijayawada', state: 'Andhra Pradesh', coordinates: [80.6200, 16.5186], platforms: 10, corridors: ['grand-trunk-delhi-chennai', 'gq-howrah-chennai', 'rayalaseema-scr-dmm-mtm'] },
  { code: 'CNB', name: 'Kanpur Central', zone: 'NCR', division: 'Prayagraj', state: 'Uttar Pradesh', coordinates: [80.3500, 26.4500], platforms: 10, corridors: ['gq-delhi-howrah'] },
  { code: 'PRYJ', name: 'Prayagraj Jn', zone: 'NCR', division: 'Prayagraj', state: 'Uttar Pradesh', coordinates: [81.8300, 25.4400], platforms: 10, corridors: ['gq-delhi-howrah'] },
  { code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya Jn', zone: 'ECR', division: 'Pt. Deen Dayal Upadhyaya', state: 'Uttar Pradesh', coordinates: [83.1200, 25.2800], platforms: 8, corridors: ['gq-delhi-howrah'] },
  { code: 'BRC', name: 'Vadodara Jn', zone: 'WR', division: 'Vadodara', state: 'Gujarat', coordinates: [73.1800, 22.3100], platforms: 7, corridors: ['gq-delhi-mumbai'] },
  { code: 'KOTA', name: 'Kota Jn', zone: 'WCR', division: 'Kota', state: 'Rajasthan', coordinates: [75.8500, 25.1800], platforms: 6, corridors: ['gq-delhi-mumbai'] },
  { code: 'RTM', name: 'Ratlam Jn', zone: 'WR', division: 'Ratlam', state: 'Madhya Pradesh', coordinates: [75.0400, 23.3300], platforms: 7, corridors: ['gq-delhi-mumbai'] },
  { code: 'NGP', name: 'Nagpur Jn', zone: 'CR', division: 'Nagpur', state: 'Maharashtra', coordinates: [79.0882, 21.1458], platforms: 8, corridors: ['grand-trunk-delhi-chennai', 'gq-mumbai-howrah'] },
  { code: 'BPL', name: 'Bhopal Jn', zone: 'WCR', division: 'Bhopal', state: 'Madhya Pradesh', coordinates: [77.4000, 23.2500], platforms: 6, corridors: ['grand-trunk-delhi-chennai'] },
  { code: 'VGLJ', name: 'VGL Jhansi Jn', zone: 'NCR', division: 'Jhansi', state: 'Uttar Pradesh', coordinates: [78.5800, 25.4500], platforms: 8, corridors: ['grand-trunk-delhi-chennai'] },
  { code: 'PUNE', name: 'Pune Jn', zone: 'CR', division: 'Pune', state: 'Maharashtra', coordinates: [73.8567, 18.5204], platforms: 6, corridors: ['gq-mumbai-chennai'] },
  { code: 'SUR', name: 'Solapur', zone: 'CR', division: 'Solapur', state: 'Maharashtra', coordinates: [75.9100, 17.6700], platforms: 5, corridors: ['gq-mumbai-chennai'] },
  { code: 'GTL', name: 'Guntakal Jn', zone: 'SCR', division: 'Guntakal', state: 'Andhra Pradesh', coordinates: [77.3700, 15.1700], platforms: 7, corridors: ['gq-mumbai-chennai', 'rayalaseema-scr-dmm-mtm'] },
  { code: 'VSKP', name: 'Visakhapatnam Jn', zone: 'ECoR', division: 'Waltair', state: 'Andhra Pradesh', coordinates: [83.2200, 17.7200], platforms: 8, corridors: ['gq-howrah-chennai'] },
  { code: 'BBS', name: 'Bhubaneswar', zone: 'ECoR', division: 'Khurda Road', state: 'Odisha', coordinates: [85.8300, 20.2700], platforms: 6, corridors: ['gq-howrah-chennai'] },
  { code: 'KGP', name: 'Kharagpur Jn', zone: 'SER', division: 'Kharagpur', state: 'West Bengal', coordinates: [87.3200, 22.3400], platforms: 12, corridors: ['gq-mumbai-howrah', 'gq-howrah-chennai'] },
  { code: 'ROHA', name: 'Roha', zone: 'CR / KRCL', division: 'Mumbai CR', state: 'Maharashtra', coordinates: [73.1200, 18.4400], platforms: 3, corridors: ['konkan-railway'] },
  { code: 'RN', name: 'Ratnagiri', zone: 'KRCL', division: 'Ratnagiri', state: 'Maharashtra', coordinates: [73.3200, 16.9800], platforms: 3, corridors: ['konkan-railway'] },
  { code: 'MAO', name: 'Madgaon Jn', zone: 'KRCL / SWR', division: 'Karwar', state: 'Goa', coordinates: [73.9700, 15.2800], platforms: 4, corridors: ['konkan-railway'] },
  { code: 'MAJN', name: 'Mangaluru Jn', zone: 'SR', division: 'Palakkad', state: 'Karnataka', coordinates: [74.8600, 12.8700], platforms: 3, corridors: ['konkan-railway'] },
  { code: 'DMM', name: 'Dharmavaram Jn', zone: 'SCR', division: 'Guntakal', state: 'Andhra Pradesh', coordinates: [77.7152, 14.4261], platforms: 5, corridors: ['rayalaseema-scr-dmm-mtm'] },
  { code: 'GNT', name: 'Guntur Jn', zone: 'SCR', division: 'Guntur', state: 'Andhra Pradesh', coordinates: [80.4365, 16.2980], platforms: 7, corridors: ['rayalaseema-scr-dmm-mtm'] },
  { code: 'MTM', name: 'Machilipatnam', zone: 'SCR', division: 'Vijayawada', state: 'Andhra Pradesh', coordinates: [81.1370, 16.1880], platforms: 3, corridors: ['rayalaseema-scr-dmm-mtm'] },
  { code: 'CBE', name: 'Coimbatore Jn', zone: 'SR', division: 'Salem', state: 'Tamil Nadu', coordinates: [76.9600, 11.0000], platforms: 6, corridors: ['southern-trunk-mas-tvc'] },
  { code: 'ERS', name: 'Ernakulam Jn (South)', zone: 'SR', division: 'Thiruvananthapuram', state: 'Kerala', coordinates: [76.2900, 9.9800], platforms: 6, corridors: ['southern-trunk-mas-tvc'] },
  { code: 'TVC', name: 'Thiruvananthapuram Central', zone: 'SR', division: 'Thiruvananthapuram', state: 'Kerala', coordinates: [76.9500, 8.4800], platforms: 5, corridors: ['southern-trunk-mas-tvc'] },
  { code: 'UMB', name: 'Ambala Cantt Jn', zone: 'NR', division: 'Ambala', state: 'Haryana', coordinates: [76.8200, 30.3400], platforms: 8, corridors: ['northern-delhi-amritsar'] },
  { code: 'ASR', name: 'Amritsar Jn', zone: 'NR', division: 'Firozpur', state: 'Punjab', coordinates: [74.8700, 31.6300], platforms: 8, corridors: ['northern-delhi-amritsar'] },
]
