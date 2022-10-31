import { others } from '../../js/network'
import { canvas, battle, battleZones, checkCollision } from '../../js/index'
import { acceptBattleBtn } from './acceptBattleBtn'

// click opponent to offer battle
canvas.addEventListener('click', (e) => {
  // need to be ready and not currently battling
  if (!battle.ready || battle.initiated) return
  for (const key in others) {
    var x = e.offsetX - others[key].sprite.width / 2
    var y = e.offsetY - others[key].sprite.height / 2
    if (
      Math.abs(others[key].sprite.position.x - x) <
        others[key].sprite.width / 2 &&
      Math.abs(others[key].sprite.position.y - y) <
        others[key].sprite.height / 2
    ) {
      for (let i = 0; i < battleZones.length; i++) {
        const battleZone = battleZones[i]
        if (checkCollision(others[key].sprite, battleZone)) {
          document.getElementById('acceptBattleBtn').style.display =
            'inline-block'
          document.getElementById('refuseBattleBtn').style.display =
            'inline-block'
          document
            .getElementById('acceptBattleBtn')
            .replaceWith(
              document.getElementById('acceptBattleBtn').cloneNode(true)
            )
          document
            .getElementById('refuseBattleBtn')
            .replaceWith(
              document.getElementById('refuseBattleBtn').cloneNode(true)
            )

          document.getElementById('acceptBattleCard').style.display = 'block'
          document.getElementById('battleOpponentName2').innerText =
            'Opponent: ' + others[key].sprite.name

          // 배틀 수락
          acceptBattleBtn(key)

          // 배틀 거절
          document
            .getElementById('refuseBattleBtn')
            .addEventListener('click', (e) => {
              document.getElementById('acceptBattleCard').style.display = 'none'
            })
          break
        }
      }
      break
    }
  }
})
