import { battleAnswer, battleDeny, battleOffer } from './battleOffer'
import { others } from '../../js/network'
import { canvas, battle, battleZones, checkCollision } from '../../js/index'
import { mySkillType, my_turn, opponent_id } from '../../js/battleScene'

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
          document
            .getElementById('acceptBattleBtn')
            .addEventListener('click', (e) => {
              console.log('배틀 예스')
              document.getElementById('refuseBattleBtn').style.display = 'none'
              document.getElementById('selectTypeCard').style.display = 'block'
              if (key == 250) {
                // NPC면
                console.log('NPC 예스', opponent_id)
                opponent_id = key
                console.log('여기서 막')
                document
                  .getElementById('selectTypeBtn')
                  .addEventListener('click', (e) => {
                    console.log('로그 1')
                    document.getElementById('selectTypeCard').style.display =
                      'none'
                    battle_start = true
                    my_turn = true
                    mySkillType = document.getElementById('selectType').value
                  })
              } else {
                document
                  .getElementById('selectTypeBtn')
                  .addEventListener('click', (e) => {
                    console.log('로그 12')
                    document.getElementById('selectTypeCard').style.display =
                      'none'
                    document.getElementById('battleOpponentName2').innerText =
                      'Waiting for accpetance...'
                    document.getElementById('acceptBattleBtn').style.display =
                      'none'
                    mySkillType = document.getElementById('selectType').value
                    battleOffer(key, mySkillType)
                  })
              }
            })
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
