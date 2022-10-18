import { others, connect } from './network'
import { player } from './index'
import { animate } from '../game/animate'

export const worker = new Worker('./js/worker.js')

worker.onmessage = function (event) {
  if (event.data) {
    if (event.data.id === '-1') {
      player.sprites.up.src = event.data.up
      player.sprites.down.src = event.data.down
      player.sprites.left.src = event.data.left
      player.sprites.right.src = event.data.right
      player.baseImage.src = event.data.baseImage
      player.image = player.sprites.down
      document.getElementById('loading').style.display = 'none'
      animate()
      connect()
    } else {
      others[event.data.id].sprite.sprites.up.src = event.data.up
      others[event.data.id].sprite.sprites.down.src = event.data.down
      others[event.data.id].sprite.sprites.left.src = event.data.left
      others[event.data.id].sprite.sprites.right.src = event.data.right
      others[event.data.id].baseImage.src = event.data.baseImage
      others[event.data.id].sprite.image =
        others[event.data.id].sprite.sprites.down
      others[event.data.id].draw = true
    }
  }
}
worker.onerror = function (err) {
  console.log(err)
}
