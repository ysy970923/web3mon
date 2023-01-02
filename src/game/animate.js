import { joyToKey } from './interaction/move'
import {
  battle,
  player,
  renderables,
  global_position,
  stopAllPlay,
} from '../js/index'
import { others } from '../js/network'
import { keys, lastKey } from './interaction/move'
import { battle_start, setBattleStart } from './battle/utils'
import { enterBattle } from './battle/utils/enterBattle'
import { moveUser, stopUser } from '../game/interaction/move'
import { moveToXDirection } from './interaction/move'

const npcTalk = (animationId) => {
  // if (animationId % 600 < 200) others['250'].sprite.chat = 'Come in'
  // else if (animationId % 600 < 400) others['250'].sprite.chat = 'Battle Zone'
  // else others['250'].sprite.chat = 'Click Me!'
}

export const animate = async () => {
  const animationId = window.requestAnimationFrame(animate)

  renderables.forEach((renderable) => {
    renderable.draw()
  })
  // NPC가 말하는거
  npcTalk(animationId)

  for (const key in others) {
    if (others[key].draw === true) others[key].sprite.draw()
  }

  joyToKey()

  let moving = true
  player.animate = false

  if (battle.initiated) return

  if (battle_start) {
    setBattleStart(false)
    document.getElementById('acceptBattleCard').style.display = 'none'
    enterBattle(animationId)
  }

  // 만약 채팅 중이라면 움직이지 않는다.
  if (document.getElementById('chatForm').style.display !== 'none') return

  // enable to battle with others
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    // 배틀존 안에 들어왔는지 체크, 삭제된 코드
    /**
    battle.ready = false
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i]
      if (checkCollision(player, battleZone)) {
        battle.ready = true
        break
      }
    }
     */
  }

  // 아래부터는 나의 이동
  if (stopAllPlay) return
  if (keys.w.pressed && lastKey === 'w') {
    player.direction = 1
    moveToXDirection(moving, 'w', 1)
  } else if (keys.a.pressed && lastKey === 'a') {
    player.direction = 2
    moveToXDirection(moving, 'a', 1)
  } else if (keys.s.pressed && lastKey === 's') {
    player.direction = 3
    moveToXDirection(moving, 's', 1)
  } else if (keys.d.pressed && lastKey === 'd') {
    player.direction = 0
    moveToXDirection(moving, 'd', 1)
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
    previousAnimate = false
  }
}, 50)
