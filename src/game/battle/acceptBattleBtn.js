import {
  rejectBattleRequest,
  acceptBattleRequest,
  requestBattle,
} from '../network/battle'
import { setOpponentId } from '../../js/battleScene'
import { setMySkillType, startBattleSetting } from './utils'

/**
 *
 * 진짜 배틀 제안(Yes 클릭)
 * @param {string} opponentId 상대방 아이디(나한테 배틀을 건)
 * @param {boolean} isMyRequest
 * @param {string} battleId 서버에서 내려받은 배틀아이디
 */
export function offerBattle(opponentId, isMyRequest, battleId) {
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
          startBattleSetting(250, true, '')
        })
    } else {
      document
        .getElementById('selectTypeBtn')
        .addEventListener('click', (e) => {
          document.getElementById('selectTypeCard').style.display = 'none'
          document.getElementById('battleOpponentName2').innerText =
            'Waiting for accpetance...'
          document.getElementById('acceptBattleBtn').style.display = 'none'
          // 내 스킬타입 확정
          setMySkillType(document.getElementById('selectType').value)
          // NPC가 아니면 상대방과 악수하는 과정이 필요
          // 내가 제안하는 거면 Request, 내가 수락하는거면 Accept
          if (isMyRequest)
            // request battle
            requestBattle(
              opponentId,
              document.getElementById('selectType').value
            )
          // accept battle
          else
            acceptBattleRequest(
              opponentId,
              document.getElementById('selectType').value,
              battleId
            )
        })
    }
  })
}

export function rejectBattle(proposer_player_id, battle_id) {
  document.getElementById('refuseBattleBtn').addEventListener('click', (e) => {
    rejectBattleRequest(proposer_player_id, battle_id)
  })
}
