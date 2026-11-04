import { useCallback, useEffect, useRef, useState } from 'react'
import { projects } from './data/projects'
import { useHashRoute } from './hooks/useHashRoute'
import Board from './components/Board'
import DieView from './components/DieView'
import SkillsMatrix from './components/SkillsMatrix'
import TerminalBio from './components/TerminalBio'

const SKILLS_ROUTE = '/signal-chain'

const isTyping = (target) => ['INPUT', 'TEXTAREA'].includes(target?.tagName)

export default function App() {
  const [route, navigate] = useHashRoute()
  const [consoleOpen, setConsoleOpen] = useState(false)
  const [focusedZone, setFocusedZone] = useState(null)
  const lastChipRef = useRef(null)

  const project = projects.find((item) => `/${item.id}` === route) ?? null
  const skillsOpen = route === SKILLS_ROUTE

  const openProject = useCallback((id) => navigate(`/${id}`), [navigate])
  const closeOverlay = useCallback(() => navigate('/'), [navigate])
  const openSkills = useCallback(() => navigate(SKILLS_ROUTE), [navigate])

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
        else if (project || skillsOpen) closeOverlay()
        else setFocusedZone(null)
        return
      }
      if (isTyping(event.target)) return
      if (event.key.toLowerCase() === 'l' && !project) {
        navigate(skillsOpen ? '/' : SKILLS_ROUTE)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [consoleOpen, project, skillsOpen, closeOverlay, navigate])

  return (
    <>
      <Board
        openChipId={project?.id ?? null}
        skillsOpen={skillsOpen}
        focusedZone={focusedZone}
        onOpenProject={openProject}
        onFocusZone={showZone}
        onOpenConsole={() => setConsoleOpen(true)}
        onShowProjects={closeOverlay}
        onShowSkills={openSkills}
      />

      {project && <DieView key={project.id} project={project} onClose={closeOverlay} onOpenProject={openProject} />}
      {skillsOpen && <SkillsMatrix onOpenProject={openProject} onClose={closeOverlay} />}

      <TerminalBio
        open={consoleOpen}
        onClose={() => setConsoleOpen(false)}
        onFocusZone={showZone}
        onShowSkills={openSkills}
        onOpenProject={openProject}
      />
    </>
  )
}
