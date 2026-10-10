import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { systems, years } from './data'
import { networkModes, ALL_INDIA_CENTER, ALL_INDIA_ZOOM } from './config/networks'
import { visibleStationsFor } from './services/transitData'
import { LandingPage } from './components/Landing/LandingPage'
import { AtlasHeader } from './components/Atlas/AtlasHeader'
import { AtlasPanel } from './components/Atlas/AtlasPanel'
import { AtlasTimeSlider } from './components/Atlas/AtlasTimeSlider'
import { AtlasLegend } from './components/Atlas/AtlasLegend'
import { AtlasMilestones } from './components/Atlas/AtlasMilestones'
import { MapView } from './components/Map/MapView'
import type { MetroSystemId, NetworkMode, Station, RouteStatus } from './types'

type Map = import('maplibre-gl').Map

export default function App() {
  const [page, setPage] = useState<'landing' | 'atlas'>('landing')
  const [network, setNetwork] = useState<NetworkMode>('metro')
  const [year, setYear] = useState(2022)
  const [system, setSystem] = useState<MetroSystemId | 'all'>('all')
  const [playing, setPlaying] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
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
  }, [year, system, routeStatus])

  const selectedSystem = systems.find((item) => item.id === system)
  const selectedNetwork = networkModes.find((item) => item.id === network) ?? networkModes[0]

  // Playback timer across milestones
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setYear((current) => {
        const next = years.find((candidate) => candidate > current)
        if (next === undefined) {
          setPlaying(false)
          return current
        }
        return next
      })
    }, 900)
    return () => window.clearInterval(timer)
  }, [playing])

  const handleNetworkChange = (mode: NetworkMode) => {
    setNetwork(mode)
    setSelectedStation(null)
    const modeConfig = networkModes.find((item) => item.id === mode)
    if (modeConfig) {
      mapRef.current?.flyTo({ center: modeConfig.center, zoom: modeConfig.zoom })
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

  const handleMilestoneSelect = (milestoneYear: number, coordinates: [number, number]) => {
    setYear(milestoneYear)
    mapRef.current?.flyTo({
      center: coordinates,
      zoom: system === 'all' ? 5 : 10,
    })
  }

  if (page === 'landing') {
    return <LandingPage onEnterAtlas={() => setPage('atlas')} />
  }

  return (
    <main className="atlas-shell">
      <AtlasHeader
        onGoLanding={() => setPage('landing')}
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
          onSelectStation={setSelectedStation}
          onReady={() => setMapReady(true)}
          onRouteStatus={handleRouteStatus}
        />

        <div className="atlas-title">
          <h1>India {selectedNetwork.name} Map</h1>
          <p>
            {network === 'metro' ? (
              <>
                {selectedSystem?.name ?? 'All metro systems'} <em>· {year}</em>
              </>
            ) : (
              selectedNetwork.description
            )}
          </p>
        </div>

        <AtlasTimeSlider
          network={network}
          year={year}
          onYearChange={setYear}
          selectedNetwork={selectedNetwork}
        />

        <AtlasLegend network={network} />
      </section>

      <AtlasPanel
        network={network}
        system={system}
        selectedStation={selectedStation}
        selectedNetwork={selectedNetwork}
        routeStatus={routeStatus}
        visibleStationsCount={visibleStations.length}
        showStations={showStations}
        showRoutes={showRoutes}
        onNetworkChange={handleNetworkChange}
        onSystemChange={handleSystemChange}
        onToggleStations={setShowStations}
        onToggleRoutes={setShowRoutes}
      />

      {network === 'metro' && (
        <AtlasMilestones
          year={year}
          playing={playing}
          system={system}
          onSelectMilestone={handleMilestoneSelect}
          onTogglePlay={() => setPlaying(!playing)}
        />
      )}

      <footer className="atlas-footer">
        Transit Time Machine · India metro overview{' '}
        <span>
          Map tiles © OpenStreetMap contributors ·{' '}
          <a
            href="https://delhimetrorail.com/pages/about-us/present-network"
            target="_blank"
            rel="noreferrer"
          >
            Sources
          </a>
        </span>
      </footer>
    </main>
  )
}
