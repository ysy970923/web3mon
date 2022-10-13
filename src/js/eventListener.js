window.addEventListener('resize', onResizeEvent, true)

/**
 * When resize the Window, charaters should be moved
 */
function onResizeEvent() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  var delta_x = canvas.width / 2 - 192 / 4 / 2 - player.position.x
  var delta_y = canvas.height / 2 - 68 / 2 - player.position.y
  renderables.forEach((renderable) => {
    renderable.position.x = renderable.position.x + delta_x
    renderable.position.y = renderable.position.y + delta_y
  })
  for (const key in others) {
    others[key].sprite.position.x = others[key].sprite.position.x + delta_x
    others[key].sprite.position.y = others[key].sprite.position.y + delta_y
  }
}
