import { useEffect, useState } from 'react'

const read = () => ({ width: window.innerWidth, height: window.innerHeight })

export function useViewport() {
  const [viewport, setViewport] = useState(read)

  useEffect(() => {
    const onResize = () => setViewport(read())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return viewport
}
