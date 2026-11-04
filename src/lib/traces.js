/* Turns an orthogonal polyline into a PCB-style route with 45 degree corners. */
export function chamfer(points, cut = 8) {
  const [first, ...rest] = points
  let path = `M${first[0]} ${first[1]}`

  rest.forEach((corner, index) => {
    const next = rest[index + 1]
    if (!next) {
      path += ` L${corner[0]} ${corner[1]}`
      return
    }
    const previous = points[index]
    const inLength = Math.hypot(corner[0] - previous[0], corner[1] - previous[1])
    const outLength = Math.hypot(next[0] - corner[0], next[1] - corner[1])
    if (!inLength || !outLength) return
    const size = Math.min(cut, inLength / 2, outLength / 2)
    const startX = corner[0] + ((previous[0] - corner[0]) / inLength) * size
    const startY = corner[1] + ((previous[1] - corner[1]) / inLength) * size
    const endX = corner[0] + ((next[0] - corner[0]) / outLength) * size
    const endY = corner[1] + ((next[1] - corner[1]) / outLength) * size
    path += ` L${startX} ${startY} L${endX} ${endY}`
  })

  return path
}
