import { animate } from '../game/animate'
import { Sprite } from '../game/object/Sprite'
import { others, attack } from './network'
import { skillTypes } from '../game/battle/utils/skillSets'
import { player, canva, battle } from './index'
import { Monster } from '../game/object/Monster'
import { gsap } from 'gsap'
import { battleAnimationId } from '../game/battle/utils/enterBattle'
import {
  mySkillType,
  setBattleStart,
  my_turn,
  setMyTurn,
} from '../game/battle/utils'
import { clickSkillButton } from '../game/battle/attack'

const battleBackgroundImage = new Image()
battleBackgroundImage.src = '../img/battleBackground2.png'

export const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
  scale: 1.2,
})

export let opponent_id = null
export let opponent
export let myMonster
export let renderedSprites
export let queue

/** 공격이 들어와서 내가 공격을 받음 */
export function attacked(attack) {
  queue.push(() => {
    opponent.attack({
      attack: opponent.attacks[attack],
      recipient: myMonster,
      renderedSprites,
    })
    setMyTurn(true)

    if (myMonster.health <= 0) {
      queue.push(() => {
        myMonster.faint()
      })
      endBattle('LOSE')
    }
  })
}

/**
 *
 * @param {'win' | 'lose'} result 이겼으면 win, 졌으면 lose
 */
export function endBattle(result) {
  if (result === 'win') {
    console.log('이겼다.')
  } else if (result === 'lose') {
    console.log('졌다.')
  }

  queue.push(() => {
    // fade back to black
    gsap.to('#overlappingDiv', {
      opacity: 1,
      onComplete: () => {
        cancelAnimationFrame(battleAnimationId)
        animate()
        document.querySelector('#userInterface').style.display = 'none'
        document.getElementById('battleResultCard').style.display = 'block'
        document.getElementById('battleResult').innerText = `You ${result}!`
        document.querySelector('#joyDiv').style.display = 'block'
        gsap.to('#overlappingDiv', {
          opacity: 0,
        })
        battle.initiated = false
      },
    })
    setBattleStart(false)
  })
}

/**
 * 진짜 배틀 시작, 배틀 맵으로 이동
 */
export function initBattle() {
  console.log('상대방 아이디', opponent_id, others[opponent_id])

  canva.width = window.innerWidth
  canva.height = window.innerHeight

  document.querySelector('#joyDiv').style.display = 'none'
  document.querySelector('#userInterface').style.display = 'block'
  document.querySelector('#dialogueBox').style.display = 'none'
  document.querySelector('#enemyHealthBar').style.width = '100%'
  document.querySelector('#playerHealthBar').style.width = '100%'
  document.querySelector('#attacksBox').replaceChildren()
  document.querySelector('#battleMyName').innerHTML = `me(${player.name})`
  document.querySelector(
    '#battleOpponentName'
  ).innerHTML = `opponent(${others[opponent_id].sprite.name})`

  if (!my_turn) {
    document.querySelector('#dialogueBox').style.display = 'block'
    document.querySelector('#dialogueBox').innerHTML = 'Wait For your turn'
  }

  const opponentUser = {
    image: others[opponent_id].baseImage,
    isEnemy: true,
    name: others[opponent_id].sprite.name,
    health: skillTypes[others[opponent_id].skillType].health,
    attacks: JSON.parse(
      JSON.stringify(skillTypes[others[opponent_id].skillType].atk)
    ),
    defenses: skillTypes[others[opponent_id].skillType].def,
  }
  opponent = new Monster(opponentUser)

  const myCharacter = {
    image: player.baseImage,
    isEnemy: false,
    name: player.name,
    health: skillTypes[mySkillType].health,
    attacks: JSON.parse(JSON.stringify(skillTypes[mySkillType].atk)),
    defenses: skillTypes[mySkillType].def,
  }
  myMonster = new Monster(myCharacter)

  renderedSprites = [opponent, myMonster]

  queue = []

  document.querySelector('#attacksBox').style[
    'grid-template-columns'
  ] = `repeat(${myMonster.attacks.length}, 1fr)`

  myMonster.attacks.forEach((attack, index) => {
    const button = document.createElement('button')
    button.id = `skill_button_${index}th`
    button.innerHTML = `
      ${attack.name}\n 
      (Atk: ${attack.atk})\n 
      (Cool: ${attack.left_cool_time})\n 
      (Left: ${attack.limit})
    `
    button.value = attack.value
    document.querySelector('#attacksBox').append(button)
  })

  // our event listeners for our buttons (attack)
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      clickSkillButton(e.currentTarget.value)
    })
  })
}

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else document.querySelector('#dialogueBox').innerHTML = 'Wait For your turn'
})

export function setOpponentId(id) {
  opponent_id = id
}
