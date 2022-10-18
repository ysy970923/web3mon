import { joyToKey } from '../game/interaction/move'
import {
  battleZones,
  boundaries,
  battle,
  player,
  renderables,
  checkCollision,
  characters,
  enterBattle,
  global_position,
  movables,
} from './index'
import { others } from './network'
import { checkForCharacterCollision, rectangularCollision } from './utils'
import { keys, lastKey } from '../game/interaction/move'
import { battle_start, moveUser, stopUser } from './network'

export const animate = async () => {
  const animationId = window.requestAnimationFrame(animate)

  renderables.forEach((renderable) => {
    renderable.draw()
  })
  if (animationId % 600 < 200) others['250'].sprite.chat = 'Come in'
  else if (animationId % 600 < 400) others['250'].sprite.chat = 'Battle Zone'
  else others['250'].sprite.chat = 'Click Me!'
  for (const key in others) {
    if (others[key].draw === true) others[key].sprite.draw()
  }

  joyToKey()

  let moving = true
  player.animate = false

  if (battle.initiated) return

  if (battle_start) {
    battle_start = false
    document.getElementById('acceptBattleCard').style.display = 'none'
    enterBattle(animationId)
  }

  // 만약 채팅 중이라면 움직이지 않는다.
  // if (document.getElementById('chatForm').style.display !== 'none') return

  // enable to battle with others
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    battle.ready = false
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i]
      if (checkCollision(player, battleZone)) {
        battle.ready = true
        break
      }
    }
  }

  if (keys.w.pressed && lastKey === 'w') {
    console.log('w가 눌려있다!')
    player.animate = true
    player.image = player.sprites.up
    player.direction = 0

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 0, y: 3 },
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3
      })
    if (moving)
      for (const key in others) {
        others[key].sprite.position.y += 3
      }
  } else if (keys.a.pressed && lastKey === 'a') {
    console.log('a가 눌려있다!')
    player.animate = true
    player.image = player.sprites.left
    player.direction = 1

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 3, y: 0 },
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3
      })
    if (moving)
      for (const key in others) {
        others[key].sprite.position.x += 3
      }
  } else if (keys.s.pressed && lastKey === 's') {
    player.animate = true
    player.image = player.sprites.down
    player.direction = 2

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 0, y: -3 },
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3
      })
    if (moving)
      for (const key in others) {
        others[key].sprite.position.y -= 3
      }
  } else if (keys.d.pressed && lastKey === 'd') {
    player.animate = true
    player.image = player.sprites.right
    player.direction = 3

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: -3, y: 0 },
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3
      })
    if (moving)
      for (const key in others) {
        others[key].sprite.position.x -= 3
      }
  }
}
// animate()
var previousAnimate = false

setInterval(() => {
  if (player.animate === true) {
    moveUser(global_position(), player.direction)
    previousAnimate = player.animate
  } else if (previousAnimate === true) {
    stopUser(global_position())
  }
}, 50)
