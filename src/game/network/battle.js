import { ws, myID } from '../../js/network'
import { checkOrReconnect } from '../network/checkConnection'

/**
 * 스킬 타입이 있긴한데.. 처음에는 요청을 안보내지?
 */
export function requestBattle(receiver_player_id, skillType) {
  if (!checkOrReconnect()) return
  console.log('이사람한테 보낸다22222', receiver_player_id, skillType)

  const body = {
    RequestBattle: { receiver_player_id: receiver_player_id },
  }

  const msg = JSON.stringify(body)
  ws.send(msg)
}

export function acceptBattleRequest(proposer_player_id, skillType, battle_id) {
  if (!checkOrReconnect()) return

  const body = {
    AcceptBattle: {
      proposer_player_id: proposer_player_id,
      battle_id: battle_id,
    },
  }

  console.log('바디', body)

  const msg = JSON.stringify(body)
  ws.send(msg)
}

export function rejectBattleRequest(proposer_player_id, battle_id) {
  console.log(
    '이사람꺼 거절',
    proposer_player_id,
    '배틀 아이디',
    battle_id,
    typeof battle_id
  )
  if (!checkOrReconnect()) return

  const body = {
    RejectBattle: {
      proposer_player_id: proposer_player_id,
      battle_id: parseInt(battle_id),
    },
  }

  console.log(JSON.stringify(body), ' 제이썬')
  // ws.send(JSON.stringify(body))
}

export function battleAccept() {
  document.getElementById('acceptBattleCard').style.display = 'none'
  document.getElementById('selectTypeCard').style.display = 'block'
}