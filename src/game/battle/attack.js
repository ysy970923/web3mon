import { my_attack, setMyTurn } from './utils'
import {
  opponent_id,
  myMonster,
  opponent,
  renderedSprites,
  attacked,
  endBattle,
  queue,
} from '../../js/battleScene'
import { ws } from '../../js/network'
import { insertButton } from '../../js/battleScene'

export const checkCanUserSkill = (selectedAction) => {
  if (selectedAction.left_cool_time > 0) {
    window.alert('cool time is left')
    return false
  } else if (selectedAction.limit == 0) {
    window.alert('limit is over')
    return false
  } else {
    return true
  }
}

/**
 * I clicked skill button to attack opponent
 * @param {number} skillValue
 *
 */
export const clickSkillButton = (skillValue) => {
  console.log('밸류', skillValue)

  window.battle.chooseAction(skillValue)

  // NPC는 반사 공격 중
  if (opponent_id != 250) sendAttack(opponent_id, myMonster.attacks.indexOf(skillValue))
}

/**
 *
 * @param {string} opponent_id
 * @param {string} attackType
 */
export const sendAttack = (opponent_id, attackType) => {
  const body = {
    Attack: {
      dwdw: 'dw',
    },
  }

  const msg = JSON.stringify(body)

  ws.send(msg)
}
