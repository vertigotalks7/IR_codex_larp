export interface DivisionMilestone {
  year?: number
  title: string
  detail: string
  sourceUrl: string
  sourceLabel: string
}

export interface DivisionDossier {
  id: string
  zoneCode: string
  division: string
  thesis: string
  location: string
  sourceNote: string
  milestones: readonly DivisionMilestone[]
  references: readonly { label: string; url: string }[]
}

const trichy = 'https://sr.indianrailways.gov.in/uploads/files/1393995711729-brief.pdf'
const chennai = 'https://sr.indianrailways.gov.in/cris/uploads/files/1623911170576-ABOUT%20RPF.pdf'
const madurai = 'https://sr.indianrailways.gov.in/cris/uploads/files/1590133021722-brief.pdf'
const tvm = 'https://censusindia.gov.in/nada/index.php/catalog/664/download/2304/DH_2011_3214_PART_A_DCHB_THIRUVANANTHAPURAM.pdf'
const howrah = 'https://er.indianrailways.gov.in/view_section.jsp?cssType=2&id=0%2C6%2C441%2C737&lang=0'
const centralHistory = 'https://cr.indianrailways.gov.in/view_section.jsp?backgroundColor=LIGHTSTEELBLUE&fontColor=black&id=0%2C6%2C287%2C384%2C534&lang=0'
const mumbaiWestern = 'https://wr.indianrailways.gov.in/cris/uploads/files/1612163616272-MMCT.pdf'
const palakkadMap = 'https://sr.indianrailways.gov.in/uploads/files/1401249916624-a-Divn-Map.pdf'
const nwrReport = 'https://nwr.indianrailways.gov.in/uploads/files/1721711150962-E-Book%20final%20GMNR%20on%20website%20Accounts.pdf'
const ratlam = 'https://wr.indianrailways.gov.in/cris/uploads/files/1392957315076-history.pdf'
const centralAtAGlance = 'https://cr.indianrailways.gov.in/view_section.jsp?backgroundColor=LIGHTSTEELBLUE&fontColor=black&id=0%2C6%2C287%2C384%2C534&lang=0'
const bhusavalProjects = 'https://cr.indianrailways.gov.in/uploads/files/1755859326954-PCDO%20%20JULY-2025.pdf'
const bhusavalPinkStation = 'https://cr.indianrailways.gov.in/view_detail.jsp?dcd=8624&did=169157419458833E8666369E7D115F8E9C53BEE348FF9&id=0%2C4%2C268&lang=0'
const kalkaShimla = 'https://nr.indianrailways.gov.in/KSR/1.pdf'
const vadodaraOverview = 'https://wr.indianrailways.gov.in/cris/uploads/files/1738319123704-Overview-ataglance.pdf'
const lumdingSilchar = 'https://www.pib.gov.in/newsite/printrelease.aspx?lang=2&reg=48&relid=117777'
const kotaKavach2024 = 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2055795&lang=2&reg=48'
const kotaKavach2025 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2150296&lang=1&reg=3'
const dduProfile = 'https://ecr.indianrailways.gov.in/uploads/files/1659612627325-DDU%20Website%20Information-1-4.pdf'
const sambalpurFreight = 'https://eastcoastrail.indianrailways.gov.in/uploads/files/1666780383667-Freight%20information%20-%20as%20on%2025.10.2022%20Optg.pdf'
const eastCoast2026 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2296692&lang=2&reg=48'
const asansolHeritage = 'https://swr.indianrailways.gov.in/uploads/files/1585726062318-Coffee%20Table%20Book%20UPDATED.pdf'
const serHistory = 'https://ser.indianrailways.gov.in/uploads/files/1427346652869-BNR%20history.pdf'
const dallirajhara2018 = 'https://www.pib.gov.in/newsite/erelcontent.aspx?lang=2&reg=48&relid=178696'
const rowghat2026 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2314060&lang=1&reg=6'
const kiulGaya2016 = 'https://www.pib.gov.in/newsite/PrintRelease.aspx?lang=2&reg=48&relid=138313'
const puriProfile = 'https://eastcoastrail.indianrailways.gov.in/uploads/files/1608640484474-PURI.pdf'
const rathYatra2025 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2138706&lang=2&reg=48'
const jabalpurElectric2018 = 'https://www.pib.gov.in/newsite/PrintRelease.aspx?lang=2&reg=48&relid=178211'
const prayagrajKavach2026 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2244076&lang=2&reg=48'
const prayagrajMap = 'https://ncr.indianrailways.gov.in/view_section.jsp?backgroundColor=LIGHTSTEELBLUE&fontColor=black&id=0%2C1%2C283%2C375%2C704%2C705&lang=0'
const izzatnagarHistory = 'https://ner.indianrailways.gov.in/uploads/files/1531745993019-From%20the%20pages%20of%20history.pdf'
const izzatnagarProfile = 'https://cag.gov.in/rly/gorakhpur/en/page-rly-gorakhpur-divisional-audit-office-izzatnagar'
const charlapalliTerminal2025 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2090539&lang=2&reg=48'
const scrStationIndex = 'https://scr.indianrailways.gov.in/cris/uploads/files/1372939938373-Station_index.pdf'
const guntakalElectrification2017 = 'https://scr.indianrailways.gov.in/view_detail.jsp?dcd=8943&id=0%2C5%2C268&lang=0'
const visakhapatnamRayagadaReorg2025 = 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2100853&lang=2&reg=48'
const southCoastOperational2026 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2288987&lang=2&reg=48'
const rayagadaDouble2026 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2283679&lang=2&reg=48'
const rayagadaTunnel2024 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2044842&lang=2&reg=48'
const centralNagpurProfile = centralHistory
const centralSolapurProfile = 'https://cr.indianrailways.gov.in/uploads/files/1618919766390-Introduction%20as%20on%2001.04.2021.pdf'
const centralSolapurHistory = 'https://cr.indianrailways.gov.in/uploads/files/1610103322055-Introduction%20English.pdf'
const maldaSystemMap = 'https://er.indianrailways.gov.in/uploads/files/1659516536392-MLDT.pdf'
const sealdahSystemMap = 'https://er.indianrailways.gov.in/uploads/files/1659516429876-SDAH.pdf'
const easternRailwayProfile = 'https://er.indianrailways.gov.in/cris/uploads/files/1367482070268-ER_Profile_02052013.pdf'
const sonpurBooklet = 'https://ecr.indianrailways.gov.in/uploads/files/1625729149564-GM%20booklet.pdf'
const samastipurHistory = 'https://ecr.indianrailways.gov.in/uploads/files/1588659064417-history.pdf'
const samastipurProfile = 'https://ecr.indianrailways.gov.in/uploads/files/1476341222199-SPJ%20ECR%20AT%20A%20GLANCE%2001.pdf'
const dhanbadProfile = 'https://ecr.indianrailways.gov.in/uploads/files/1375965759719-Organisation%20chart%20%26%20General%20Information.pdf'
const northernRailway2025Map = 'https://nr.indianrailways.gov.in/uploads/files/1750745196307-Table1_NR%20SYS%20MAP_2025.pdf'
const delhiSolarDemu = 'https://www.pib.gov.in/newsite/erelcontent.aspx?lang=2&reg=48&relid=167422'
const delhiOFC2026 = 'https://www.pib.gov.in/newsite/erelcontent.aspx?lang=2&reg=48&relid=287529'
const firozpurJammuNotice = 'https://mcf.indianrailways.gov.in/uploads/calling%20option%20of%20jammu%20division.pdf'
const jammuDivisionStart = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2090358&lang=2&reg=48'
const agraJhansiNCRMap = 'https://ncr.indianrailways.gov.in/uploads/files/1506076825321-System%20map%202017%20A4%20Final.pdf'
const agraJhansiOFC2026 = delhiOFC2026
const ncrFormationAnswer = 'https://eparlib.sansad.in/bitstream/123456789/759588/1/lsd_13_10_18-07-2002.pdf'
const jhansiYearbook = 'https://indianrailways.gov.in/railwayboard/uploads/directorate/stat_econ/2024/Year%20Book%202022-23%20English.pdf'
const jhansiRLDA = 'https://rlda.indianrailways.gov.in/uploads/Annual%20Report%20%282023-24%29.pdf'
const nerLucknowProfile = 'https://ner.indianrailways.gov.in/uploads/files/1751537935042-Division%20at%20a%20Glance.pdf'
const nerVaranasiMap = 'https://ner.indianrailways.gov.in/uploads/files/1614753174169-BSB%20Sytem%20Map%20COLOUR%20FINAL.pdf'
const railwayYearbook2022 = 'https://nfr.indianrailways.gov.in/railwayboard/uploads/directorate/stat_econ/2024/Year%20Book%202022-23%20English.pdf'
const nerIzzatBridgeTender = 'https://ner.indianrailways.gov.in/TenderDetails_cpp.jsp?T_ID=3772&id=0%2C3&lang=0'
const nfrCagPage = 'https://saiindia.gov.in/rly/guwahati/en/page-rly-guwahati-audit-jurisdiction'
const nfrAnnualOps = 'https://nfr.indianrailways.gov.in/uploads/files/1678962419294-eannual.pdf'
const nfrDivisionList = 'https://www.pib.gov.in/newsite/PrintRelease.aspx?lang=2&reg=48&relid=168812'
const alipurduarServices2026 = 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2215594&lang=1&reg=20'
const katiharDoubling2026 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2295056&lang=2&reg=48'
const rangiyaElectrification2025 = 'https://nfr.indianrailways.gov.in/view_detail.jsp?dcd=2742&id=0%2C4%2C268&lang=0'
const rangiyaDoublingTarget2022 = 'https://nfr.indianrailways.gov.in/view_detail.jsp?dcd=1918&did=1655470077528090875A090964B1811BFB34A36768832&id=0%2C4%2C268&lang=0'
const tinsukiaHistory = 'https://tinsukia.assam.gov.in/about-us/history'
const ajmerProfile = 'https://nwr.indianrailways.gov.in/uploads/files/1662721862907-about%20wo%20stn%20.pdf'
const ajmerWorks = 'https://nwr.indianrailways.gov.in/uploads/files/1684753189108-Achievments.pdf'
const bikanerProfile = 'https://nwr.indianrailways.gov.in/uploads/files/1414752131283-An%20Overview%20of%20Bikaner%20Division.pdf'
const jaipurEngineeringHistory = 'https://nwr.indianrailways.gov.in/uploads/files/1378444301965-Engineering%20Deptt.%20Details.pdf'
const salemUNESCO = 'https://whc.unesco.org/document/197296'
const salemMettupalayam2024 = 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2034437&lang=2&reg=48'
const salemDoublingApproval2026 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308264&lang=1&reg=48'
const hyderabadKavach2026 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2313758&lang=1&reg=3'
const charlapalliHyderabad2025 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2090554&lang=2&reg=48'
const nandedProfile = 'https://scr.indianrailways.gov.in/cris/uploads/files/1411707695321-1_about_us.pdf'
const nandedDoubling2025 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2201711&lang=2&reg=48'
const nandedTraction2026 = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2290300&lang=2&reg=48'
const gunturProfile = 'https://scr.indianrailways.gov.in/cris/uploads/files/1446709035601-Genearal%20data-01-11-15.pdf'
const scoRAnnouncement2019 = 'https://www.pib.gov.in/newsite/PrintRelease.aspx?lang=2&reg=48&relid=188998'
const vijayawadaHistoricalProfile = 'https://scr.indianrailways.gov.in/cris/uploads/files/1404655069010-Divn%20Historical%20background.pdf'
const vijayawadaDivisionProfile = 'https://scr.indianrailways.gov.in/cris/uploads/files/1404647822154-Division%20profile.pdf'
const adraProfile = 'https://ser.indianrailways.gov.in/cris/uploads/files/1693295557244-04.ADRA%20DIVISION%20AT%20A%20GLANCE-DRM%20handouts%2020.7.23.docx%20-%20Google%20Docs.pdf'
const serProfile = 'https://ser.indianrailways.gov.in/view_section.jsp?id=0%2C6%2C403%2C1391&lang=0'
const serAdraRedevelopment2023 = 'https://ser.indianrailways.gov.in/view_detail.jsp?dcd=7229&did=1694255824050782581D5D57F586D097B7297BA8CEA65&id=0%2C4%2C423&lang=0'
const serBaripadaRedevelopment2023 = 'https://ser.indianrailways.gov.in/view_detail.jsp?dcd=7245&id=0%2C4%2C423&lang=0'
const secrNagpurHistory = 'https://secr.indianrailways.gov.in/uploads/files/1312278598168-Tourist%20Places.pdf'
const swrHistory = 'https://swr.indianrailways.gov.in/uploads/files/1585570469676-History%20of%20Southern%20Mahratta%20Railways-Final.pdf'
const swrHubballiRecord = 'https://swr.indianrailways.gov.in/uploads/files/1680092838297-Stations_Redevelped_over_SWR.pdf'
const bengaluruPNM = 'https://swr.indianrailways.gov.in/uploads/files/1676891279742-61st%20PNM%20Minutes%20Final.pdf'
const mysuruLandslide2024 = 'https://swr.indianrailways.gov.in/view_detail.jsp?dcd=7716&did=17226082617782F3CA8C2368582BF82A572E9C34109DE&id=0%2C4%2C268&lang=0'
const rajkotCensus1961 = 'https://censusindia.gov.in/nada/index.php/catalog/28482/download/31664/21776_1961_RAJ.pdf'
const bhavnagarProfile = 'https://wr.indianrailways.gov.in/cris/uploads/files/1430199860555-About%20us.pdf'
const bhopalWcrMap = 'https://wcr.indianrailways.gov.in/uploads/files/1531908999660-WCR%20Map%202018.pdf'
const bhopalWcrAnnual = 'https://wcr.indianrailways.gov.in/uploads/files/1517996653819-GMAR%202015-16.pdf'

/**
 * Curated local dossiers use division-specific primary sources where found.
 * Other official divisions still appear in the roster and junction sample, but
 * are explicitly marked as awaiting a sourced local narrative rather than
 * receiving invented or copied history.
 */
export const railwayDivisionDossiers: readonly DivisionDossier[] = [
  {
    id: 'SR:Tiruchchirappalli', zoneCode: 'SR', division: 'Tiruchchirappalli',
    thesis: 'A delta railway with two colonial inheritances: the division’s own official history traces lines through both British and French railway systems.',
    location: 'Tiruchchirappalli · Cauvery delta · Tamil Nadu and Puducherry',
    sourceNote: 'The division brief is an older official snapshot; this exhibit uses its historical chronology and geography, not its dated station or traffic totals.',
    milestones: [
      { year: 1859, title: 'Nagappattinam–Erode line begins', detail: 'The division’s official history dates the first line in the South Indian Railway lineage to the Great Southern of India in May 1859; it was initially broad gauge and later converted to metre gauge.', sourceUrl: trichy, sourceLabel: 'Southern Railway · Tiruchchirappalli Division brief history' },
      { year: 1879, title: 'Puducherry joins the rail map', detail: 'The official account describes the Pondicherry Railway Company line as a connection between the port-town and the South Indian network, built under the supervision of the South Indian Railway.', sourceUrl: trichy, sourceLabel: 'Southern Railway · Tiruchchirappalli Division brief history' },
      { year: 1951, title: 'Southern Railway is formed', detail: 'Southern Railway was created on 14 April 1951 by amalgamating the South Indian Railway, Madras & Southern Mahratta Railway, and Mysore State Railway.', sourceUrl: trichy, sourceLabel: 'Southern Railway · Tiruchchirappalli Division brief history' },
      { year: 1956, title: 'Tiruchchirappalli Division is constituted', detail: 'The division’s profile gives 16 January 1956 as its formation date and describes its Tamil Nadu–Puducherry footprint.', sourceUrl: trichy, sourceLabel: 'Southern Railway · Tiruchchirappalli Division brief history' },
    ],
    references: [{ label: 'Division history and physical features', url: trichy }],
  },
  {
    id: 'SR:Chennai', zoneCode: 'SR', division: 'Chennai',
    thesis: 'A terminal-and-commuter division: the official profile ties its inter-state approaches to a layered urban railway of suburban EMUs and the elevated MRTS.',
    location: 'Chennai · northern Tamil Nadu · approaches into Andhra Pradesh',
    sourceNote: 'The linked divisional profile is not a live operating report. Its old route/station totals are deliberately not presented as current facts.',
    milestones: [
      { year: 1956, title: 'Chennai Division is formed', detail: 'The official division profile dates its formation to 31 August 1956.', sourceUrl: chennai, sourceLabel: 'Southern Railway · Chennai Division at a glance' },
      { year: 2007, title: 'MRTS reaches Velachery', detail: 'The same profile records the Chennai Beach–Velachery elevated MRTS section as functioning from 20 November 2007, placing a distinct urban-rail layer within the division’s railway geography.', sourceUrl: chennai, sourceLabel: 'Southern Railway · Chennai Division at a glance' },
    ],
    references: [{ label: 'Chennai Division map, jurisdiction, suburban sections and facilities', url: chennai }],
  },
  {
    id: 'SR:Madurai', zoneCode: 'SR', division: 'Madurai',
    thesis: 'A south-Tamil Nadu network shaped by pilgrimage and freight geography: port traffic, manufacturing clusters, agriculture, and long-distance passenger flows share the same railway landscape.',
    location: 'Madurai · southern Tamil Nadu · Tuticorin and the Palk Strait approaches',
    sourceNote: 'Industrial and geographic themes are taken from the Southern Railway division profile; historical passenger and freight totals are not treated as current.',
    milestones: [
      { year: 1956, title: 'Madurai Division is formed', detail: 'The Southern Railway profile dates the division’s formation to 16 May 1956.', sourceUrl: madurai, sourceLabel: 'Southern Railway · Madurai Division profile' },
      { year: 1956, title: 'A port-and-hinterland railway takes shape', detail: 'The official profile links the area’s railway role to Tuticorin port and industries, Sivakasi manufacturing, Theni agricultural produce, and Madurai’s commercial and cultural centre.', sourceUrl: madurai, sourceLabel: 'Southern Railway · Madurai Division profile' },
    ],
    references: [{ label: 'Madurai Division brief and geography', url: madurai }],
  },
  {
    id: 'SR:Thiruvananthapuram', zoneCode: 'SR', division: 'Thiruvananthapuram',
    thesis: 'A 1979 administrative splice of coastal sections: its origin story is about bringing Kerala’s central coast, capital region, and far-south approaches into one division.',
    location: 'Thiruvananthapuram · Kerala coast · Kanyakumari approach',
    sourceNote: 'The source is the 2011 Census district handbook. It is used for the formation narrative only, not present-day station counts or boundaries.',
    milestones: [
      { year: 1979, title: 'Thiruvananthapuram Division is formed', detail: 'The Census handbook says the division was formed on 2 October 1979 from the Shoranur–Cochin Harbour Terminus section of Olavakkot and the Ernakulam–Thiruvananthapuram–Kanyakumari section of Madurai.', sourceUrl: tvm, sourceLabel: 'Census of India · Thiruvananthapuram District Handbook, 2011' },
    ],
    references: [{ label: 'Census district handbook · division formation account', url: tvm }],
  },
  {
    id: 'SR:Palakkad', zoneCode: 'SR', division: 'Palakkad',
    thesis: 'A cross-Ghats junction story: the official divisional plan connects the Kerala coast and hinterland with the Palakkad–Coimbatore approach and the Nilambur spur.',
    location: 'Palakkad · Kerala–Karnataka coast · Palakkad Gap / Coimbatore approach',
    sourceNote: 'This is a geographic exhibit based on the official division plan, not a historical boundary polygon or a current service timetable.',
    milestones: [
      { title: 'Read the division as a set of line relationships', detail: 'The official plan labels Palakkad, Shoranur, Calicut, Mangalore, Nilambur Road, and the Coimbatore/Pollachi approaches, and distinguishes single/double line and electrification status in that map edition.', sourceUrl: palakkadMap, sourceLabel: 'Southern Railway · Palghat Division plan' },
    ],
    references: [{ label: 'Official division plan and salient features', url: palakkadMap }],
  },
  {
    id: 'CR:Mumbai', zoneCode: 'CR', division: 'Mumbai',
    thesis: 'The railway lineage begins at Boribunder, but the 1853 inaugural run is a precursor story—not a claim that today’s division boundaries or suburban timetable began unchanged.',
    location: 'Mumbai · Central Railway · Mumbai–Thane corridor',
    sourceNote: 'The Central Railway page documents the predecessor GIP Railway milestone; this is a lineage marker, not a modern division-formation date.',
    milestones: [
      { year: 1853, title: 'The first passenger train runs to Thane', detail: 'Central Railway’s official history says the Great Indian Peninsula Railway’s first subcontinental passenger service left Mumbai for Thane on 16 April 1853, covering 33 km.', sourceUrl: centralHistory, sourceLabel: 'Central Railway · system history' },
    ],
    references: [{ label: 'Central Railway system history', url: centralHistory }],
  },
  {
    id: 'ER:Howrah', zoneCode: 'ER', division: 'Howrah',
    thesis: 'Howrah is not merely a major terminal: the division’s official history places the first East Indian Railway commercial passenger run here, toward Hooghly.',
    location: 'Howrah · Kolkata metropolitan rail gateway · Hooghly river approach',
    sourceNote: 'The cited Eastern Railway page identifies Howrah as its oldest division and gives a dated inaugural-service milestone.',
    milestones: [
      { year: 1854, title: 'Howrah–Hooghly service opens', detail: 'Eastern Railway’s historical perspective dates the first commercial East Indian Railway train from Howrah to Hooghly to 15 August 1854 and identifies Howrah as the zone’s oldest division.', sourceUrl: howrah, sourceLabel: 'Eastern Railway · Howrah Division historical perspective' },
    ],
    references: [{ label: 'Howrah Division · historical perspective', url: howrah }],
  },
  {
    id: 'WR:Mumbai Central', zoneCode: 'WR', division: 'Mumbai Central',
    thesis: 'A coastal main line with a surprising narrow-gauge branch: the official division overview links Churchgate–Surat to the Tapti Valley section and Billimora–Waghai.',
    location: 'Mumbai Central · Maharashtra–Gujarat corridor · Billimora–Waghai',
    sourceNote: 'The cited Western Railway overview is an older profile. It supports these named line relationships, not current traffic totals or an exact current division boundary.',
    milestones: [
      { title: 'Main line, valley route, and narrow gauge', detail: 'The division overview names the Churchgate–Surat main line, Udhna–Jalgaon Tapti Valley section, and Billimora–Waghai narrow-gauge section as parts of the division’s geography.', sourceUrl: mumbaiWestern, sourceLabel: 'Western Railway · Mumbai Division overview' },
    ],
    references: [{ label: 'Mumbai Division overview', url: mumbaiWestern }],
  },
  {
    id: 'NWR:Jodhpur', zoneCode: 'NWR', division: 'Jodhpur',
    thesis: 'The division’s story starts before the modern zone: the North Western Railway report connects Jodhpur’s network to princely-state railways, border geography, and freight movement.',
    location: 'Jodhpur · western Rajasthan · Thar and international-border approaches',
    sourceNote: 'The annual narrative is a dated zone document. Use it for historical lineage; do not read its operational figures as current.',
    milestones: [
      { year: 1882, title: 'Jodhpur railway lineage begins', detail: 'The North Western Railway annual narrative describes the Jodhpur railway as established in 1882 and discusses the division’s border and freight role.', sourceUrl: nwrReport, sourceLabel: 'North Western Railway · GM annual narrative report' },
      { year: 2002, title: 'North Western Railway begins operation', detail: 'The report records the zone’s operational start on 1 October 2002 after earlier approvals and notification; Jodhpur became part of this later administrative grouping.', sourceUrl: nwrReport, sourceLabel: 'North Western Railway · GM annual narrative report' },
    ],
    references: [{ label: 'NWR annual narrative · Jodhpur and zone formation', url: nwrReport }],
  },
  {
    id: 'WR:Ratlam', zoneCode: 'WR', division: 'Ratlam',
    thesis: 'Ratlam’s archive follows the change from princely and metre-gauge systems into a modern Western Railway division; the official history foregrounds the Scindia–Neemuch Railway.',
    location: 'Ratlam · western Madhya Pradesh · Rajasthan and Gujarat approaches',
    sourceNote: 'This older official history is used to describe predecessor systems and gauge-era change, not present-day division totals.',
    milestones: [
      { title: 'Scindia–Neemuch Railway in the predecessor network', detail: 'Western Railway’s Ratlam history traces the division’s predecessor lines and the former metre-gauge network before and after Independence.', sourceUrl: ratlam, sourceLabel: 'Western Railway · History of Ratlam Division' },
    ],
    references: [{ label: 'History of Ratlam Division', url: ratlam }],
  },
  {
    id: 'CR:Pune', zoneCode: 'CR', division: 'Pune',
    thesis: 'Pune Division is a reorganization story as well as a city story: a western Deccan route group moved across zone lines to become part of Central Railway.',
    location: 'Pune · western Maharashtra · Pune–Miraj–Kolhapur section',
    sourceNote: 'The Central Railway profile is an undated portal page; this dossier uses its dated transfer event, not current route or station totals.',
    milestones: [
      { year: 2003, title: 'Pune–Miraj–Kolhapur moves into Pune Division', detail: 'Central Railway’s profile says the section transferred from South Central Railway after 1 April 2003 and became part of Pune Division.', sourceUrl: centralAtAGlance, sourceLabel: 'Central Railway · system and division profile' },
    ],
    references: [{ label: 'Central Railway · Pune Division lineage', url: centralAtAGlance }],
  },
  {
    id: 'CR:Bhusaval', zoneCode: 'CR', division: 'Bhusaval',
    thesis: 'A route-capacity and workforce story: line multiplication and station operations show how engineering and institutional changes leave visible marks on a division.',
    location: 'Bhusaval · north Maharashtra · Tapti Valley and Vidarbha approaches',
    sourceNote: 'The 2019/2023 events are sourced notices; they are examples, not a complete division chronology.',
    milestones: [
      { year: 2019, title: 'Bhadli–Bhusawal third line reaches test stage', detail: 'Central Railway’s July 2025 progress report records the third line’s inspection and a 120 km/h speed test in February 2019.', sourceUrl: bhusavalProjects, sourceLabel: 'Central Railway · July 2025 project report' },
      { year: 2023, title: 'New Amravati becomes a women-managed station', detail: 'Central Railway described New Amravati as the first “Pink Station” in Bhusaval Division, fully managed by women staff.', sourceUrl: bhusavalPinkStation, sourceLabel: 'Central Railway · station announcement' },
    ],
    references: [{ label: 'Central Railway · third-line progress report', url: bhusavalProjects }, { label: 'Central Railway · New Amravati station announcement', url: bhusavalPinkStation }],
  },
  {
    id: 'NR:Ambala', zoneCode: 'NR', division: 'Ambala',
    thesis: 'A division where a technically demanding hill railway sits alongside plains operations: Kalka–Shimla makes the gradient, tunnels, and bridges part of the railway story.',
    location: 'Ambala · Chandigarh–Kalka · Shimla narrow-gauge terminus',
    sourceNote: 'The historic Kalka–Shimla note is undated; its stable opening/heritage dates are paired with Northern Railway’s 2024–25 statistical summary for the division geography.',
    milestones: [
      { year: 1903, title: 'Kalka–Shimla opens to public traffic', detail: 'Northern Railway’s heritage note dates the line’s opening to 9 November 1903 and records its tunnel-and-bridge engineering legacy.', sourceUrl: kalkaShimla, sourceLabel: 'Northern Railway · Kalka–Shimla heritage note' },
      { year: 2008, title: 'UNESCO recognizes the mountain railway', detail: 'Northern Railway records the Kalka–Shimla Railway’s World Heritage inscription on 10 July 2008.', sourceUrl: kalkaShimla, sourceLabel: 'Northern Railway · Kalka–Shimla heritage note' },
    ],
    references: [{ label: 'Northern Railway · Kalka–Shimla history', url: kalkaShimla }, { label: 'Northern Railway · 2024–25 system summary', url: 'https://nr.indianrailways.gov.in/uploads/files/1750745196307-Table1_NR%20SYS%20MAP_2025.pdf' }],
  },
  {
    id: 'WR:Vadodara', zoneCode: 'WR', division: 'Vadodara',
    thesis: 'The main-line trunk is only one layer: the division’s official overview preserves the memory of Gaekwad State Railway narrow-gauge branches and later gauge conversion.',
    location: 'Vadodara · Gujarat · Tapti-to-Geratpur trunk section',
    sourceNote: 'The 2025 overview is a snapshot; its geography is used as an index, while any service/station totals remain intentionally absent.',
    milestones: [
      { title: 'Trace the trunk and predecessor branches', detail: 'The Western Railway overview places the division on the Mumbai–New Delhi trunk and documents former Gaekwad Vadodara State Railway narrow-gauge branches that were later converted to broad gauge.', sourceUrl: vadodaraOverview, sourceLabel: 'Western Railway · Vadodara Division at a glance' },
    ],
    references: [{ label: 'Vadodara Division at a glance', url: vadodaraOverview }],
  },
  {
    id: 'NFR:Lumding', zoneCode: 'NFR', division: 'Lumding',
    thesis: 'The Assam–Barak Valley route is an engineering archive: gauge conversion had to negotiate long bridges, tunnels, and difficult terrain rather than simply replace rails.',
    location: 'Lumding · Assam · Barak Valley / Silchar approach',
    sourceNote: 'The project facts come from a 2015 Ministry release. They describe that gauge-conversion project, not current operating totals or the division’s full boundary.',
    milestones: [
      { year: 1996, title: 'Lumding–Silchar gauge-conversion project is sanctioned', detail: 'The Ministry release says the project was sanctioned in 1996–97 and designated a National Project in 2004.', sourceUrl: lumdingSilchar, sourceLabel: 'Ministry of Railways · Lumding–Silchar project update' },
      { year: 2015, title: 'A 210 km engineering corridor', detail: 'The Ministry described the project phase as 210 km, involving 79 major bridges, 340 minor bridges, and 21 tunnels totalling 12.86 km.', sourceUrl: lumdingSilchar, sourceLabel: 'Ministry of Railways · Lumding–Silchar project update' },
    ],
    references: [{ label: 'Ministry of Railways · Lumding–Silchar gauge conversion', url: lumdingSilchar }, { label: 'NFR · Lumding Division system map', url: 'https://nfr.indianrailways.gov.in/uploads/files/1617634078528-l.pdf' }],
  },
  {
    id: 'WCR:Kota', zoneCode: 'WCR', division: 'Kota',
    thesis: 'A modern signalling-and-safety chapter: Kavach commissioning turns the division’s place on a national trunk route into a technical milestone.',
    location: 'Kota · Rajasthan–Madhya Pradesh corridor · Delhi–Mumbai route',
    sourceNote: 'Both milestones are Ministry releases. Route-kilometres refer to the specific Kavach commissioning sections and are not division-wide track totals.',
    milestones: [
      { year: 2024, title: 'Kavach 4.0 commissioned on Kota–Sawai Madhopur', detail: 'The Ministry announced commissioning on the 108 km section on 16 September 2024.', sourceUrl: kotaKavach2024, sourceLabel: 'Ministry of Railways · Kavach 4.0 commissioning' },
      { year: 2025, title: 'Kavach extends across the Kota–Mathura route', detail: 'A Ministry release records Kavach commissioning on the 324 route-km Kota–Mathura section of the Delhi–Mumbai route on 30 July 2025.', sourceUrl: kotaKavach2025, sourceLabel: 'Ministry of Railways · Kota–Mathura Kavach commissioning' },
    ],
    references: [{ label: 'Ministry of Railways · Kota–Sawai Madhopur', url: kotaKavach2024 }, { label: 'Ministry of Railways · Kota–Mathura', url: kotaKavach2025 }],
  },
  {
    id: 'ECR:Pt. Deen Dayal Upadhyaya', zoneCode: 'ECR', division: 'Pt. Deen Dayal Upadhyaya',
    thesis: 'A high-density freight spine where extra tracks and bridge commissioning are the story: capacity is built in stages around the Son River and the DDU–Sone Nagar corridor.',
    location: 'Pt. Deen Dayal Upadhyaya Nagar · Uttar Pradesh–Bihar–Jharkhand freight approaches',
    sourceNote: 'The division profile is undated; its dated engineering milestones are cited individually. The system map is a 31 March 2025 snapshot.',
    milestones: [
      { year: 2014, title: 'Additional third line over the new Sone Rail Bridge', detail: 'The DDU division profile records the new Sone Rail Bridge third line as commissioned on 16 October 2014.', sourceUrl: dduProfile, sourceLabel: 'East Central Railway · DDU Division operating profile' },
      { year: 2019, title: 'The Sone Nagar–Gaya third-line section opens', detail: 'The same profile dates commissioning of the UP line to 24 January 2019; it describes the DDU–Sone Nagar freight section as a high-density corridor.', sourceUrl: dduProfile, sourceLabel: 'East Central Railway · DDU Division operating profile' },
    ],
    references: [{ label: 'DDU Division operating profile', url: dduProfile }, { label: 'ECR system map · 31 March 2025', url: 'https://ecr.indianrailways.gov.in/uploads/files/1753082360236-System%20Map%202025.pdf' }],
  },
  {
    id: 'ECoR:Sambalpur', zoneCode: 'ECoR', division: 'Sambalpur',
    thesis: 'A freight geography of minerals, metals, food, and cement: this division’s official profile makes interchange points and commodity flows central to its identity.',
    location: 'Sambalpur · western Odisha · east-coast and mineral-belt connections',
    sourceNote: 'The commodity list is a 25 October 2022 operating profile. A separate 2026 Ministry release is linked for current zone/division context; the old commodity list is not presented as current volume data.',
    milestones: [
      { year: 2022, title: 'Freight profile documents the regional exchange points', detail: 'The division profile lists interchange locations and outward commodities including food grain, aluminium powder, steel, coal, cement, and iron ore.', sourceUrl: sambalpurFreight, sourceLabel: 'East Coast Railway · Sambalpur freight profile, 25 Oct 2022' },
      { year: 2026, title: 'Sambalpur remains in the current ECoR roster', detail: 'The Ministry’s 2026 release names Sambalpur alongside Khurda Road and Rayagada as East Coast Railway’s operating divisions, avoiding reliance on older pre-reorganization rosters.', sourceUrl: eastCoast2026, sourceLabel: 'Ministry of Railways · East Coast Railway update, 2026' },
    ],
    references: [{ label: 'Sambalpur freight profile · 25 Oct 2022', url: sambalpurFreight }, { label: 'Ministry of Railways · 2026 ECoR update', url: eastCoast2026 }],
  },
  {
    id: 'ER:Asansol', zoneCode: 'ER', division: 'Asansol',
    thesis: 'Coal built the corridor and the corridor built the railway town: Raneegunge was the early terminus, while Asansol grew into an operating and heritage centre along the Damodar valley.',
    location: 'Asansol · Raniganj coalfield · Damodar Valley, West Bengal/Jharkhand approaches',
    sourceNote: 'The railway heritage booklet is an older retrospective. Its dates and predecessor-line story are used here; its station-area and operating figures are not presented as current.',
    milestones: [
      { year: 1855, title: 'The railway reaches the Raniganj coalfield', detail: 'The Eastern Railway heritage account dates the first Howrah–Raneegunge train to 3 February 1855, tying the experimental line to the coal-producing belt.', sourceUrl: asansolHeritage, sourceLabel: 'Eastern Railway · Asansol heritage booklet' },
      { year: 1885, title: 'Asansol station shifts to its present site', detail: 'The heritage account says the station moved to its present location in 1885 as rail traffic through the industrial area grew.', sourceUrl: asansolHeritage, sourceLabel: 'Eastern Railway · Asansol heritage booklet' },
      { year: 1889, title: 'A short link joins the coal and railway network', detail: 'The same account records a 7.43 km Asansol–Damodar connection in 1889, linked to coal transport and the Asansol–Adra section.', sourceUrl: asansolHeritage, sourceLabel: 'Eastern Railway · Asansol heritage booklet' },
    ],
    references: [{ label: 'Eastern Railway · Asansol heritage booklet', url: asansolHeritage }, { label: 'Eastern Railway · division directory', url: howrah }],
  },
  {
    id: 'SER:Chakradharpur', zoneCode: 'SER', division: 'Chakradharpur',
    thesis: 'A mineral-belt railway where the route history is also a traction history: the division’s ore-bearing approaches became an early proving ground for 25 kV AC electrification.',
    location: 'Chakradharpur · Rajkharswan–Dongoaposi · Jharkhand–Odisha mineral belt',
    sourceNote: 'The SER retrospective contains historic zone/division groupings that changed later. This exhibit uses only its dated construction and electrification entries, not its old division roster or traffic shares.',
    milestones: [
      { year: 1925, title: 'Rajkharswan–Padapahar reaches Dongoaposi', detail: 'The SER history lists construction of the Rajkharswan–Padapahar line via Dongoaposi in 1924–25, part of a network serving the iron-ore and steel region.', sourceUrl: serHistory, sourceLabel: 'South Eastern Railway · BNR/SER history' },
      { year: 1961, title: '25 kV AC electrification begins on the division', detail: 'SER identifies Rajkharswan–Dongoaposi in Chakradharpur Division as the section where its pioneering 25 kV electrification began in 1960–61.', sourceUrl: serHistory, sourceLabel: 'South Eastern Railway · BNR/SER history' },
    ],
    references: [{ label: 'South Eastern Railway · BNR/SER history', url: serHistory }],
  },
  {
    id: 'SECR:Raipur', zoneCode: 'SECR', division: 'Raipur',
    thesis: 'The Dalli Rajhara–Rowghat project is a railway built around a regional industrial promise: connect remote South Chhattisgarh, support passenger access, and move iron ore toward Bhilai.',
    location: 'Raipur Division · Dalli Rajhara–Bhanupratappur–Rowghat · South Chhattisgarh',
    sourceNote: 'The 2026 Ministry notice reports completion of track and CRS inspection/speed trial on the final section as progress toward commissioning. It explicitly does not say Taroki–Rowghat was yet open to train service.',
    milestones: [
      { year: 2018, title: 'An all-women crew inaugurates Dalli Rajhara–Bhanupratappur', detail: 'The Prime Minister’s Office account records the Dalli Rajhara–Bhanupratappur Express launch and notes its all-women operating crew.', sourceUrl: dallirajhara2018, sourceLabel: 'Prime Minister’s Office · Dalli Rajhara–Bhanupratappur launch' },
      { year: 2026, title: 'Taroki–Rowghat reaches CRS inspection and trial', detail: 'The Ministry reported that the final 17.5 km single-line electrified broad-gauge section had completed trackwork and undergone CRS inspection/speed trial on 22 September 2026. At the release date, passenger service was available only to Taroki; the new section remained on the way to commissioning.', sourceUrl: rowghat2026, sourceLabel: 'Ministry of Railways · Rowghat project update, 23 Sep 2026' },
    ],
    references: [{ label: 'Ministry of Railways · Taroki–Rowghat project update', url: rowghat2026 }, { label: 'Prime Minister’s Office · 2018 passenger launch', url: dallirajhara2018 }],
  },
  {
    id: 'ECR:Danapur', zoneCode: 'ECR', division: 'Danapur',
    thesis: 'The Kiul–Gaya line shows how one division’s story extends beyond its passenger corridors: a heavily used Bihar route was framed as both regional access and a coal-supply path to Barh Super Thermal Power Plant.',
    location: 'Danapur Division · Kiul–Lakhisarai–Sheikhpura–Nawada–Gaya · Bihar',
    sourceNote: 'The Ministry notice is a 2016 Cabinet approval and includes planning-era forecasts. It documents the proposal and divisional geography, not completion, current capacity, or current traffic.',
    milestones: [
      { year: 2016, title: 'Cabinet approves doubling of Kiul–Gaya', detail: 'The 124 km doubling proposal was approved to relieve a capacity-constrained section. The Ministry explicitly places Kiul–Gaya in Danapur Division and describes the route’s planned freight role for Barh power plant.', sourceUrl: kiulGaya2016, sourceLabel: 'Ministry of Railways · Kiul–Gaya doubling approval' },
    ],
    references: [{ label: 'Ministry of Railways · Kiul–Gaya approval and division', url: kiulGaya2016 }],
  },
  {
    id: 'ECoR:Khurda Road', zoneCode: 'ECoR', division: 'Khurda Road',
    thesis: 'Khurda Road’s identity is shaped by Puri as a pilgrimage terminal: the annual Rath Yatra turns railway capacity into a seasonal operation linking a coastal shrine with distant regions.',
    location: 'Khurda Road Division · Puri terminal · Odisha coast',
    sourceNote: 'The passenger-special count is a 2025 festival plan, not an annual standing service total. The station profile is an older snapshot and should not be used for current station statistics.',
    milestones: [
      { title: 'Puri terminal anchors the division’s pilgrimage geography', detail: 'The East Coast Railway station profile identifies Puri as a terminal station of Khurda Road Division.', sourceUrl: puriProfile, sourceLabel: 'East Coast Railway · Puri station profile' },
      { year: 2025, title: 'Rath Yatra prompts a 365-train special plan', detail: 'For the 2025 festival period, East Coast Railway announced 365 planned special trains to and from Puri, with Khurda Road among the named service points. This was a dated event plan, not a regular yearly frequency.', sourceUrl: rathYatra2025, sourceLabel: 'Ministry of Railways · Rath Yatra 2025 plan' },
    ],
    references: [{ label: 'East Coast Railway · Puri station profile', url: puriProfile }, { label: 'Ministry of Railways · Rath Yatra 2025 special trains', url: rathYatra2025 }],
  },
  {
    id: 'WCR:Jabalpur', zoneCode: 'WCR', division: 'Jabalpur',
    thesis: 'Electrification changed operations as well as the locomotive at the head of the train: the Itarsi–Jabalpur phase reduced diesel changeovers at Itarsi and enabled electric traction on this central Indian corridor.',
    location: 'Jabalpur Division · Itarsi–Jabalpur–Katni–Satna–Manikpur · Madhya Pradesh',
    sourceNote: 'This is a phase-specific 2018 milestone: it records the first Itarsi–Jabalpur electrification section and the announced first electric coaching services, not present-day completion status for every division route.',
    milestones: [
      { year: 2018, title: 'Electric coaching trains begin on Itarsi–Jabalpur', detail: 'The Ministry said the first phase covered 245 route-km of double line and that coaching trains would start electric traction on 30 March 2018 after safety authorization. It identifies the larger Itarsi–Jabalpur–Katni–Satna–Manikpur section as part of Jabalpur Division.', sourceUrl: jabalpurElectric2018, sourceLabel: 'Ministry of Railways · Itarsi–Jabalpur electrification' },
    ],
    references: [{ label: 'Ministry of Railways · Itarsi–Jabalpur electrification', url: jabalpurElectric2018 }],
  },
  {
    id: 'NCR:Prayagraj', zoneCode: 'NCR', division: 'Prayagraj',
    thesis: 'A high-density trunk railway where signalling safety and permitted speed are distinct engineering layers: Kavach is commissioned on a corridor that the Ministry says paves the way for 160 km/h operations.',
    location: 'Prayagraj–Kanpur · Delhi–Howrah high-density corridor · Uttar Pradesh',
    sourceNote: 'The Ministry says Kavach was commissioned on this section and that it paves the way for 160 km/h train operations; that is not a claim that every train is currently running at 160 km/h.',
    milestones: [
      { year: 2026, title: 'Kavach commissioned over 190 route-km', detail: 'On 22 March 2026, Indian Railways commissioned Kavach ATP on the Prayagraj–Kanpur section (Prayagraj and Kanpur excluded) of the Delhi–Howrah high-density corridor. The Ministry describes the safety system as enabling the pathway to 160 km/h operations.', sourceUrl: prayagrajKavach2026, sourceLabel: 'Ministry of Railways · Kavach on Prayagraj–Kanpur, 23 Mar 2026' },
    ],
    references: [{ label: 'Ministry Kavach commissioning update', url: prayagrajKavach2026 }, { label: 'North Central Railway · Prayagraj Division map', url: prayagrajMap }],
  },
  {
    id: 'NER:Izzatnagar', zoneCode: 'NER', division: 'Izzatnagar',
    thesis: 'The division’s geography crosses Rohilkhand into the Kumaon foothills: a predecessor railway reached Kathgodam in 1884, decades before the present division was constituted.',
    location: 'Izzatnagar / Bareilly · Bhojeepura–Kathgodam · Kumaon foothill approach',
    sourceNote: 'The 1884 event belongs to the Rohilkund and Kumaon Railway predecessor, not the present division. The CAG division profile is used for the current divisional identity and an older jurisdiction/map snapshot, not current operating totals.',
    milestones: [
      { year: 1884, title: 'Bhojeepura–Kathgodam predecessor line opens', detail: 'NER’s history dates the 53.92-mile Rohilkund and Kumaon Railway main line from Bhojeepura to Kathgodam to 12 October 1884; extensions later connected more of the Bareilly–Kumaon region.', sourceUrl: izzatnagarHistory, sourceLabel: 'North Eastern Railway · From the pages of history' },
      { year: 1952, title: 'Izzatnagar Division is formed', detail: 'The Government audit office’s Izzatnagar profile dates the division’s formation to 14 April 1952 and identifies it at Bareilly in the North Eastern Railway zone.', sourceUrl: izzatnagarProfile, sourceLabel: 'CAG · Divisional Audit Office, Izzatnagar profile' },
    ],
    references: [{ label: 'NER predecessor-line history', url: izzatnagarHistory }, { label: 'CAG Izzatnagar Division profile and map', url: izzatnagarProfile }],
  },
  {
    id: 'SCR:Secunderabad', zoneCode: 'SCR', division: 'Secunderabad',
    thesis: 'The Hyderabad rail gateway operates as a cluster of major terminals rather than one station: a new outer-city coaching terminal was designed to relieve pressure on the older Secunderabad, Hyderabad and Kacheguda terminals.',
    location: 'Secunderabad Division · Hyderabad terminal cluster · Medchal–Malkajgiri, Telangana',
    sourceNote: 'Charlapalli is a terminal/capacity milestone, not a formation date for Secunderabad Division. The SCR station index is an older station/administrative snapshot and is linked only to establish the division code.',
    milestones: [
      { year: 2025, title: 'Charlapalli opens as a new coaching terminal', detail: 'The Prime Minister’s Office records inauguration of Charlapalli New Terminal on 6 January 2025 and says it will ease congestion at Secunderabad, Hyderabad and Kacheguda. SCR’s station index identifies Charlapalli (CHZ) with the Secunderabad division code.', sourceUrl: charlapalliTerminal2025, sourceLabel: 'Prime Minister’s Office · Charlapalli terminal inauguration' },
    ],
    references: [{ label: 'PMO/PIB · Charlapalli terminal, 6 Jan 2025', url: charlapalliTerminal2025 }, { label: 'South Central Railway station index', url: scrStationIndex }],
  },
  {
    id: 'SCoR:Guntakal', zoneCode: 'SCoR', division: 'Guntakal',
    thesis: 'Guntakal’s south-central junction geography became an electrification story: one programme linked Rayalaseema toward Raichur and Wadi while also advancing the Guntur–Nandyal route.',
    location: 'Guntakal–Raichur–Wadi · Karnataka / Andhra Pradesh rail gateway',
    sourceNote: 'The 2017 release covers two separate SCR electrification projects before South Coast Railway became fully operational in 2026. It distinguishes 301 route-km from 517 track-km; these figures are not interchangeable.',
    milestones: [
      { year: 2017, title: 'CRS authorizes electric traction on Guntakal approaches', detail: 'SCR reported authorization for electrical traction across two routes totalling 301 route-km and 517 track-km. The release specifies 136 route-km for Guntakal–Chiksugur and describes the section as an important link toward Mumbai and North India from southern cities.', sourceUrl: guntakalElectrification2017, sourceLabel: 'South Central Railway · electrification/CRS release, 17 May 2017' },
      { year: 2026, title: 'South Coast Railway becomes fully operational', detail: 'The Ministry states the South Coast Railway zone came into full operational effect on 1 June 2026. The current roster places Guntakal Division within this zone.', sourceUrl: southCoastOperational2026, sourceLabel: 'Ministry of Railways · South Coast Railway operational status, 24 Jul 2026' },
    ],
    references: [{ label: 'SCR Guntakal electrification and CRS authorization', url: guntakalElectrification2017 }, { label: 'Ministry confirmation of South Coast Railway’s 2026 operational start', url: southCoastOperational2026 }, { label: 'Railway Board current directory', url: 'https://dir.railnet.gov.in/' }],
  },
  {
    id: 'SCoR:Visakhapatnam', zoneCode: 'SCoR', division: 'Visakhapatnam',
    thesis: 'The port-side railway is a carefully split successor to the former Waltair Division: trunk and coastal sections stayed with the new South Coast Railway, while the Koraput-side sections became a separate Rayagada division under East Coast Railway.',
    location: 'Visakhapatnam · Palasa–Duvvada coast and Kuneru–Vizianagaram approaches · Andhra Pradesh',
    sourceNote: 'The 2025 Cabinet figure of about 410 km describes the retained Waltair sections at reorganization, not a current route-kilometre total. South Coast Railway became fully operational on 1 June 2026; no exact division formation date is inferred.',
    milestones: [
      { year: 2025, title: 'Waltair is split into two successor divisions', detail: 'The Cabinet retained about 410 km of coastal and adjoining sections under the new South Coast Railway and renamed the retained division Visakhapatnam; about 680 km of the other sections were assigned to a new Rayagada Division under East Coast Railway.', sourceUrl: visakhapatnamRayagadaReorg2025, sourceLabel: 'Cabinet/PIB · Visakhapatnam–Rayagada divisional reorganization, 7 Feb 2025' },
      { year: 2026, title: 'The new zone takes full operational effect', detail: 'The Ministry confirms South Coast Railway became fully operational from 1 June 2026, grounding the division’s current administrative context without treating the 2025 decision as a train-opening date.', sourceUrl: southCoastOperational2026, sourceLabel: 'Ministry of Railways · South Coast Railway operational status, 24 Jul 2026' },
    ],
    references: [{ label: 'Cabinet divisional reorganization', url: visakhapatnamRayagadaReorg2025 }, { label: 'Ministry confirmation of South Coast Railway’s operational start', url: southCoastOperational2026 }],
  },
  {
    id: 'ECoR:Rayagada', zoneCode: 'ECoR', division: 'Rayagada',
    thesis: 'Rayagada’s interior corridor story is one of capacity and engineering: track, bridges, signaling and electrification must be commissioned together as the Koraput–Singapur Road line is doubled.',
    location: 'Rayagada Division · Baiguda–Kakiriguma · Koraput–Singapur Road corridor, Odisha',
    sourceNote: 'The Ministry reported this 12.385 km second line commissioned after CRS inspection in July 2026. The cited Cabinet split assigns around 680 km of former Waltair sections to Rayagada; neither number should be mistaken for an up-to-date total division route length.',
    milestones: [
      { year: 2024, title: 'Ballastless track is planned for a 600 m tunnel', detail: 'During construction, East Coast Railway said a 600 m tunnel between Baiguda and Kakiriguma on the Koraput–Singapur Road doubling project was nearing completion with a ballastless Rheda 2000 block system. This is a dated construction-stage report, not a claim that all division tunnels use this trackform.', sourceUrl: rayagadaTunnel2024, sourceLabel: 'Ministry of Railways · ballastless tunnel construction, 13 Aug 2024' },
      { year: 2025, title: 'Rayagada receives the eastern successor sections', detail: 'The Cabinet assigned about 680 km of former Waltair sections—including Kottavalasa–Bacheli and Koraput-side routes—to a new Rayagada Division under East Coast Railway.', sourceUrl: visakhapatnamRayagadaReorg2025, sourceLabel: 'Cabinet/PIB · divisional reorganization, 7 Feb 2025' },
      { year: 2026, title: 'Baiguda–Kakiriguma second line is commissioned', detail: 'After CRS inspection and speed trials on 9–10 July, the Ministry reported commissioning of the 12.385 km second line under the Koraput–Singapur Road doubling project in Rayagada Division.', sourceUrl: rayagadaDouble2026, sourceLabel: 'Ministry of Railways · Baiguda–Kakiriguma commissioning, 11 Jul 2026' },
    ],
    references: [{ label: 'Cabinet divisional reorganization', url: visakhapatnamRayagadaReorg2025 }, { label: 'Ministry ballastless-tunnel technical report', url: rayagadaTunnel2024 }, { label: 'Ministry commissioning report, 11 Jul 2026', url: rayagadaDouble2026 }],
  },
  {
    id: 'CR:Nagpur', zoneCode: 'CR', division: 'Nagpur',
    thesis: 'A mineral-and-container hinge between the Pench/Chanda coalfields, Ballarshah iron-ore flows and the Borkhedi–Khapri container terminals.',
    location: 'Nagpur–Wardha–Ballarshah axis · Vidarbha, Maharashtra',
    sourceNote: 'The cited Central Railway operational profile is a dated divisional snapshot; the station-redevelopment programme records selection/foundation, not completed works. No division formation year is inferred.',
    milestones: [
      { year: 2018, title: 'Two divisional stations receive a national beautification award', detail: 'The Ministry named Balharshah and Chandrapur, both in Nagpur Division, among the first railway stations to receive its beautification award.', sourceUrl: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1531352&lang=2&reg=48', sourceLabel: 'Ministry of Railways · station beautification award, 4 May 2018' },
      { year: 2023, title: 'Five Vidarbha stations enter redevelopment programme', detail: 'Katol, Narkhed, Godhani, Nagpur and Ajni were included in the announced Amrit Bharat station redevelopment programme. This is programme selection, not proof that construction was completed.', sourceUrl: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1946154&lang=2&reg=48', sourceLabel: 'Ministry of Railways · Amrit Bharat station programme, 6 Aug 2023' },
    ],
    references: [{ label: 'Central Railway · Nagpur Division operations and freight profile', url: centralNagpurProfile }, { label: 'PIB · 2023 station redevelopment programme', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1946154&lang=2&reg=48' }],
  },
  {
    id: 'CR:Solapur', zoneCode: 'CR', division: 'Solapur',
    thesis: 'A long cross-Deccan corridor division whose story is written in gauge conversion and staged doubling, not simply by the Mumbai–Chennai trunk passing through it.',
    location: 'Manmad–Daund–Wadi trunk · Kurduwadi branches toward Latur Road and Miraj · Maharashtra/Karnataka',
    sourceNote: 'The route-kilometre figure is explicitly a 1 Apr 2021 profile snapshot. Gauge-conversion and doubling dates are taken from Central Railway’s divisional project chronology.',
    milestones: [
      { year: 2011, title: 'Latur–Miraj broad gauge opens to all traffic', detail: 'The divisional introduction records the gauge-converted Latur–Miraj section opening first for goods traffic on 17 July 2010 and then for all traffic on 21 February 2011.', sourceUrl: centralSolapurHistory, sourceLabel: 'Central Railway · Solapur divisional introduction and project chronology' },
      { year: 2018, title: 'Doubling advances in three separate stages', detail: 'The completion table records Tilati–Hotgi doubling in 2015, Mohol–Vakav in 2017 and Akalkot–Nagansur in 2018; these are section-level completions, not a claim that every route in the division is doubled.', sourceUrl: centralSolapurHistory, sourceLabel: 'Central Railway · Solapur divisional introduction and project chronology' },
      { year: 2023, title: 'Fifteen stations are identified for Amrit Bharat scheme', detail: 'The Ministry’s list identifies 15 stations in Solapur Division for the scheme; identification does not mean redevelopment was delivered.', sourceUrl: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1945922&lang=2&reg=48', sourceLabel: 'Ministry of Railways · Amrit Bharat station list, 6 Aug 2023' },
    ],
    references: [{ label: 'Central Railway · Solapur Division profile as of 1 Apr 2021', url: centralSolapurProfile }, { label: 'Central Railway · divisional project chronology', url: centralSolapurHistory }],
  },
  {
    id: 'ER:Malda', zoneCode: 'ER', division: 'Malda',
    thesis: 'A three-state northern Bengal division where the Ganga-side junctions connect West Bengal, Jharkhand and Bihar; the map’s route and electrification totals are frozen at a dated snapshot.',
    location: 'Malda Town–New Farakka–Sahibganj approaches · West Bengal, Jharkhand and Bihar',
    sourceNote: 'The official system map is corrected to 31 Mar 2022. The 2026 signalling item is an approval, not commissioning. The division profile dates formation to 1984.',
    milestones: [
      { year: 1984, title: 'Malda Division is formed', detail: 'Eastern Railway’s official profile identifies 1984 as the year Malda Division was formed.', sourceUrl: easternRailwayProfile, sourceLabel: 'Eastern Railway · official profile and divisional history' },
      { year: 2023, title: 'Division-specific safety-training applications launch', detail: 'The Ministry reported launch of “Sachet ALP” and “Margdarshak” applications for loco pilots and guards in Malda Division.', sourceUrl: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1978767&lang=2&reg=48', sourceLabel: 'Ministry of Railways · safety-training apps, 21 Nov 2023' },
      { year: 2026, title: 'Signalling replacement is approved at 18 stations', detail: 'Railway approved ₹274 crore for signalling replacement at 18 stations and two intermediate block signal locations. This approval is not a report that electronic interlocking is already commissioned.', sourceUrl: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2280414&lang=1&reg=3', sourceLabel: 'Ministry of Railways · signalling approval, 2 Jul 2026' },
    ],
    references: [{ label: 'Eastern Railway · Malda Division system map (31 Mar 2022)', url: maldaSystemMap }, { label: 'Eastern Railway · formation profile', url: easternRailwayProfile }],
  },
  {
    id: 'ER:Sealdah', zoneCode: 'ER', division: 'Sealdah',
    thesis: 'A metropolitan suburban railway with a border-facing eastern reach: the division’s history is best read through old port-side branches and the changing passenger systems around Kolkata.',
    location: 'Sealdah–Bangaon/Gede · Diamond Harbour and Namkhana branches · Kolkata and south Bengal',
    sourceNote: 'The 1890 Ballygunge–Budge Budge line is predecessor-line history, not Sealdah Division’s formation date. Route-kilometres on the map are as of 31 Mar 2022.',
    milestones: [
      { year: 1890, title: 'Ballygunge–Budge Budge opens in the predecessor network', detail: 'The Ministry’s railway heritage note dates the Eastern Bengal Railway broad-gauge line to 1890; it predates the current division and is included as a local railway lineage marker.', sourceUrl: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1957831&lang=2&reg=48', sourceLabel: 'Ministry of Railways · Eastern Bengal Railway heritage note' },
      { year: 2023, title: 'Integrated Passenger Information System is implemented', detail: 'Sealdah Division reported successful implementation of its Integrated Passenger Information System, a station-information layer over the suburban network.', sourceUrl: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1982776&lang=2&reg=48', sourceLabel: 'Ministry of Railways · Sealdah passenger information system, 5 Dec 2023' },
      { year: 2024, title: 'Matribhumi Local adds first-class coaches', detail: 'First-class coaches were introduced on the Ranaghat–Sealdah Matribhumi Local service. This is a rolling-stock/service change, not a new line opening.', sourceUrl: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2000231&lang=2&reg=48', sourceLabel: 'Ministry of Railways · Matribhumi Local update, 28 Jan 2024' },
    ],
    references: [{ label: 'Eastern Railway · Sealdah Division system map (31 Mar 2022)', url: sealdahSystemMap }, { label: 'Ministry · 1890 predecessor-line account', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1957831&lang=2&reg=48' }],
  },
  {
    id: 'ECR:Sonpur', zoneCode: 'ECR', division: 'Sonpur',
    thesis: 'A north-bank Ganga and Gandak division where the CPR–Katihar chord carries goods while the Hajipur–Muzaffarpur axis is more coaching-oriented.',
    location: 'Sonpur–Hajipur–Muzaffarpur · Ganga/Gandak crossings · north Bihar',
    sourceNote: 'The 1978 and 2005 milestones come from an official Sonpur divisional booklet. The 2023 station list records scheme selection, not completed rebuilding.',
    milestones: [
      { year: 1978, title: 'Sonpur Division is established', detail: 'The official division booklet dates Sonpur’s establishment within North Eastern Railway to 21 October 1978.', sourceUrl: sonpurBooklet, sourceLabel: 'East Central Railway · Sonpur Division booklet' },
      { year: 2005, title: 'Garhara Yard and Simaria move into Sonpur', detail: 'From 1 January 2005, Garhara Yard and Dinkar Gram Simaria were merged into Sonpur Division from Danapur Division, an administrative boundary change rather than a line opening.', sourceUrl: sonpurBooklet, sourceLabel: 'East Central Railway · Sonpur Division booklet' },
      { year: 2023, title: 'Eighteen stations are selected for redevelopment scheme', detail: 'The Ministry’s station list includes 18 Sonpur-division stations under Amrit Bharat; this is selection status, not proof of completion.', sourceUrl: 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1897980&lang=2&reg=48', sourceLabel: 'Ministry of Railways · station scheme list, 10 Feb 2023' },
    ],
    references: [{ label: 'East Central Railway · Sonpur Division booklet', url: sonpurBooklet }, { label: 'Ministry · Amrit Bharat station list', url: 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1897980&lang=2&reg=48' }],
  },
  {
    id: 'ECR:Samastipur', zoneCode: 'ECR', division: 'Samastipur',
    thesis: 'A north-Bihar and Nepal-railhead division whose present administrative identity sits on an older famine-relief railway that later became a permanent route.',
    location: 'Samastipur–Darbhanga · Jaynagar/Raxaul/Laukaha Bazar approaches · North Bihar',
    sourceNote: 'The 1875–76 milestones describe predecessor-line history, while 1969 is the cited division formation year. The Nepal-link construction note is not treated as passenger-service commissioning.',
    milestones: [
      { year: 1875, title: 'A famine-relief railway reaches Samastipur', detail: 'The divisional history says the Dalsinghsarai–Darbhanga line via Samastipur opened temporarily on 1 November 1875 under the Tirhut Railway.', sourceUrl: samastipurHistory, sourceLabel: 'East Central Railway · Samastipur Division history' },
      { year: 1876, title: 'The temporary line becomes permanent', detail: 'The same historical account records the famine line becoming permanent in 1876; this is railway-line history, not the division’s creation.', sourceUrl: samastipurHistory, sourceLabel: 'East Central Railway · Samastipur Division history' },
      { year: 1969, title: 'Samastipur Division comes into existence', detail: 'The divisional profile gives 1969 as the division’s formation year and documents its North Bihar footprint.', sourceUrl: samastipurProfile, sourceLabel: 'East Central Railway · Samastipur at a glance' },
      { year: 2023, title: 'Twenty stations are listed for Amrit Bharat scheme', detail: 'Samastipur appears with 20 stations in the Ministry’s scheme list; listing is not construction completion.', sourceUrl: 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1897980&lang=2&reg=48', sourceLabel: 'Ministry of Railways · station scheme list, 10 Feb 2023' },
    ],
    references: [{ label: 'East Central Railway · Samastipur Division history', url: samastipurHistory }, { label: 'East Central Railway · divisional profile', url: samastipurProfile }],
  },
  {
    id: 'ECR:Dhanbad', zoneCode: 'ECR', division: 'Dhanbad',
    thesis: 'A coal-basin division whose story combines a 1960s creation, a 2002 zone transfer, and the operational demands of heavy mineral and long-distance freight.',
    location: 'Dhanbad–Gomoh–Koderma · Barkakana and Singrauli approaches · Jharkhand and adjoining states',
    sourceNote: 'The East Central Railway profile gives the division’s formation and transfer years. Audit and passenger-connectivity events are not presented as coal-output totals or line commissioning.',
    milestones: [
      { year: 1964, title: 'Dhanbad Division is formed under Eastern Railway', detail: 'Eastern Railway’s official profile dates the formation of Dhanbad Division to 1964.', sourceUrl: easternRailwayProfile, sourceLabel: 'Eastern Railway · official profile and divisional history' },
      { year: 2002, title: 'Dhanbad transfers to East Central Railway', detail: 'The official profile records the transfer from Eastern Railway when East Central Railway became operational on 1 October 2002.', sourceUrl: easternRailwayProfile, sourceLabel: 'Eastern Railway · official profile and divisional history' },
      { year: 2021, title: 'Hazaribagh Town becomes the 6,000th Wi-Fi station', detail: 'Railways reported commissioning public Wi-Fi at Hazaribagh Town in Dhanbad Division as the network’s 6,000th Wi-Fi station.', sourceUrl: 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1719048&lang=2&reg=48', sourceLabel: 'Ministry of Railways · station Wi-Fi, 15 May 2021' },
    ],
    references: [{ label: 'East Central Railway · Dhanbad organization and profile', url: dhanbadProfile }, { label: 'Eastern Railway · division formation and transfer history', url: easternRailwayProfile }],
  },
  {
    id: 'NR:Delhi', zoneCode: 'NR', division: 'Delhi',
    thesis: 'A high-volume capital division balancing major termini, passenger concentration, suburban services and freight; its modern story includes an early solar DEMU deployment.',
    location: 'Delhi–New Delhi–Hazrat Nizamuddin–Anand Vihar · National Capital Region',
    sourceNote: 'Traffic/station totals are FY 2024–25 snapshots. The 2026 OFC item is a project approval, not a completed communications deployment.',
    milestones: [
      { year: 2017, title: 'Solar-powered DEMU enters Delhi suburban service', detail: 'The Ministry reports that the first solar-powered DEMU rake was commissioned at Shakurbasti and introduced into Delhi Division suburban commercial service on 14 July 2017.', sourceUrl: delhiSolarDemu, sourceLabel: 'Ministry of Railways · solar DEMU service, 14 Jul 2017' },
      { year: 2022, title: 'Delhi Division is chosen for an e-auction pilot', detail: 'The Ministry included Delhi Division in its commercial/non-fare e-auction pilot; this is a commercial-administration milestone, not track infrastructure.', sourceUrl: 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1819050&lang=2&reg=48', sourceLabel: 'Ministry of Railways · commercial pilot, 22 Apr 2022' },
      { year: 2026, title: 'OFC network is approved across 1,204 route-km', detail: 'The Ministry approved a 2×48-fibre cable and optical-fibre communications project across 1,204 route-km. Approval does not establish that the full project is complete.', sourceUrl: delhiOFC2026, sourceLabel: 'Ministry of Railways · OFC project approval, 6 Apr 2026' },
    ],
    references: [{ label: 'Northern Railway · FY 2024–25 division statistics', url: northernRailway2025Map }, { label: 'Ministry · Delhi solar DEMU launch', url: delhiSolarDemu }],
  },
  {
    id: 'NR:Lucknow', zoneCode: 'NR', division: 'Lucknow',
    thesis: 'A large passenger division with routes radiating toward Ayodhya, Varanasi and the Nepal-facing foothills; today’s territory should not be conflated with the older East Indian Railway administrative lineage.',
    location: 'Lucknow–Ayodhya–Akbarpur and Lucknow–Pratapgarh–Varanasi corridors · Uttar Pradesh',
    sourceNote: 'The 1925 reference is an early EIR administrative lineage, not proof that the modern Northern Railway division had identical boundaries. FY statistics are dated snapshots; 2026 OFC is approved, not completed.',
    milestones: [
      { year: 1925, title: 'Lucknow appears among EIR’s initial upper divisions', detail: 'Eastern Railway’s historical account says EIR was organized into divisions on 1 January 1925 and names Lucknow among the upper divisions; it is not used as an exact formation date for the present NR division.', sourceUrl: howrah, sourceLabel: 'Eastern Railway · historical account of EIR division organization' },
      { year: 1952, title: 'Lucknow’s EIR lineage is incorporated into Northern Railway', detail: 'The parliamentary committee record lists Lucknow Division of East Indian Railway among the units amalgamated into Northern Railway on 14 April 1952.', sourceUrl: 'https://eparlib.sansad.in/bitstream/123456789/56623/1/railways_11_05_1996.pdf', sourceLabel: 'Parliamentary committee record · Northern Railway formation' },
      { year: 2026, title: 'OFC is approved across 1,074 route-km', detail: 'A 2×48-fibre communication cable project was approved for 1,074 route-km in Lucknow Division; this is sanctioned scope, not evidence of completion.', sourceUrl: delhiOFC2026, sourceLabel: 'Ministry of Railways · OFC project approval, 6 Apr 2026' },
    ],
    references: [{ label: 'Northern Railway · FY 2024–25 division statistics', url: northernRailway2025Map }, { label: 'Eastern Railway · EIR division-history account', url: howrah }],
  },
  {
    id: 'NR:Moradabad', zoneCode: 'NR', division: 'Moradabad',
    thesis: 'A north-western Uttar Pradesh division whose plains routes meet the steep-gradient approach toward Dehradun, making its railway identity unusually broad in both geography and operating conditions.',
    location: 'Moradabad–Bareilly–Haridwar–Dehradun · Laksar–Dehradun gradient corridor',
    sourceNote: 'Traffic and station figures are FY 2024–25 snapshots. The cited 1925/1952 events describe lineage and incorporation; they do not define today’s boundary.',
    milestones: [
      { year: 1925, title: 'Moradabad is named among EIR’s upper divisions', detail: 'The official historical account names Moradabad among EIR’s initial divisions from 1 January 1925, a predecessor-administration marker rather than a present-boundary date.', sourceUrl: howrah, sourceLabel: 'Eastern Railway · historical account of EIR division organization' },
      { year: 1952, title: 'The division’s predecessor unit joins Northern Railway', detail: 'Parliament’s historical committee lists the EIR Moradabad division among the systems integrated into Northern Railway on 14 April 1952.', sourceUrl: 'https://eparlib.sansad.in/bitstream/123456789/56623/1/railways_11_05_1996.pdf', sourceLabel: 'Parliamentary committee record · Northern Railway formation' },
      { year: 2025, title: 'Steep-gradient profile marks the Dehradun approach', detail: 'Northern Railway’s FY 2024–25 system summary identifies 19 steep-gradient locations on the Laksar–Dehradun section; it is a dated route characteristic, not a current speed or train-performance claim.', sourceUrl: northernRailway2025Map, sourceLabel: 'Northern Railway · FY 2024–25 system map/statistics' },
    ],
    references: [{ label: 'Northern Railway · FY 2024–25 division statistics and gradient profile', url: northernRailway2025Map }, { label: 'Eastern Railway · EIR division-history account', url: howrah }],
  },
  {
    id: 'NR:Ferozpur', zoneCode: 'NR', division: 'Ferozpur',
    thesis: 'A border-region division whose recent history is a major boundary reduction: the creation of Jammu Division transferred a defined share of the old Firozpur territory.',
    location: 'Firozpur–Amritsar–Ludhiana approaches · Punjab, Jammu region and adjoining north India',
    sourceNote: 'The government announcement and Railway Board notice describe a 2025 administrative reorganization, not a train opening. FY 2024–25 statistics predate the later route-km transfer; current station totals should not be extrapolated from them.',
    milestones: [
      { year: 2025, title: 'Jammu Division is carved out of Firozpur', detail: 'The Ministry says the new Jammu Division was created by dividing Firozpur Division. Railway Board’s reproduced notice makes it effective 1 June 2025 and records transfer of 742 route-km.', sourceUrl: jammuDivisionStart, sourceLabel: 'Ministry of Railways · Jammu Division inauguration, 6 Jan 2025' },
      { year: 2025, title: 'A dated operating snapshot precedes the boundary change', detail: 'Northern Railway’s FY 2024–25 system table reports 6.37 crore originating passengers, 10.31 million tonnes of originating loading and 157 stations for Firozpur Division. These figures predate the later formal transfer and are not current post-split totals.', sourceUrl: northernRailway2025Map, sourceLabel: 'Northern Railway · FY 2024–25 system map/statistics' },
    ],
    references: [{ label: 'Ministry · Jammu Division creation from Firozpur', url: jammuDivisionStart }, { label: 'Northern Railway · Railway Board effective-date/transfer notice', url: firozpurJammuNotice }, { label: 'Northern Railway · FY 2024–25 pre-transfer statistics', url: northernRailway2025Map }],
  },
  {
    id: 'NCR:Agra', zoneCode: 'NCR', division: 'Agra',
    thesis: 'A purpose-created junction division at the NCR/WCR/NWR interface, where zone boundaries and the Delhi–Agra approach matter as much as the city’s terminal role.',
    location: 'Agra Cantt.–Agra Fort–Idgah–Bayana · NCR/WCR/NWR junction region',
    sourceNote: 'Parliament records Agra as a new division in the NCR reorganization; the 2017 map is an old jurisdiction snapshot. The 2026 OFC item is approved work only.',
    milestones: [
      { year: 2002, title: 'Agra is named a new division in the NCR notification', detail: 'The Lok Sabha answer records notification of North Central Railway including “Agra Division (New)” on 4 July 2002.', sourceUrl: ncrFormationAnswer, sourceLabel: 'Lok Sabha · North Central Railway notification' },
      { year: 2003, title: 'North Central Railway begins operations', detail: 'The parliamentary answer gives 1 April 2003 as the operationalization date for the new zone; it is not, by itself, a statement that all current Agra boundaries began that day.', sourceUrl: ncrFormationAnswer, sourceLabel: 'Lok Sabha · North Central Railway operationalization' },
      { year: 2026, title: 'OFC is approved across 471 route-km', detail: 'A 2×48-fibre optical-fibre cable project over 471 route-km was approved for Agra Division to support Kavach-related communications; it is not reported as commissioned.', sourceUrl: agraJhansiOFC2026, sourceLabel: 'Ministry of Railways · OFC project approval, 6 Apr 2026' },
    ],
    references: [{ label: 'North Central Railway · Agra/Jhansi map (2017)', url: agraJhansiNCRMap }, { label: 'Lok Sabha · NCR notification and start', url: ncrFormationAnswer }],
  },
  {
    id: 'NCR:Jhansi', zoneCode: 'NCR', division: 'Jhansi',
    thesis: 'A central Indian interchange division whose engineering history is legible in the Bhimsen–Jhansi capacity works and in the connections between Bundelkhand and legacy Central Railway routes.',
    location: 'Jhansi–Bhimsen · Bina/Gwalior approaches · Bundelkhand and central India',
    sourceNote: 'The 2017 North Central Railway map is a jurisdiction reference, not a current boundary dataset. The Bhimsen–Jhansi works are listed as commissioned in the 2022–23 Year Book; the 2026 OFC project is only approved.',
    milestones: [
      { year: 2023, title: 'Bhimsen–Jhansi works are fully commissioned', detail: 'The Railway Year Book records full commissioning of the 206-km Bhimsen–Jhansi project, including electrification, in FY 2022–23.', sourceUrl: jhansiYearbook, sourceLabel: 'Indian Railways · Year Book 2022–23' },
      { year: 2023, title: 'Jhansi multi-functional complex opens in part', detail: 'RLDA’s annual report records partial commissioning of the Jhansi multi-functional complex on 30 May 2023; this is not stated as the entire development being complete.', sourceUrl: jhansiRLDA, sourceLabel: 'Rail Land Development Authority · Annual Report 2023–24' },
      { year: 2026, title: 'OFC is approved across 709 route-km', detail: 'A 2×48-fibre optical-fibre cable project over 709 route-km was approved in Jhansi Division to support Kavach; no commissioning claim is made.', sourceUrl: agraJhansiOFC2026, sourceLabel: 'Ministry of Railways · OFC project approval, 6 Apr 2026' },
    ],
    references: [{ label: 'North Central Railway · Agra/Jhansi system map (2017)', url: agraJhansiNCRMap }, { label: 'Indian Railways · Year Book 2022–23', url: jhansiYearbook }, { label: 'Ministry · OFC project approval', url: agraJhansiOFC2026 }],
  },
  {
    id: 'NER:Lucknow', zoneCode: 'NER', division: 'Lucknow',
    thesis: 'A passenger-oriented eastern Uttar Pradesh division with routes toward Gorakhpur, Bahraich, Sitapur and Lakhimpur; its profile gives a rare recent division-level baseline rather than guessed network totals.',
    location: 'Lucknow–Gorakhpur · Bahraich and Lakhimpur branches · Uttar Pradesh',
    sourceNote: 'Formation and station/traffic figures are from the FY 2024–25 NER division profile. Snapshot counts are not a current schedule or a historical route-growth series.',
    milestones: [
      { year: 1969, title: 'NER Lucknow Division is formed', detail: 'The official division profile dates its formation to 1 May 1969.', sourceUrl: nerLucknowProfile, sourceLabel: 'North Eastern Railway · Lucknow Division at a glance, FY 2024–25' },
      { year: 2025, title: 'A current profile records 158 stations across 14 districts', detail: 'The FY 2024–25 profile reports 107 crossing stations and 49 halts, with ₹1,969.87 crore income. These are period statistics, not a historical performance trend.', sourceUrl: nerLucknowProfile, sourceLabel: 'North Eastern Railway · Lucknow Division at a glance, FY 2024–25' },
    ],
    references: [{ label: 'North Eastern Railway · Lucknow Division at a glance (FY 2024–25)', url: nerLucknowProfile }],
  },
  {
    id: 'NER:Varanasi', zoneCode: 'NER', division: 'Varanasi',
    thesis: 'A river-crossing and border-approach division whose Varanasi hub fans toward Chhapra/Siwan, Ballia–Ghazipur, Mau–Azamgarh, Prayagraj and Nepal-facing routes.',
    location: 'Varanasi–Aunrihar–Mau · Ghazipur/Ballia and Chhapra approaches · eastern Uttar Pradesh',
    sourceNote: 'The system map is explicitly dated 1 Mar 2021. The Year Book records FY 2022–23 doubling openings; the map is used to establish their geographic relevance, not current jurisdiction totals. Division formation date remains unverified.',
    milestones: [
      { year: 2021, title: 'A dated map reveals the division’s multi-directional geography', detail: 'The official Varanasi Division system map shows corridors toward Chhapra/Siwan, Ballia–Ghazipur, Mau–Azamgarh, Prayagraj and the Nepal-border approaches.', sourceUrl: nerVaranasiMap, sourceLabel: 'North Eastern Railway · Varanasi Division map, 1 Mar 2021' },
      { year: 2023, title: 'Multiple eastern UP doubling sections are recorded as opened', detail: 'The Railway Year Book 2022–23 lists completed doubling sections including Bhatni–Aunrihar, Aunrihar–Jaunpur, Chhapra–Ballia, Varanasi–Allahabad, Ballia–Ghazipur and Mau–Shahganj. Their relevance to Varanasi is cross-read against the 2021 divisional map.', sourceUrl: railwayYearbook2022, sourceLabel: 'Indian Railways · Year Book 2022–23' },
      { year: 2014, title: 'Izzat Bridge engineering design enters procurement', detail: 'NER issued a tender for structural design of the Ganga bridge on the Daraganj–Jhusi block section; procurement is not evidence the bridge was completed or commissioned.', sourceUrl: nerIzzatBridgeTender, sourceLabel: 'North Eastern Railway · tender notice, 1 May 2014' },
    ],
    references: [{ label: 'North Eastern Railway · Varanasi Division system map (2021)', url: nerVaranasiMap }, { label: 'Indian Railways · Year Book 2022–23', url: railwayYearbook2022 }],
  },
  {
    id: 'NFR:Alipurduar', zoneCode: 'NFR', division: 'Alipurduar',
    thesis: 'A West Bengal gateway division spanning north-Bengal corridors and cross-border approaches, with an unusually broad set of routes radiating from the Dooars and Cooch Behar region.',
    location: 'Alipurduar–New Cooch Behar · Raninagar/Samuktala and Fakiragram/Dhubri approaches · North Bengal',
    sourceNote: 'The CAG and NFR annual sources describe headquarters and operating sections; the 2026 event is a passenger-service flag-off, not track commissioning. Exact division formation date is not inferred.',
    milestones: [
      { year: 2017, title: 'Alipurduar appears in the Ministry’s division directory', detail: 'The Ministry’s list of Indian Railways’ divisions identifies Alipurduar under Northeast Frontier Railway.', sourceUrl: nfrDivisionList, sourceLabel: 'Ministry of Railways · divisional directory, 21 Jul 2017' },
      { year: 2026, title: 'Two long-distance Amrit Bharat services are flagged off', detail: 'The Prime Minister flagged off Alipurduar–SMVT Bengaluru and Alipurduar–Panvel services. This records train service inauguration, not new line construction.', sourceUrl: alipurduarServices2026, sourceLabel: 'Ministry of Railways · service flag-off, 17 Jan 2026' },
    ],
    references: [{ label: 'CAG · NFR audit jurisdiction and divisional headquarters', url: nfrCagPage }, { label: 'NFR · annual operating-section table', url: nfrAnnualOps }, { label: 'Ministry · 2026 train-service flag-off', url: alipurduarServices2026 }],
  },
  {
    id: 'NFR:Katihar', zoneCode: 'NFR', division: 'Katihar',
    thesis: 'A Bihar–North Bengal corridor division where the Katihar–Kumedpur–New Jalpaiguri trunk meets Old Malda–Singhabad and Barsoi–Radhikapur routes.',
    location: 'Katihar–Kumedpur–New Jalpaiguri · Malda and Radhikapur branches · Bihar/West Bengal',
    sourceNote: 'The CAG/NFR operating tables support location and route context. The 2026 announcement distinguishes the commissioned sections from residual doubling still incomplete.',
    milestones: [
      { year: 2017, title: 'Katihar is listed as a Northeast Frontier Railway division', detail: 'The Ministry’s national division list identifies Katihar Division under NFR.', sourceUrl: nfrDivisionList, sourceLabel: 'Ministry of Railways · divisional directory, 21 Jul 2017' },
      { year: 2026, title: 'Two Katihar doubling sections are commissioned', detail: 'The Ministry reports commissioning of 11 km Katihar–Kuretha and 17 km Katihar–Sonaili sections; residual Katihar–Kumedpur/Mukuria works remained incomplete at the time of the release.', sourceUrl: katiharDoubling2026, sourceLabel: 'Ministry of Railways · NFR doubling progress, 5 Aug 2026' },
    ],
    references: [{ label: 'CAG · NFR divisional headquarters', url: nfrCagPage }, { label: 'NFR · annual operating-section table', url: nfrAnnualOps }, { label: 'Ministry · 2026 Katihar doubling status', url: katiharDoubling2026 }],
  },
  {
    id: 'NFR:Rangiya', zoneCode: 'NFR', division: 'Rangiya',
    thesis: 'A north-bank Assam division whose routes carry the railway toward Rangapara North and North Lakhimpur; electrification has recently connected this geography across the Brahmaputra-side network.',
    location: 'Rangiya–New Bongaigaon · Rangapara North/North Lakhimpur approach · Assam north bank',
    sourceNote: 'The 2022 doubling item is a target date only; the 2025 electric-traction release is later operating evidence. Neither supplies an exact division-formation date.',
    milestones: [
      { year: 2022, title: 'Doubling via Rangiya is assigned a target date', detail: 'NFR stated the 142.97-km New Bongaigaon–Agthori doubling via Rangiya was targeted for February 2023. The cited release is a target, not proof of completion.', sourceUrl: rangiyaDoublingTarget2022, sourceLabel: 'Northeast Frontier Railway · project target update, 17 Jun 2022' },
      { year: 2025, title: 'Electric traction reaches the north-bank routes', detail: 'NFR reported seamless electric traction to Dibrugarh/Naharlagun, including the Rangiya–Rangapara North–North Lakhimpur route.', sourceUrl: rangiyaElectrification2025, sourceLabel: 'Northeast Frontier Railway · electric-traction update, 17 Jul 2025' },
    ],
    references: [{ label: 'CAG · NFR divisional headquarters', url: nfrCagPage }, { label: 'NFR · north-bank electric-traction update', url: rangiyaElectrification2025 }],
  },
  {
    id: 'NFR:Tinsukia', zoneCode: 'NFR', division: 'Tinsukia',
    thesis: 'An Assam tea-region railway built on a much older frontier line: the Tinsukia area’s railway lineage predates the current NFR division by many decades.',
    location: 'Tinsukia–Dibrugarh · Furkating–New Tinsukia corridor · Upper Assam',
    sourceNote: 'The 1882 event is predecessor railway-line history, not the division’s formation. Electrification is reported complete on the cited routes; Furkating–New Tinsukia doubling was still ongoing in the 2026 snapshot.',
    milestones: [
      { year: 1882, title: 'Dibru–Sadiya Railway opens in Upper Assam', detail: 'Assam Government’s district history records the Dibru–Sadiya Railway opening to traffic in 1882; this is a regional line-history marker, not a present-day division formation date.', sourceUrl: tinsukiaHistory, sourceLabel: 'Government of Assam · Tinsukia district history' },
      { year: 2025, title: 'Electric traction is reported on all three Dibrugarh routes', detail: 'NFR reported electrification of all three routes to Dibrugarh, including the South Bank approach through Tinsukia.', sourceUrl: rangiyaElectrification2025, sourceLabel: 'Northeast Frontier Railway · electric-traction update, 17 Jul 2025' },
      { year: 2026, title: 'Furkating–New Tinsukia doubling remains ongoing', detail: 'The Ministry’s project-status release lists the 194-km Furkating–New Tinsukia doubling as ongoing; this is not a completed-line claim.', sourceUrl: katiharDoubling2026, sourceLabel: 'Ministry of Railways · NFR project status, 5 Aug 2026' },
    ],
    references: [{ label: 'Government of Assam · Tinsukia district history', url: tinsukiaHistory }, { label: 'NFR · Upper Assam electric-traction update', url: rangiyaElectrification2025 }, { label: 'Ministry · NFR doubling project status', url: katiharDoubling2026 }],
  },
  {
    id: 'NWR:Ajmer', zoneCode: 'NWR', division: 'Ajmer',
    thesis: 'A Rajasthan–Gujarat division whose railway identity spans metre-gauge inheritance, regional minerals/cement and continuing conversion/doubling work.',
    location: 'Ajmer–Mavli–Nathdwara · Madar–Pushkar · Abu Road and Gujarat approaches',
    sourceNote: 'The formation and section-completion dates are from official NWR divisional/construction profiles. They distinguish specific opened sections from network-wide gauge-conversion completion.',
    milestones: [
      { year: 1956, title: 'Ajmer Division begins primarily as a metre-gauge division', detail: 'The official NWR profile dates the division’s formation to 1956 and describes its original system as primarily metre gauge.', sourceUrl: ajmerProfile, sourceLabel: 'North Western Railway · Ajmer Division profile' },
      { year: 2012, title: 'Mavli–Nathdwara broad gauge and Madar–Pushkar open', detail: 'The divisional profile records Mavli–Nathdwara broad gauge as commissioned on 14 April 2011 and Madar–Pushkar new line on 25 May 2012.', sourceUrl: ajmerProfile, sourceLabel: 'North Western Railway · Ajmer Division profile' },
      { year: 2015, title: 'Keshavganj–Swarupganj doubling is commissioned', detail: 'NWR’s construction achievements record commissioning of 26.48 km of doubling on 16 April 2015.', sourceUrl: ajmerWorks, sourceLabel: 'North Western Railway · construction achievements' },
    ],
    references: [{ label: 'North Western Railway · Ajmer Division profile', url: ajmerProfile }, { label: 'North Western Railway · construction achievements', url: ajmerWorks }],
  },
  {
    id: 'NWR:Bikaner', zoneCode: 'NWR', division: 'Bikaner',
    thesis: 'A desert and border-region division whose railway history separates the first link to Bikaner, the princely-state railway, and the modern division formed later.',
    location: 'Bikaner–Churu–Lalgarh · western Rajasthan and adjoining Haryana/Punjab routes',
    sourceNote: 'The official NWR overview gives distinct dates for the predecessor railway, princely railway and division. Station works announced in 2023 are not described as completed.',
    milestones: [
      { year: 1891, title: 'The first railway link reaches Bikaner', detail: 'NWR’s divisional overview records the first railway link to Bikaner on 9 December 1891, preceding the present division.', sourceUrl: bikanerProfile, sourceLabel: 'North Western Railway · Bikaner Division overview' },
      { year: 1952, title: 'Bikaner Division is constituted', detail: 'The official overview separately dates the modern Bikaner Division’s formation to 1952.', sourceUrl: bikanerProfile, sourceLabel: 'North Western Railway · Bikaner Division overview' },
      { year: 2007, title: 'Kolayat–Phalodi broad-gauge link is established', detail: 'The division overview records the 112.09-km Kolayat–Phalodi broad-gauge link established on 18 June 2007.', sourceUrl: bikanerProfile, sourceLabel: 'North Western Railway · Bikaner Division overview' },
    ],
    references: [{ label: 'North Western Railway · Bikaner Division overview', url: bikanerProfile }, { label: 'PIB · Bikaner station redevelopment announcement (2023)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1938188&lang=2&noshow=1&reg=48' }],
  },
  {
    id: 'NWR:Jaipur', zoneCode: 'NWR', division: 'Jaipur',
    thesis: 'A passenger-heavy Rajasthan division built on nineteenth-century Rajputana–Malwa routes, later modernized by broad-gauge conversion and the 2002 formation of North Western Railway.',
    location: 'Jaipur–Bandikui–Dausa · Jaipur–Sawai Madhopur and Jaipur–Phulera corridors · Rajasthan',
    sourceNote: 'The opening dates refer to predecessor-line history; the 2002 event is NWR zone reorganization, not Jaipur Division’s original formation. The cited annual report is not treated as a current traffic dataset.',
    milestones: [
      { year: 1874, title: 'Rajputana–Malwa lines reach Jaipur in stages', detail: 'NWR engineering history dates the Bandikui–Dausa opening to 20 April 1874 and Dausa–Jaipur to 12 October 1874.', sourceUrl: jaipurEngineeringHistory, sourceLabel: 'North Western Railway · engineering history' },
      { year: 1993, title: 'Two broad-gauge conversions open to traffic', detail: 'The same engineering chronology records Jaipur–Sawai Madhopur opening on 30 January 1993 and Jaipur–Phulera on 8 December 1993.', sourceUrl: jaipurEngineeringHistory, sourceLabel: 'North Western Railway · engineering history' },
      { year: 2002, title: 'Jaipur joins the new North Western Railway zone', detail: 'NWR’s General Review identifies Jaipur as one of the four divisions when the zone came into effect on 1 October 2002; this is a zone-reorganization date, not the division’s first creation.', sourceUrl: nwrReport, sourceLabel: 'North Western Railway · General Review 2022–23' },
    ],
    references: [{ label: 'North Western Railway · Jaipur-area engineering chronology', url: jaipurEngineeringHistory }, { label: 'North Western Railway · General Review 2022–23', url: nwrReport }],
  },
  {
    id: 'SR:Salem', zoneCode: 'SR', division: 'Salem',
    thesis: 'A Tamil Nadu–Kerala interface division whose identity includes the Nilgiri Mountain Railway and its difficult hill approach, alongside new trunk capacity proposals.',
    location: 'Salem–Erode–Coimbatore · Mettupalayam and Nilgiri Mountain Railway · western Tamil Nadu',
    sourceNote: 'UNESCO’s World Heritage record identifies Salem Division’s day-to-day NMR administration. The 2026 doubling projects are Cabinet approvals with future completion targets, not commissioned routes.',
    milestones: [
      { year: 2022, title: 'Salem Division is identified as NMR day-to-day administrator', detail: 'The official UNESCO management record assigns day-to-day administration of the Nilgiri Mountain Railway to Salem Division of Southern Railway.', sourceUrl: salemUNESCO, sourceLabel: 'UNESCO · Nilgiri Mountain Railway management record' },
      { year: 2024, title: 'Tuticorin–Mettupalayam express is introduced', detail: 'The Ministry reports introduction of a biweekly Tuticorin–Mettupalayam express at Mettupalayam with Salem Division management present.', sourceUrl: salemMettupalayam2024, sourceLabel: 'Ministry of Railways · service introduction, 19 Jul 2024' },
      { year: 2026, title: 'Two Salem-area doubling corridors are approved', detail: 'Cabinet approved Salem–Karur–Dindigul (159 km) and Hosur–Omalur (147 km) doubling with completion planned by 2029–30. These are approvals, not completed track.', sourceUrl: salemDoublingApproval2026, sourceLabel: 'Cabinet/PIB · railway project approval, 9 Sep 2026' },
    ],
    references: [{ label: 'UNESCO · NMR management record', url: salemUNESCO }, { label: 'Ministry · 2026 doubling approval', url: salemDoublingApproval2026 }],
  },
  {
    id: 'SCR:Hyderabad', zoneCode: 'SCR', division: 'Hyderabad',
    thesis: 'A Telangana urban/intercity division operating around Hyderabad, Kacheguda and Secunderabad terminal interfaces, with contemporary safety technology extending beyond the metropolitan core.',
    location: 'Hyderabad–Kacheguda · Malkajgiri–Kamareddi corridor · Telangana',
    sourceNote: 'The 2025 terminal inauguration is a passenger-capacity measure, not a division formation milestone. The September 2026 release reports Kavach commissioning on a named route section.',
    milestones: [
      { year: 2025, title: 'Charlapalli terminal opens to relieve three city terminals', detail: 'The Ministry says the new coaching terminal was inaugurated to ease pressure on Secunderabad, Hyderabad and Kacheguda stations.', sourceUrl: charlapalliHyderabad2025, sourceLabel: 'Ministry of Railways · Charlapalli terminal, 6 Jan 2025' },
      { year: 2026, title: 'Kavach 4.0 is commissioned on Malkajgiri–Kamareddi', detail: 'The Ministry reports Kavach 4.0 commissioning over 108 route-km on Malkajgiri–Kamareddi and identifies it as the first such commissioning on South Central Railway.', sourceUrl: hyderabadKavach2026, sourceLabel: 'Ministry of Railways · Kavach commissioning, 23 Sep 2026' },
    ],
    references: [{ label: 'Ministry · Charlapalli terminal inauguration', url: charlapalliHyderabad2025 }, { label: 'Ministry · Kavach commissioning on SCR', url: hyderabadKavach2026 }],
  },
  {
    id: 'SCR:Nanded', zoneCode: 'SCR', division: 'Nanded',
    thesis: 'A coaching-heavy Marathwada division spanning Maharashtra and adjoining states, serving pilgrimage and heritage destinations while its rail infrastructure grows through staged doubling and traction upgrades.',
    location: 'Nanded–Mudkhed–Parbhani · Marathwada/Vidarbha and Telangana approaches',
    sourceNote: 'The divisional profile dates Nanded’s creation and original track scope. The 2025 doubling is listed as recently completed; the 2026 traction upgrade is sanctioned, not reported commissioned.',
    milestones: [
      { year: 2003, title: 'Nanded Division is formed from Hyderabad Division', detail: 'The official profile dates formation to 1 April 2003 and records 1,002 track-km at creation.', sourceUrl: nandedProfile, sourceLabel: 'South Central Railway · Nanded Division profile' },
      { year: 2025, title: 'Mudkhed–Parbhani doubling is listed among completed works', detail: 'The Ministry’s Maharashtra rail project status lists the 81-km Mudkhed–Parbhani doubling among recently completed projects as of 1 April 2025.', sourceUrl: nandedDoubling2025, sourceLabel: 'Ministry of Railways · Maharashtra project status, 1 Apr 2025' },
      { year: 2026, title: 'Parbhani–Mudkhed traction upgrade receives sanction', detail: '₹163 crore was sanctioned to upgrade 164 track-km from 1×25 kV to 2×25 kV traction. This is funding approval, not proof of construction or commissioning.', sourceUrl: nandedTraction2026, sourceLabel: 'Ministry of Railways · traction sanction, 28 Jul 2026' },
    ],
    references: [{ label: 'South Central Railway · Nanded Division profile', url: nandedProfile }, { label: 'Ministry · Mudkhed–Parbhani doubling status', url: nandedDoubling2025 }, { label: 'Ministry · Parbhani–Mudkhed traction sanction', url: nandedTraction2026 }],
  },
  {
    id: 'SCoR:Guntur', zoneCode: 'SCoR', division: 'Guntur',
    thesis: 'A junctional Andhra Pradesh division assembled from three predecessor territories; its railway history is an administrative construction as much as a set of routes radiating from Guntur.',
    location: 'Guntur–Nandyal · Vijayawada and Guntakal approaches · Andhra Pradesh',
    sourceNote: 'The official divisional evolution profile dates sanction and operationalization and provides the original source-section lengths. The 2019 SCoR notice is an announcement; it is not evidence of a same-day transfer.',
    milestones: [
      { year: 2003, title: 'Guntur Division is operationalized from three railways', detail: 'The divisional profile says formation was sanctioned in 1995–96 and operationalized on 1 April 2003 from 369.39 km of Vijayawada, 141.29 km of Guntakal and 107.88 km of Secunderabad jurisdiction.', sourceUrl: gunturProfile, sourceLabel: 'South Central Railway · Guntur Division evolution profile' },
      { year: 2019, title: 'Guntur is named in the proposed South Coast Railway', detail: 'The Government announced a proposed South Coast Railway comprising Guntakal, Guntur and Vijayawada divisions. This records the decision/announcement, not the date the reorganization became operational.', sourceUrl: scoRAnnouncement2019, sourceLabel: 'Ministry of Railways · proposed South Coast Railway, 27 Feb 2019' },
      { year: 2026, title: 'Guntur–Nambur road-over-bridge receives a foundation stone', detail: 'A 668-metre four-lane road-over-bridge was announced with construction expected to start shortly; this is a foundation/project milestone, not a completed bridge.', sourceUrl: 'https://www.pib.gov.in/newsite/erelcontent.aspx?lang=2&reg=48&relid=295321', sourceLabel: 'Ministry of Railways · Guntur–Nambur ROB, 25 Sep 2026' },
    ],
    references: [{ label: 'South Central Railway · Guntur Division evolution profile', url: gunturProfile }, { label: 'Ministry · 2019 South Coast Railway announcement', url: scoRAnnouncement2019 }],
  },
  {
    id: 'SCoR:Vijayawada', zoneCode: 'SCoR', division: 'Vijayawada',
    thesis: 'A Golden Quadrilateral junction where the Krishna and Godavari crossings, changing gauge, and shifts between three railway zones give the division an unusually layered history.',
    location: 'Vijayawada Junction · Krishna/Godavari bridges · coastal Andhra trunk corridors',
    sourceNote: 'The divisional history gives precise line, bridge and administrative dates. The 2019 SCoR item is an announcement; the 2026 zone-start source and current Railway Board directory describe later administrative status.',
    milestones: [
      { year: 1897, title: 'Broad-gauge Krishna bridge is built', detail: 'The division’s official landmark chronology dates the broad-gauge bridge construction over the Krishna to 15 July 1897; it also records an earlier metre-gauge bridge in 1893.', sourceUrl: vijayawadaHistoricalProfile, sourceLabel: 'South Central Railway · Vijayawada historical background' },
      { year: 1956, title: 'Vijayawada Division is created under Southern Railway', detail: 'The official divisional profile dates creation to 16 May 1956, when Bezwada/Vijayawada became one of Southern Railway’s divisions.', sourceUrl: vijayawadaDivisionProfile, sourceLabel: 'South Central Railway · Vijayawada Division profile' },
      { year: 1966, title: 'The division transfers to South Central Railway', detail: 'On 2 October 1966, Vijayawada Division became part of the newly formed South Central Railway.', sourceUrl: vijayawadaDivisionProfile, sourceLabel: 'South Central Railway · Vijayawada Division profile' },
      { year: 1994, title: 'The division completes its broad-gauge conversion', detail: 'The divisional history records conversion of the entire metre-gauge track to broad gauge on 12 February 1994.', sourceUrl: vijayawadaHistoricalProfile, sourceLabel: 'South Central Railway · Vijayawada historical background' },
    ],
    references: [{ label: 'SCR · Vijayawada historical background and landmarks', url: vijayawadaHistoricalProfile }, { label: 'SCR · Vijayawada Division profile', url: vijayawadaDivisionProfile }, { label: 'Ministry · South Coast Railway operational date', url: southCoastOperational2026 }],
  },
  {
    id: 'SER:Adra', zoneCode: 'SER', division: 'Adra',
    thesis: 'A coal, steel and cement logistics division whose sidings and industrial catchment are as characteristic as its passenger lines across western Bengal and Jharkhand.',
    location: 'Adra–Chandil · Bankura–Masagram · Purulia and adjoining Jharkhand corridors',
    sourceNote: 'The 2023 at-a-glance profile is a dated snapshot. The 1955 event is SER zone formation and establishes administrative lineage, not a separate exact Adra formation date beyond the profile’s 1905 origin.',
    milestones: [
      { year: 1905, title: 'Adra begins as a Bengal Nagpur Railway district', detail: 'The official Adra divisional profile traces its origin to a railway district under Bengal Nagpur Railway in 1905.', sourceUrl: adraProfile, sourceLabel: 'South Eastern Railway · Adra Division at a glance, 20 Jul 2023' },
      { year: 1955, title: 'Adra enters the newly constituted South Eastern Railway', detail: 'SER’s official history dates the zone’s constitution to 1 August 1955 and places Adra in that documented BNR lineage.', sourceUrl: serHistory, sourceLabel: 'South Eastern Railway · BNR/SER history' },
      { year: 2023, title: 'A divisional snapshot records 97 stations and industrial sidings', detail: 'The 20 July 2023 Adra profile records 97 stations and route sections including Adra–Midnapore, Adra–Chandil and Bankura–Masagram, alongside coal/steel/cement siding activity.', sourceUrl: adraProfile, sourceLabel: 'South Eastern Railway · Adra Division at a glance, 20 Jul 2023' },
    ],
    references: [{ label: 'SER · Adra Division at a glance (2023)', url: adraProfile }, { label: 'SER · Bengal Nagpur Railway history', url: serHistory }],
  },
  {
    id: 'SER:Kharagpur', zoneCode: 'SER', division: 'Kharagpur',
    thesis: 'A major east-coast trunk division whose railway identity is tied to the Howrah–Chennai corridor and the junctional spread of south-west Bengal.',
    location: 'Kharagpur–Midnapore · Howrah–Chennai trunk · south-west Bengal',
    sourceNote: 'The 1955 date describes the formation of SER and its listed divisions. 2023 station works are announcements/estimates, not completion claims.',
    milestones: [
      { year: 1955, title: 'Kharagpur is part of the new SER division structure', detail: 'The official SER history dates the zone’s constitution to 1 August 1955 and lists Kharagpur among its divisions.', sourceUrl: serHistory, sourceLabel: 'South Eastern Railway · BNR/SER history' },
      { year: 2023, title: 'Ghatsila station redevelopment is announced', detail: 'SER announced an estimated ₹31 crore Amrit Bharat redevelopment at Ghatsila; this records a plan, not completion.', sourceUrl: serAdraRedevelopment2023, sourceLabel: 'South Eastern Railway · Ghatsila station announcement, 9 Sep 2023' },
      { year: 2023, title: 'Baripada redevelopment is announced', detail: 'SER announced an estimated ₹17 crore redevelopment at Baripada. The release is not a completion report.', sourceUrl: serBaripadaRedevelopment2023, sourceLabel: 'South Eastern Railway · Baripada station announcement, 13 Sep 2023' },
    ],
    references: [{ label: 'SER · BNR and zone-formation history', url: serHistory }, { label: 'SER · Ghatsila station announcement', url: serAdraRedevelopment2023 }, { label: 'SER · Baripada station announcement', url: serBaripadaRedevelopment2023 }],
  },
  {
    id: 'SER:Ranchi', zoneCode: 'SER', division: 'Ranchi',
    thesis: 'An industrial Jharkhand division where the route network serves mines and plants across the plateau; the official history identifies its later split from Adra but does not state a formation date.',
    location: 'Ranchi–Hatia–Muri–Lohardaga · eight Jharkhand districts and Purulia, West Bengal',
    sourceNote: 'The SER history says Adra was subsequently split into Adra and Ranchi but supplies no date; no formation year is inferred. The 23 Jan 2024 profile is a dated operational snapshot, not a present-day count.',
    milestones: [
      { title: 'The division is created by a later split from Adra', detail: 'SER’s official BNR/SER history says Adra was subsequently split into Adra and Ranchi divisions, but does not identify when that reorganization occurred.', sourceUrl: serHistory, sourceLabel: 'South Eastern Railway · BNR/SER division-history account' },
      { year: 2024, title: 'A current-at-the-time profile maps plateau and industrial routes', detail: 'SER’s profile reviewed on 23 January 2024 records 55 stations, 485.31 route-km, full electrification and 47 pairs of Mail/Express trains; these are dated profile figures.', sourceUrl: serProfile, sourceLabel: 'South Eastern Railway · Ranchi Division profile, 23 Jan 2024' },
    ],
    references: [{ label: 'SER · division-evolution history', url: serHistory }, { label: 'SER · Ranchi Division profile (2024)', url: serProfile }],
  },
  {
    id: 'SECR:Nagpur', zoneCode: 'SECR', division: 'Nagpur',
    thesis: 'A three-state junction division connecting Vidarbha westward with Central Railway and eastward through Durg/Raipur, with a history predating the later SECR zone.',
    location: 'Nagpur–Durg–Ballarshah · Maharashtra, Madhya Pradesh and Chhattisgarh',
    sourceNote: 'The official SECR divisional history dates establishment to March 1963 and transfer to SECR in 2003. Zone creation and division creation are kept as separate events.',
    milestones: [
      { year: 1963, title: 'Nagpur Division is established', detail: 'The SECR divisional history dates establishment to March 1963, long before the present zone was created.', sourceUrl: secrNagpurHistory, sourceLabel: 'South East Central Railway · Nagpur history and geography' },
      { year: 2003, title: 'Nagpur Division becomes part of SECR', detail: 'The profile records the division’s transfer to South East Central Railway on 1 April 2003; CAG separately records the former SER trifurcation that created SECR.', sourceUrl: secrNagpurHistory, sourceLabel: 'South East Central Railway · Nagpur history and geography' },
    ],
    references: [{ label: 'SECR · Nagpur divisional history', url: secrNagpurHistory }, { label: 'CAG · SECR zone history', url: 'https://saiindia.gov.in/rly/bilaspur/en/page-rly-bilaspur-history' }],
  },
  {
    id: 'SWR:Bengaluru', zoneCode: 'SWR', division: 'Bengaluru',
    thesis: 'A city-and-hinterland division transferred into South Western Railway in 2003, with electrification and station renewal progressing in stages rather than as one single metro-like project.',
    location: 'Bengaluru–Mysuru approaches · Yeshwanthpur and Cantonment terminals · Karnataka',
    sourceNote: 'SWR’s 2003 account establishes the division’s transfer into the new zone. The 2022 minutes report partial electrification and station works at different stages; they are not a blanket completion claim.',
    milestones: [
      { year: 2003, title: 'Bengaluru transfers from Southern Railway to SWR', detail: 'The official South Western Railway history records Bengaluru and Mysuru moving from Southern Railway, and Hubballi from SCR, into SWR on 1 April 2003.', sourceUrl: swrHistory, sourceLabel: 'South Western Railway · zone and division history' },
      { year: 2022, title: 'Electrification and station renewal advance in phases', detail: 'Bengaluru Division’s 61st PNM minutes state that 93 of 132 targeted route-km had been completed and CRS-inspected subject to compliance. Yeshwanthpur work had started; Bengaluru Cantonment’s contract was awarded but work was expected to start. These statuses are not full commissioning/completion.', sourceUrl: bengaluruPNM, sourceLabel: 'South Western Railway · Bengaluru Division PNM minutes, 27–28 Dec 2022' },
    ],
    references: [{ label: 'SWR · division transfer at zone formation', url: swrHistory }, { label: 'SWR · Bengaluru Division PNM minutes (2022)', url: bengaluruPNM }],
  },
  {
    id: 'SWR:Hubballi', zoneCode: 'SWR', division: 'Hubballi',
    thesis: 'The zone’s headquarters division combines north Karnataka junction history with a modern station hub that has also become a major redevelopment project.',
    location: 'Hubballi–Dharwad · north Karnataka junction and divisional headquarters',
    sourceNote: 'The cited SWR document distinguishes the old Hubballi station’s opening from the 2003 organization of the present division and the 2023 station project completion.',
    milestones: [
      { year: 1887, title: 'The earlier Hubballi station opens', detail: 'SWR’s station-redevelopment record dates the old Hubballi station to 1886–87. This is station history, not division formation.', sourceUrl: swrHubballiRecord, sourceLabel: 'South Western Railway · station redevelopment record' },
      { year: 2003, title: 'Hubballi becomes SWR’s headquarters division', detail: 'The official record states Hubballi became one of SWR’s three divisions and the zone headquarters when the zone was formed on 1 April 2003.', sourceUrl: swrHubballiRecord, sourceLabel: 'South Western Railway · station and zone organization history' },
      { year: 2023, title: 'Hubballi station redevelopment is inaugurated', detail: 'SWR’s record dates completion/inauguration of the station redevelopment to 12 March 2023; this is a station project, not a claim about division-wide capacity.', sourceUrl: swrHubballiRecord, sourceLabel: 'South Western Railway · Hubballi redevelopment record' },
    ],
    references: [{ label: 'South Western Railway · Hubballi station and organization record', url: swrHubballiRecord }],
  },
  {
    id: 'SWR:Mysuru', zoneCode: 'SWR', division: 'Mysuru',
    thesis: 'A historic Karnataka division whose 2003 transfer into SWR is the firm administrative marker; its hill-facing route toward the coast shows how weather can interrupt a railway geography.',
    location: 'Mysuru–Hassan–Sakleshpur · Yedakumeri/Kadagaravalli Ghat section · Karnataka',
    sourceNote: 'The zone history gives the administrative transfer date. The 2024 bulletin reports an active landslide restoration and train cancellations, not a completed repair or a division formation date.',
    milestones: [
      { year: 2003, title: 'Mysuru transfers into the new South Western Railway', detail: 'The official SWR history records Mysuru as one of the divisions transferred from Southern Railway on 1 April 2003.', sourceUrl: swrHistory, sourceLabel: 'South Western Railway · zone and division history' },
      { year: 2024, title: 'Erosion disrupts the Yedakumeri–Kadagaravalli section', detail: 'SWR reported restoration work still in progress after erosion/landslide on 2 August 2024, with train cancellations. This is an incident snapshot, not a claim that repairs were complete.', sourceUrl: mysuruLandslide2024, sourceLabel: 'South Western Railway · operational bulletin, 2 Aug 2024' },
    ],
    references: [{ label: 'SWR · zone-formation history', url: swrHistory }, { label: 'SWR · 2024 operational bulletin', url: mysuruLandslide2024 }],
  },
  {
    id: 'WR:Ahmedabad', zoneCode: 'WR', division: 'Ahmedabad',
    thesis: 'A division carved out of Vadodara’s network in 2003; its capital-region rail history includes an earlier Ahmedabad–Gandhinagar line that predates the division itself.',
    location: 'Ahmedabad–Gandhinagar Capital · north Gujarat and Vadodara approaches',
    sourceNote: 'The Vadodara Division profile is used for the 1976 line opening and 2003 administrative change. This source does not establish a complete current Ahmedabad boundary map.',
    milestones: [
      { year: 1976, title: 'Ahmedabad–Gandhinagar Capital section opens', detail: 'Western Railway’s historical profile dates the section opening to 1 April 1976, when the line was still described within Vadodara Division.', sourceUrl: vadodaraOverview, sourceLabel: 'Western Railway · Vadodara Division overview' },
      { year: 2003, title: 'Ahmedabad Division becomes operational', detail: 'The same official profile states Ahmedabad Division became operational on 1 April 2003, with part of Vadodara Division merged into it.', sourceUrl: vadodaraOverview, sourceLabel: 'Western Railway · Vadodara Division overview' },
    ],
    references: [{ label: 'Western Railway · Vadodara history and Ahmedabad operationalization', url: vadodaraOverview }],
  },
  {
    id: 'WR:Rajkot', zoneCode: 'WR', division: 'Rajkot',
    thesis: 'Rajkot’s dated administrative lineage is documented in an early post-independence Census record; the present-day boundary and route chronology still need a modern Western Railway profile.',
    location: 'Rajkot and the Saurashtra peninsula · Gujarat',
    sourceNote: 'The 1961 Census handbook records creation of Rajkot Division in 1956. This is an older administrative source and does not establish the division’s current jurisdiction or operating statistics.',
    milestones: [
      { year: 1956, title: 'Rajkot Division is created', detail: 'The Census of India Rajkot district handbook records that Western Railway’s Rajkot Division was created in 1956.', sourceUrl: rajkotCensus1961, sourceLabel: 'Census of India · 1961 Rajkot District Handbook' },
    ],
    references: [{ label: 'Census of India · Rajkot District Handbook (1961)', url: rajkotCensus1961 }],
  },
  {
    id: 'WR:Bhavnagar', zoneCode: 'WR', division: 'Bhavnagar',
    thesis: 'A Saurashtra railway whose formation followed princely-state railways and post-integration amalgamation; its initial passenger line connected the port-side region inland.',
    location: 'Bhavnagar–Wadhwan–Limbdi · southern Saurashtra and coastal Gujarat',
    sourceNote: 'The official divisional profile provides both the predecessor line history and division inauguration date. Historic route opening is clearly distinguished from division formation.',
    milestones: [
      { year: 1880, title: 'Bhavnagar Terminus–Wadhwan line opens', detail: 'The Western Railway profile dates the line opening to December 1880 and notes the inaugural train ran from Bhavnagar to Limbdi.', sourceUrl: bhavnagarProfile, sourceLabel: 'Western Railway · Bhavnagar Division profile and history' },
      { year: 1952, title: 'Saurashtra railway systems enter the national network', detail: 'The divisional history records post-integration Saurashtra Railways being taken over by the Government of India and merged with Western Railway in early 1952.', sourceUrl: bhavnagarProfile, sourceLabel: 'Western Railway · Bhavnagar Division profile and history' },
      { year: 1956, title: 'Bhavnagar Division is formally inaugurated', detail: 'The official profile dates the division’s formal inauguration to 15 August 1956.', sourceUrl: bhavnagarProfile, sourceLabel: 'Western Railway · Bhavnagar Division profile and history' },
    ],
    references: [{ label: 'Western Railway · Bhavnagar Division profile and history', url: bhavnagarProfile }],
  },
  {
    id: 'WCR:Bhopal', zoneCode: 'WCR', division: 'Bhopal',
    thesis: 'A central-India corridor division where Itarsi’s locomotive and junction role, third-line capacity, and double/electrified trunks shape the network more than one headline city.',
    location: 'Bhopal–Itarsi–Khandwa · Bina–Guna connections · Madhya Pradesh',
    sourceNote: 'The WCR map and 2015–16 annual table are dated network references. Project reports distinguish trial, completed segments and pre-commissioning work; none is presented as a full corridor completion.',
    milestones: [
      { year: 2014, title: 'Itarsi hosts a multi-genset locomotive pilot trial', detail: 'The Ministry described Indian Railways’ first multi-genset locomotive as under pilot trial at Itarsi; this is trial status, not a claim of a regular commissioned fleet.', sourceUrl: 'https://www.pib.gov.in/newsite/PrintRelease.aspx?relid=98470', sourceLabel: 'Ministry of Railways · multi-genset pilot trial, 2014' },
      { year: 2021, title: 'Bhopal–Itarsi third-line sections progress in stages', detail: 'The Ministry reported Habibganj–Barkhera and Budni–Itarsi complete while Barkhera–Budni remained in progress, with five tunnels under construction. This is a dated project snapshot, not full third-line completion.', sourceUrl: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1753255&reg=3&lang=2', sourceLabel: 'Ministry of Railways · Bhopal–Itarsi third-line status, 2021' },
      { year: 2022, title: 'Bina–Guna doubling reaches commissioning preparation', detail: 'The Ministry notified pre-/non-interlocking work for commissioning Bina–Guna doubling; this preparation notice alone does not prove the section was commissioned.', sourceUrl: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1888548&reg=3&lang=2', sourceLabel: 'Ministry of Railways · Bina–Guna commissioning preparation, 2022' },
    ],
    references: [{ label: 'West Central Railway · system map (2018)', url: bhopalWcrMap }, { label: 'West Central Railway · annual report, 2015–16', url: bhopalWcrAnnual }],
  },
]

export function findDivisionDossier(zoneCode: string, division: string) {
  return railwayDivisionDossiers.find((dossier) => dossier.zoneCode === zoneCode && dossier.division === division)
}
