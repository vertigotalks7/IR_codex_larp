import { useCallback, useMemo, useRef, useState } from 'react'
import { systems } from './data'
import { networkModes, ALL_INDIA_CENTER, ALL_INDIA_ZOOM } from './config/networks'
import { visibleStationsFor } from './services/transitData'
import { nationalCorridors, type RailwayJunction } from './data/nationalRailways'
import { RAILWAY_ZONES } from './data/railwayZones'
import { SUBURBAN_DIVISIONS } from './data/suburbanDivisions'
import { LandingPage } from './components/Landing/LandingPage'
import { HistoryPage } from './components/History/HistoryPage'
import { AtlasHeader } from './components/Atlas/AtlasHeader'
import { AtlasPanel } from './components/Atlas/AtlasPanel'
import { AtlasLegend } from './components/Atlas/AtlasLegend'
import { MapView } from './components/Map/MapView'
import type { MetroSystemId, NetworkMode, Station, RouteStatus } from './types'

type Map = import('maplibre-gl').Map

export default function App() {
  const [page, setPage] = useState<'landing' | 'atlas' | 'history'>('landing')
  const [network, setNetwork] = useState<NetworkMode>('metro')
  const year = 2026
  const [system, setSystem] = useState<MetroSystemId | 'all'>('all')
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [selectedRailwayJunction, setSelectedRailwayJunction] = useState<RailwayJunction | null>(null)
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('all')
  const [selectedSuburbanId, setSelectedSuburbanId] = useState<string>('mumbai')
  const [, setMapReady] = useState(false)
  const [routeStatus, setRouteStatus] = useState<RouteStatus>('loading')
  const [showStations, setShowStations] = useState(true)
  const [showRoutes, setShowRoutes] = useState(true)

  const mapRef = useRef<Map | null>(null)

  const handleRouteStatus = useCallback((status: RouteStatus) => {
    setRouteStatus(status)
  }, [])

  const visibleStations = useMemo(() => {
    return visibleStationsFor(system, year)
  }, [system, year])

  const selectedSystem = systems.find((item) => item.id === system)
  const selectedNetwork = networkModes.find((item) => item.id === network) ?? networkModes[0]
  const currentCorridor = nationalCorridors.find((c) => c.id === selectedCorridorId)

  const handleNetworkChange = (mode: NetworkMode) => {
    setNetwork(mode)
    setSelectedStation(null)
    setSelectedRailwayJunction(null)
    if (mode === 'suburban') {
      const activeDiv = SUBURBAN_DIVISIONS.find((d) => d.id === selectedSuburbanId)
      if (activeDiv) {
        mapRef.current?.flyTo({ center: activeDiv.center, zoom: activeDiv.zoom })
        return
      }
    }
    const modeConfig = networkModes.find((item) => item.id === mode)
    if (modeConfig) {
      mapRef.current?.flyTo({ center: modeConfig.center, zoom: modeConfig.zoom })
    }
  }

  const handleSuburbanDivisionChange = (divisionId: string) => {
    setSelectedSuburbanId(divisionId)
    setSelectedStation(null)
    setSelectedRailwayJunction(null)
    if (divisionId === 'all') {
      mapRef.current?.flyTo({ center: ALL_INDIA_CENTER, zoom: ALL_INDIA_ZOOM })
      return
    }
    const division = SUBURBAN_DIVISIONS.find((d) => d.id === divisionId)
    if (division) {
      mapRef.current?.flyTo({ center: division.center, zoom: division.zoom })
    }
  }

  const handleSystemChange = (targetSystem: MetroSystemId | 'all') => {
    setSystem(targetSystem)
    if (targetSystem === 'all') {
      mapRef.current?.flyTo({ center: ALL_INDIA_CENTER, zoom: ALL_INDIA_ZOOM })
    } else {
      const targetConfig = systems.find((item) => item.id === targetSystem)
      if (targetConfig) {
        mapRef.current?.flyTo({ center: targetConfig.center, zoom: 10 })
      }
    }
  }

  const handleCorridorChange = (corridorId: string) => {
    setSelectedCorridorId(corridorId)
    setSelectedRailwayJunction(null)

    if (corridorId === 'all') {
      mapRef.current?.flyTo({ center: [78.96, 21.5], zoom: 4.8 })
      return
    }

    const zone = RAILWAY_ZONES.find((z) => z.id === corridorId)
    if (zone) {
      mapRef.current?.flyTo({ center: zone.center, zoom: zone.zoom })
      return
    }

    const corridor = nationalCorridors.find((c) => c.id === corridorId)
    if (corridor && corridor.coordinates.length > 0) {
      const midIdx = Math.floor(corridor.coordinates.length / 2)
      const midPoint = corridor.coordinates[midIdx]
      mapRef.current?.flyTo({ center: midPoint, zoom: 6.2 })
    }
  }

  const handleSelectRailwayJunction = (junction: RailwayJunction) => {
    setSelectedRailwayJunction(junction)
    mapRef.current?.flyTo({
      center: junction.coordinates,
      zoom: 10,
    })
  }

  if (page === 'landing') {
    return <LandingPage onEnterAtlas={() => setPage('atlas')} onOpenHistory={() => setPage('history')} />
  }

  if (page === 'history') {
    return <HistoryPage onOpenAtlas={() => setPage('atlas')} onGoLanding={() => setPage('landing')} />
  }

  return (
    <main className="atlas-shell">
      <AtlasHeader
        onGoLanding={() => setPage('landing')}
        onGoHistory={() => setPage('history')}
        selectedNetwork={selectedNetwork}
        network={network}
        routeStatus={routeStatus}
      />

      <section className="atlas-map">
        <MapView
          year={year}
          system={system}
          network={network}
          mapRef={mapRef}
          showStations={showStations}
          showRoutes={showRoutes}
          selectedCorridorId={selectedCorridorId}
          selectedSuburbanId={selectedSuburbanId}
          onSelectStation={setSelectedStation}
          onSelectRailwayJunction={handleSelectRailwayJunction}
          onReady={() => setMapReady(true)}
          onRouteStatus={handleRouteStatus}
        />

        <AtlasLegend network={network} />
      </section>

      <AtlasPanel
        network={network}
        system={system}
        selectedStation={selectedStation}
        selectedRailwayJunction={selectedRailwayJunction}
        selectedCorridorId={selectedCorridorId}
        selectedSuburbanId={selectedSuburbanId}
        selectedNetwork={selectedNetwork}
        routeStatus={routeStatus}
        visibleStationsCount={visibleStations.length}
        showStations={showStations}
        showRoutes={showRoutes}
        onNetworkChange={handleNetworkChange}
        onSystemChange={handleSystemChange}
        onCorridorChange={handleCorridorChange}
        onSuburbanDivisionChange={handleSuburbanDivisionChange}
        onSelectRailwayJunction={handleSelectRailwayJunction}
        onToggleStations={setShowStations}
        onToggleRoutes={setShowRoutes}
      />

      <footer className="atlas-footer">
        Transit Time Machine · India rail overview{' '}
        <span>
          Track geometry © OpenStreetMap contributors; national GIS provenance is documented in the source ledger ·{' '}
          <a
            href="https://data.humdata.org/dataset/hotosm_ind_railways"
            target="_blank"
            rel="noreferrer"
          >
            HDX GIS Source
          </a>
        </span>
      </footer>
    </main>
  )
}
