import { animate } from '../game/animate'
import { Sprite } from '../game/object/Sprite'
import { others, attack } from './network'
import { skillTypes } from '../game/battle/utils/skillSets'
import { player, canva, battle } from './index'
import { Monster } from '../game/object/Monster'
import { gsap } from 'gsap'
import {
  mySkillType,
  setBattleStart,
  my_turn,
  setMyTurn,
} from '../game/battle/utils'

const battleBackgroundImage = new Image()
battleBackgroundImage.src = '../img/battleBackground2.png'

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
})

export let opponent_id = null
let opponent
let me
let renderedSprites
let battleAnimationId
export let queue

//
// Methods
//

export function attacked(attack) {
  queue.push(() => {
    opponent.attack({
      attack: opponent.attacks[attack],
      recipient: me,
      renderedSprites,
    })
    setMyTurn(true)

    if (me.health <= 0) {
      queue.push(() => {
        me.faint()
      })

      endBattle('LOSE')
    }
  })
}

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

export function initBattle() {
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

  me = new Monster(myCharacter)

  renderedSprites = [opponent, me]

  queue = []

  document.querySelector('#attacksBox').style[
    'grid-template-columns'
  ] = `repeat(${me.attacks.length}, 1fr)`

  me.attacks.forEach((attack, index) => {
    const button = document.createElement('button')

    button.id = `skill_button_${index}th`
    button.innerHTML = `
      ${attack.name}\n 
      (Atk: ${attack.atk})\n 
      (Cool: ${attack.left_cool_time})\n 
      (Left: ${attack.limit})
    `

    button.value = index

    document.querySelector('#attacksBox').append(button)
  })

  // our event listeners for our buttons (attack)
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      clickSkillButton(e.currentTarget.value)
    })
  })
}

const checkCanUserSkill = (selectedAttack) => {
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

const clickSkillButton = (skillValue) => {
  if (!my_turn) return

  const selectedAttack = me.attacks[skillValue]

  if (!checkCanUserSkill(selectedAttack)) {
    return
  }

  setMyTurn(false)

  me.attack({
    attack: selectedAttack,
    recipient: opponent,
    renderedSprites,
  })

  me.attacks.forEach((attack) => {
    // 한번 공격했으니 전체 쿨타임 1씩 감소
    if (attack.left_cool_time > 0) attack.left_cool_time -= 1
  })

  // 사용한 공격의 사용 가능 횟수 1 감수
  selectedAttack.limit -= 1
  selectedAttack.left_cool_time = selectedAttack.cool_time

  Array.from(document.querySelector('#attacksBox').childNodes).forEach(
    (button, index) => {
      const attack = me.attacks[index]
      button.innerHTML = `${attack.name}\n (Cool: ${attack.left_cool_time})\n (Left: ${attack.limit})`
    }
  )

  // 250 is NPC
  if (opponent_id == 250) {
    setTimeout(() => {
      if (Math.random() < 0.5) attacked(0)
      else attacked(1)
    }, 3000)
  } else attack(opponent_id, me.attacks.indexOf(selectedAttack))

  // 내가 이긴 경우
  if (opponent.health <= 0) {
    queue.push(() => {
      opponent.faint()
    })
    endBattle('WIN')
  }
}

export function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)

  battleBackground.draw()

  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  }

  renderedSprites.forEach((sprite) => {
    sprite.draw()
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
