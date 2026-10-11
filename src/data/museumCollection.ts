export interface MuseumPhoto {
  title: string
  gallery: string
  image: string
  alt: string
  caption: string
  creator: string
  sourceUrl: string
  license: string
  licenseUrl: string
  technicalNote?: string
  technicalSourceUrl?: string
  technicalSourceLabel?: string
}

export interface MuseumFilm {
  title: string
  gallery: string
  video: string
  poster: string
  caption: string
  creator: string
  sourceUrl: string
  license: string
  licenseUrl: string
}

export const museumPhotos: readonly MuseumPhoto[] = [
  {
    title: 'B-777 · Darjeeling Himalayan Railway',
    gallery: 'Narrow gauge / 1889',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Steam_Locomotive_B-777.jpg',
    alt: 'Preserved B-777 narrow-gauge steam locomotive from the Darjeeling Himalayan Railway',
    caption: 'The Commons file record describes B-777 as a 2-foot-gauge DHR locomotive built in 1889 and preserved at the National Rail Museum.',
    creator: 'Parag2615',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Steam_Locomotive_B-777.jpg',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  {
    title: 'WAP-4 · locomotive 22820',
    gallery: 'Electric traction / Royapuram',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/WAP-4_Class_locomotive_of_Indian_Railways.jpg',
    alt: 'WAP-4 locomotive 22820 hauling a passenger service near Nagercoil',
    caption: 'The source record identifies locomotive 22820, Royapuram shed, on the Trivandrum–Nagercoil Passenger at Nagercoil Junction (photographed 2013).',
    creator: 'UY Scuti',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:WAP-4_Class_locomotive_of_Indian_Railways.jpg',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  {
    title: 'WAP-7 · 6,000 hp class',
    gallery: 'Electric traction / 2017 photograph',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/41/WAP-7-LOCO.jpg',
    alt: 'Indian Railways WAP-7 electric locomotive photographed at a station',
    caption: 'The file description identifies a WAP-7 AC coaching locomotive and lists its class-level performance figures; treat these as the photographer’s file notes.',
    creator: 'Praveen Kr Mishra',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:WAP-7-LOCO.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    technicalNote: 'RDSO haulage table: 123 t locomotive · 32.9 tf tractive effort at standstill · 11.8 tf at 140 km/h (listed table configuration).',
    technicalSourceUrl: 'https://rdso.indianrailways.gov.in/uploads/files/PUB0002%20Rev_0%20for%20Haulage%20Capacity%20of%20Electric%20Locomotives.pdf',
    technicalSourceLabel: 'RDSO WAP-7 haulage-capacity table',
  },
  {
    title: 'Vande Bharat · Secunderabad–Visakhapatnam',
    gallery: 'Distributed-power trainset / 2023',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Vande_Bharat_train.jpg',
    alt: 'Vande Bharat trainset at Secunderabad Junction',
    caption: 'Photographed at Secunderabad Junction; this is a trainset, not a conventional locomotive hauling unpowered coaches.',
    creator: 'Radhika41',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Vande_Bharat_train.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    technicalNote: 'RDSO V2.0 manual: 16-car formation · 50% motoring · 160 km/h maximum service speed.',
    technicalSourceUrl: 'https://rdso.indianrailways.gov.in/uploads/VBE_Trainset%28V2%29_Maintenance_Manual_Volume_II_Chapter1_Introduction_Draft%281%29.pdf',
    technicalSourceLabel: 'RDSO Vande Bharat trainset manual',
  },
]

export const museumFilms: readonly MuseumFilm[] = [
  {
    title: 'A Darjeeling Himalayan Railway passage',
    gallery: 'Mountain railway / 24 seconds',
    video: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Darjeeling_toy_train.webm',
    poster: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Darjeeling_toy_train.webm/960px--Darjeeling_toy_train.webm.jpg',
    caption: 'A 2024 clip of the Darjeeling Himalayan Train; the Commons file page records the creator and license.',
    creator: 'Gannu03',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Darjeeling_toy_train.webm',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    title: 'WAP-7 + WAG-5 double-heading',
    gallery: 'Freight traction / Dum Dum / 19 seconds',
    video: 'https://upload.wikimedia.org/wikipedia/commons/2/29/WAP-7_%26_WAG-5_pulling_an_Indian_freight_train_at_DDJ.webm',
    poster: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/WAP-7_%26_WAG-5_pulling_an_Indian_freight_train_at_DDJ.webm/960px--WAP-7_%26_WAG-5_pulling_an_Indian_freight_train_at_DDJ.webm.jpg',
    caption: 'Two locomotive classes appear together on a freight train at Dum Dum Junction; location and date come from the file record.',
    creator: 'Projjalm',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:WAP-7_%26_WAG-5_pulling_an_Indian_freight_train_at_DDJ.webm',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    title: 'WAG-9 hauling a special near Mulund',
    gallery: 'Heavy electric / 51 seconds',
    video: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Indian_Railways..webm',
    poster: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Indian_Railways..webm/500px--Indian_Railways..webm.jpg',
    caption: 'A WAG-9 hauling the LTT–Danapur Holiday Special, filmed near Mulund on 31 October 2025.',
    creator: 'Count of Dombivli',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Indian_Railways..webm',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
]
