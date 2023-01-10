import { setOpponentId } from '../../js/battleScene'

export let battle_start = false
export let my_turn
export let mySkillType
export let battleId


/**
 *
 * @param {string} opponent_id 상대방 아이디
 * @param {boolean} isMyTurn 내가 먼저 시작인지?
 * @param {string} battle_id 배틀 아이디
 */
export function startBattleSetting(opponent_id, isMyTurn, battle_id) {
  document.getElementById('selectTypeCard').style.display = 'none'
  setBattleStart(true)
  battleId = battle_id
  my_turn = isMyTurn
  mySkillType = document.getElementById('selectType').value
  setOpponentId(opponent_id)
}

export function setBattleStart(bool) {
  battle_start = bool
}

export function setMyTurn(bool) {
  my_turn = bool
}

export function setMySkillType(type) {
  mySkillType = type
}
