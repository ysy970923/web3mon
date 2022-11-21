import { my_turn, setMyTurn } from './utils'
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

export const checkCanUserSkill = (selectedAttack) => {
  if (selectedAttack.left_cool_time > 0) {
    window.alert('cool time is left')
    return false
  } else if (selectedAttack.limit == 0) {
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
  if (!my_turn) return
  console.log('밸류', skillValue)

  const selectedAttack = myMonster.attacks.filter(
    (doc) => parseInt(doc.value) === parseInt(skillValue)
  )[0]

  if (!checkCanUserSkill(selectedAttack)) {
    return
  }

  myMonster.attack({
    attack: selectedAttack,
    recipient: opponent,
    renderedSprites,
  })

  myMonster.attacks.forEach((attack) => {
    // 한번 공격했으니 전체 쿨타임 1씩 감소
    if (attack.left_cool_time > 0) attack.left_cool_time -= 1
  })

  // 한번 공격했으니 사용한 공격의 사용 가능 횟수 1 감수
  selectedAttack.limit -= 1
  selectedAttack.left_cool_time = selectedAttack.cool_time

  Array.from(document.querySelector('#attacksBox').childNodes).forEach(
    (button, index) => {
      const attack = myMonster.attacks[index]
      button.innerHTML = `${attack.name}\n (Cool: ${attack.left_cool_time})\n (Left: ${attack.limit})`
    }
  )

  // NPC는 알아서 랜덤으로 공격해야하니까
  if (opponent_id == 250) {
    setTimeout(() => {
      if (Math.random() < 0.5) attacked(0)
      else attacked(1)
    }, 3000)
  } else sendAttack(opponent_id, myMonster.attacks.indexOf(selectedAttack))

  // 내가 이긴 경우
  if (opponent.health <= 0) {
    queue.push(() => {
      opponent.faint()
    })
    endBattle('WIN')
  }

  setMyTurn(false)
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
