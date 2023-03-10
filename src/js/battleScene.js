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
  my_attack,
  setMyTurn,
} from '../game/battle/utils'
import { clickSkillButton } from '../game/battle/attack'
import { playerUrl } from '../web/logIn'

const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/Beach sunset.jpg'

export const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
})

export let opponent_id = null
export let opponent
export let myMonster
export let renderedSprites
export let queue

/** 공격이 들어와서 내가 공격을 받음 */
export function renderState(data) {
  document.querySelector('#dialogueBox').style.display = 'block'
  document.querySelector('#dialogueBox').innerHTML =
    myMonster.name +
    ' used ' +
    data.actions[data.my_index].name +
    '\n' +
    opponent.name +
    ' used ' +
    data.actions[1 - data.my_index].name
  setTimeout(() => {
    document.querySelector('#dialogueBox').style.display = 'none'
  }, 2000)

  myMonster.action({
    action: data.actions[data.my_index],
    opponent: opponent,
    renderedSprites,
    health: data.battleState.player_state[data.my_index].hp,
  })

  opponent.action({
    action: data.actions[1 - data.my_index],
    opponent: myMonster,
    renderedSprites,
    health: data.battleState.player_state[1 - data.my_index].hp,
  })

  if (myMonster.health <= 0) {
    myMonster.faint()
    endBattle('LOSE')
  }
  // 내가 이긴 경우
  else if (opponent.health <= 0) {
    opponent.faint()
    endBattle('WIN')
  }

  document.querySelector('#attacksBox').innerHTML = ''
  if (window.battle.isMyAttack()) {
    myMonster.skills.slice(0, 3).forEach((attack, index) => {
      const button = document.createElement('button')
      button.id = `skill_button_${index}th`

      button.innerHTML = insertButton(attack)

      button.value = index
      document.querySelector('#attacksBox').append(button)
    })

    // our event listeners for our buttons (attack)
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', (e) => {
        clickSkillButton(e.currentTarget.value)
      })
    })
  } else {
    myMonster.skills.slice(3, 6).forEach((defense, index) => {
      const button = document.createElement('button')
      button.id = `skill_button_${index}th`

      button.innerHTML = insertButton(defense)

      button.value = index + 3
      document.querySelector('#attacksBox').append(button)
    })

    // our event listeners for our buttons (attack)
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', (e) => {
        clickSkillButton(e.currentTarget.value)
      })
    })
  }
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

  //   if (!my_attack) {
  // document.querySelector('#dialogueBox').style.display = 'block'
  // document.querySelector('#dialogueBox').innerHTML = 'Wait For your turn'
  //   }
  var battleState = window.battle.data.battleState
  const opponentUser = {
    image: others[opponent_id].baseImage,
    isEnemy: true,
    name: others[opponent_id].sprite.name,
    health: battleState.player_state[1 - window.battle.data.my_index].hp,
    skills: battleState.player_state[1 - window.battle.data.my_index].skills,
  }
  opponent = new Monster(opponentUser)

  const myCharacter = {
    image: player.baseImage,
    isEnemy: false,
    name: player.name,
    health: battleState.player_state[window.battle.data.my_index].hp,
    skills: battleState.player_state[window.battle.data.my_index].skills,
  }
  myMonster = new Monster(myCharacter)
  console.log(battleState)

  renderedSprites = [opponent, myMonster]

  queue = []

  enterImageAnimation()

  document.querySelector('#attacksBox').style[
    'grid-template-columns'
  ] = `repeat(3, 1fr)`
  if (window.battle.isMyAttack()) {
    myMonster.skills.slice(0, 3).forEach((attack, index) => {
      const button = document.createElement('button')
      button.id = `skill_button_${index}th`

      button.innerHTML = insertButton(attack)

      button.value = index
      document.querySelector('#attacksBox').append(button)
      console.log(document.querySelector('#attacksBox'))
    })

    // our event listeners for our buttons (attack)
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', (e) => {
        clickSkillButton(e.currentTarget.value)
      })
    })
  } else {
    myMonster.skills.slice(3, 6).forEach((defense, index) => {
      const button = document.createElement('button')
      button.id = `skill_button_${index}th`

      button.innerHTML = insertButton(defense)

      button.value = index + 3
      document.querySelector('#attacksBox').append(button)
    })

    // our event listeners for our buttons (attack)
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', (e) => {
        clickSkillButton(e.currentTarget.value)
      })
    })
  }
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

const enterImageAnimation = () => {
  document.getElementById('enter_img').src = playerUrl
  document.getElementById('enter_collection').innerText = player.name
  document.getElementById('enter_name').innerText = player.name
  document.getElementById('enter_exterior').innerText = player.name
  //   document.getElementById(
  //     'enter_atk'
  //   ).innerText = `${myMonster.skills[0].atk} atk`
  //   document.getElementById(
  //     'enter_def'
  //   ).innerText = `${myMonster.skills[3].def} def`
  //   document.getElementById(
  //     'enter_health'
  //   ).innerText = `${myMonster.health} health`

  console.log('열리는 실행')
  document.querySelector('#battle_enter').style.transition = 'all 0s ease-out'
  document.querySelector('#battle_enter').style.opacity = 1
  document.querySelector('#battle_enter').style.zIndex = 1000
  setTimeout(() => {
    console.log('닫히는게 실행')
    document.querySelector('#battle_enter').style.transition =
      'all 1.2s ease-out'
    document.querySelector('#battle_enter').style.opacity = 0
    document.querySelector('#battle_enter').style.zIndex = -5
  }, 5000)
}

export function insertButton(action) {
  if (action.name === 'Fireball')
    return `<div class="game_skill_btn">
          <img src="../.././img/battle/fireball_icon.png" style="height: 90px; object-fit: contain;">
          <div class="skill_button_desc">
            <div class="skill_desc">
                <p class="skill_name">${action.name}</p><p>atk: ${action.atk}<br>left: ${action.remains}<br>critical: ${action.critical_prob}%</p></p>
            </div>
          </div>
        </div>`
  else if (action.name === 'Lightning')
    return `<div class="game_skill_btn"><img src=".././img/battle/lightning_icon.jpg" style="height: 90px; object-fit: contain;">
          <div class="skill_button_desc">
            <div class="skill_desc">
                <p class="skill_name">${action.name}</p><p>atk: ${action.atk}<br>left: ${action.remains}<br>critical: ${action.critical_prob}%</p></p>
            </div>
          </div>
      </div>`
  else if (action.name === 'Default')
    return `<div class="game_skill_btn"><img src=".././img/battle/punch_icon.png" style="height: 90px; object-fit: contain;">
          <div class="skill_button_desc">
            <div class="skill_desc">
                <p class="skill_name">${action.name}</p><p>atk: ${action.atk}<br>left: ${action.remains}<br>critical: ${action.critical_prob}%</p></p>
            </div>
          </div>
      </div>`
  else
    return `<div class="game_skill_btn"><img src=".././img/battle/punch_icon.png" style="height: 90px; object-fit: contain;">
                <div class="skill_button_desc">
                    <div class="skill_desc">
                    <p class="skill_name">${action.name}</p><p>def: ${action.def}<br>left: ${action.remains}<br>reflection: ${action.reflection_prob}%</p></p>
                    </div>
                </div>
          </div>`
}
