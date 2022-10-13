import { others } from './network'
import { player } from './index'

function openForm() {
  document.getElementById('myForm').style.display = 'block'
}

function closeForm() {
  document.getElementById('myForm').style.display = 'none'
}

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

function checkForCharacterCollision({
  characters,
  player,
  characterOffset = { x: 0, y: 0 }
}) {
  // monitor for character collision
  for (let i = 0; i < characters.length; i++) {
    const character = characters[i]

    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...character,
          position: {
            x: character.position.x + characterOffset.x,
            y: character.position.y + characterOffset.y
          }
        }
      })
    ) {
      console.log('go')
    }
  }
}

export const worker = new Worker('./js/worker.js')

worker.onmessage = function (event) {
  console.log(event.data)
  if (event.data) {
    if (event.data.id === '-1') {
      player.sprites.up.src = event.data.up
      player.sprites.down.src = event.data.down
      player.sprites.left.src = event.data.left
      player.sprites.right.src = event.data.right
      player.baseImage.src = event.data.baseImage
      player.image = player.sprites.down
      document.getElementById('loading').style.display = 'none'
      console.log('콘로')
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
  console.log(typeof player.image.src)
  console.log(typeof others['250'].sprite.image.src)
}
worker.onerror = function (err) {
  console.log(err)
}
