import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { systems, years } from './data'
import { networkModes, ALL_INDIA_CENTER, ALL_INDIA_ZOOM } from './config/networks'
import { visibleStationsFor } from './services/transitData'
import { train17216, type RailwayStationStop } from './data/indianRailways'
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
  const [selectedRailwayStop, setSelectedRailwayStop] = useState<RailwayStationStop | null>(null)
  const [, setMapReady] = useState(false)
  const [routeStatus, setRouteStatus] = useState<RouteStatus>('loading')
  const [showStations, setShowStations] = useState(true)
  const [showRoutes, setShowRoutes] = useState(true)

  // RailRadar train live tracking state
  const [trainProgress, setTrainProgress] = useState(0.58) // Near Vijayawada Jn
  const [isTrainRunning, setIsTrainRunning] = useState(false)

  const mapRef = useRef<Map | null>(null)

  const handleRouteStatus = useCallback((status: RouteStatus) => {
    setRouteStatus(status)
  }, [])

  const visibleStations = useMemo(() => {
    return visibleStationsFor(system, year)
  }, [year, system, routeStatus])

  const selectedSystem = systems.find((item) => item.id === system)
  const selectedNetwork = networkModes.find((item) => item.id === network) ?? networkModes[0]

  // Playback timer across milestones (for Metro historical view)
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

  // Live simulation ticker for Indian Railways Train 17216
  useEffect(() => {
    if (!isTrainRunning || network !== 'rail') return
    const interval = window.setInterval(() => {
      setTrainProgress((prev) => {
        const next = prev + 0.004
        return next >= 1 ? 0 : next
      })
    }, 500)
    return () => window.clearInterval(interval)
  }, [isTrainRunning, network])

  const handleNetworkChange = (mode: NetworkMode) => {
    setNetwork(mode)
    setSelectedStation(null)
    setSelectedRailwayStop(null)
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

  const handleSelectRailwayStop = (stop: RailwayStationStop) => {
    setSelectedRailwayStop(stop)
    mapRef.current?.flyTo({
      center: stop.coordinates,
      zoom: 11,
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
          trainProgress={trainProgress}
          onSelectStation={setSelectedStation}
          onSelectRailwayStop={handleSelectRailwayStop}
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
            ) : network === 'rail' ? (
              <>
                17216 · DMM MTM Express <em>({train17216.distanceKm} km · 22 stations)</em>
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
          trainProgress={trainProgress}
          onTrainProgressChange={setTrainProgress}
          isTrainRunning={isTrainRunning}
          onToggleTrainRunning={() => setIsTrainRunning(!isTrainRunning)}
        />

        <AtlasLegend network={network} />
      </section>

      <AtlasPanel
        network={network}
        system={system}
        selectedStation={selectedStation}
        selectedRailwayStop={selectedRailwayStop}
        selectedNetwork={selectedNetwork}
        routeStatus={routeStatus}
        visibleStationsCount={visibleStations.length}
        showStations={showStations}
        showRoutes={showRoutes}
        trainProgress={trainProgress}
        isTrainRunning={isTrainRunning}
        onToggleTrainRunning={() => setIsTrainRunning(!isTrainRunning)}
        onTrainProgressChange={setTrainProgress}
        onNetworkChange={handleNetworkChange}
        onSystemChange={handleSystemChange}
        onSelectRailwayStop={handleSelectRailwayStop}
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
        Transit Time Machine · India rail overview{' '}
        <span>
          Map tiles © OpenStreetMap contributors ·{' '}
          <a
            href="https://railradar.in/railradar?train=17216&date=2026-10-10"
            target="_blank"
            rel="noreferrer"
          >
            RailRadar Source
          </a>
        </span>
      </footer>
    </main>
  )
}
