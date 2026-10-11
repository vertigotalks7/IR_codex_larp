export interface HistoryEvent {
  year: number
  title: string
  detail: string
  source: string
  sourceLabel: string
}

export const historyEvents: HistoryEvent[] = [
  {
    year: 2002,
    title: 'Delhi Metro begins service',
    detail: 'The first Delhi Metro corridor opens to passengers, beginning the modern metro era represented in this atlas.',
    source: 'https://delhimetrorail.com/pages/about-us/present-network',
    sourceLabel: 'DMRC present network and opening dates',
  },
  {
    year: 2011,
    title: 'Namma Metro opens in Bengaluru',
    detail: 'Bengaluru joins the group of Indian cities operating a metro system.',
    source: 'https://www.alstom.com/press-releases-news/2011/10/bengaluru-s-metro-project-gets-inaugurated',
    sourceLabel: 'BMRCL project partner · inauguration notice',
  },
  {
    year: 2015,
    title: 'Chennai Metro begins passenger service',
    detail: 'The first Chennai Metro corridor opens; the later Phase II corridors remain a separate project from the operational lines.',
    source: 'https://wcag.chennaimetrorail.org/project-status/',
    sourceLabel: 'CMRL commercial operation dates',
  },
  {
    year: 2017,
    title: 'Kochi Metro begins service',
    detail: 'The Aluva–Petta corridor opens in stages, later extending the operating line to Tripunithura.',
    source: 'https://kochimetro.org/phase-1-status/',
    sourceLabel: 'Kochi Metro Phase I status',
  },
  {
    year: 2017,
    title: 'Hyderabad Metro opens its first corridor',
    detail: 'The first Miyapur–Nagole section is opened to the public on 29 November 2017.',
    source: 'https://hmrl.co.in/about-hmrl/',
    sourceLabel: 'HMRL commissioning timeline',
  },
  {
    year: 2022,
    title: 'Pune Metro enters service',
    detail: 'Pune adds two color-coded corridors to the growing set of Indian metro systems.',
    source: 'https://www.mahametro.org/pdf/newsletter/feb_mar_2022.pdf',
    sourceLabel: 'Maha Metro February–March 2022 newsletter',
  },
  {
    year: 2025,
    title: 'Delhi’s Phase-IV extensions begin opening',
    detail: 'DMRC records the first Phase-IV extension opening in January 2025; the network map continues to evolve by commissioned section.',
    source: 'https://delhimetrorail.com/pages/about-us/present-network',
    sourceLabel: 'DMRC present network',
  },
  {
    year: 2026,
    title: 'Delhi Metro opens two Phase-IV sections',
    detail: 'DMRC lists the Majlis Park–Maujpur-Babarpur Pink Line section and the Deepali Chowk–Majlis Park Magenta Line section as operational from 8 March 2026.',
    source: 'https://delhimetrorail.com/pages/about-us/present-network',
    sourceLabel: 'DMRC present network',
  },
  {
    year: 2026,
    title: 'Mumbai Metro adds Line 9 and Line 2B sections',
    detail: 'MMRDA lists the first operating sections of Line 9 and Line 2B in April 2026, followed by a further Line 2B section in August 2026.',
    source: 'https://mmrda.maharashtra.gov.in/en/node/1229',
    sourceLabel: 'MMRDA present status · updated 31 August 2026',
  },
]
