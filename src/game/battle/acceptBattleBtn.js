import { battleAnswer, battleDeny, battleOffer } from './battleOffer'
import { others } from '../../js/network'
import { canvas, battle, battleZones, checkCollision } from '../../js/index'
import { setOpponentId } from '../../js/battleScene'
import { mySkillType, startBattle } from './utils'

/**
 * 배틀 수락 혹은 Yes 클릭.
 * parameter : 배틀 상대방의 id
 */
export function acceptBattleBtn(opponentId) {
  document.getElementById('acceptBattleBtn').addEventListener('click', (e) => {
    document.getElementById('refuseBattleBtn').style.display = 'none'
    document.getElementById('selectTypeCard').style.display = 'block'
    if (opponentId == 250) {
      // NPC면
      console.log('NPC 예스', opponentId)
      setOpponentId(opponentId)
      document
        .getElementById('selectTypeBtn')
        .addEventListener('click', (e) => {
          startBattle()
        })
    } else {
      document
        .getElementById('selectTypeBtn')
        .addEventListener('click', (e) => {
          console.log('로그 12')
          document.getElementById('selectTypeCard').style.display = 'none'
          document.getElementById('battleOpponentName2').innerText =
            'Waiting for accpetance...'
          document.getElementById('acceptBattleBtn').style.display = 'none'
          mySkillType = document.getElementById('selectType').value
          // NPC가 아니면 상대방과 악수하는 과정이 필요
          battleOffer(opponentId, mySkillType)
        })
    }
  })
}
