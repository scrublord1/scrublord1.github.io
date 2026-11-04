import { useCallback, useEffect, useState } from 'react'

const read = () => window.location.hash.replace(/^#/, '') || '/'

/* Keeps the open chip in the URL, so links can be shared and Back closes it. */
export function useHashRoute() {
  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onChange = () => setRoute(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((path) => {
    window.location.hash = path
  }, [])

  return [route, navigate]
}
