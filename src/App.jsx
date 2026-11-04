import { useCallback, useEffect, useRef, useState } from 'react'
import { projects } from './data/projects'
import { useHashRoute } from './hooks/useHashRoute'
import Board from './components/Board'
import DieView from './components/DieView'
import ExperienceLayer from './components/ExperienceLayer'
import SkillsMatrix from './components/SkillsMatrix'
import TerminalBio from './components/TerminalBio'

const LAYER_ROUTES = { projects: '/', skills: '/signal-chain', experience: '/experience' }

const isTyping = (target) => ['INPUT', 'TEXTAREA'].includes(target?.tagName)

export default function App() {
  const [route, navigate] = useHashRoute()
  const [consoleOpen, setConsoleOpen] = useState(false)
  const [focusedZone, setFocusedZone] = useState(null)
  const lastChipRef = useRef(null)

  const project = projects.find((item) => `/${item.id}` === route) ?? null
  const activeLayer = Object.keys(LAYER_ROUTES).find((id) => LAYER_ROUTES[id] === route) ?? 'projects'
  const layerOpen = activeLayer !== 'projects'

  const openProject = useCallback((id) => navigate(`/${id}`), [navigate])
  const closeOverlay = useCallback(() => navigate('/'), [navigate])
  const selectLayer = useCallback((id) => navigate(LAYER_ROUTES[id]), [navigate])

  const showZone = useCallback(
    (zoneId) => {
      setFocusedZone((current) => (current === zoneId ? null : zoneId))
      navigate('/')
    },
    [navigate],
  )

  // Returns keyboard focus to the chip that was opened.
  useEffect(() => {
    if (project) {
      lastChipRef.current = project.id
    } else if (lastChipRef.current) {
      document.getElementById(`chip-${lastChipRef.current}`)?.focus({ preventScroll: true })
      lastChipRef.current = null
    }
  }, [project])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === '`') {
        event.preventDefault()
        setConsoleOpen((open) => !open)
        return
      }
      if (event.key === 'Escape') {
        if (consoleOpen) setConsoleOpen(false)
        else if (project || layerOpen) closeOverlay()
        else setFocusedZone(null)
        return
      }
      if (isTyping(event.target)) return
      if (event.key.toLowerCase() === 'l' && !project) {
        const order = Object.keys(LAYER_ROUTES)
        selectLayer(order[(order.indexOf(activeLayer) + 1) % order.length])
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [consoleOpen, project, layerOpen, activeLayer, closeOverlay, selectLayer])

  return (
    <>
      <Board
        openChipId={project?.id ?? null}
        activeLayer={activeLayer}
        focusedZone={focusedZone}
        onOpenProject={openProject}
        onFocusZone={showZone}
        onOpenConsole={() => setConsoleOpen(true)}
        onSelectLayer={selectLayer}
      />

      {project && <DieView key={project.id} project={project} onClose={closeOverlay} onOpenProject={openProject} />}
      {activeLayer === 'skills' && <SkillsMatrix onOpenProject={openProject} onClose={closeOverlay} />}
      {activeLayer === 'experience' && <ExperienceLayer onOpenProject={openProject} onClose={closeOverlay} />}

      <TerminalBio
        open={consoleOpen}
        onClose={() => setConsoleOpen(false)}
        onFocusZone={showZone}
        onShowSkills={() => selectLayer('skills')}
        onShowExperience={() => selectLayer('experience')}
        onOpenProject={openProject}
      />
    </>
  )
}
