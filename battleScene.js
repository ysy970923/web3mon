const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground2.png'
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})
let opponent_id
let opponent
let me
let renderedSprites
let battleAnimationId
let queue
let my_turn = false

function attacked(attack) {
  queue.push(() => {
    opponent.attack({
      attack: opponent.attacks[attack],
      recipient: me,
      renderedSprites
    })

    if (me.health <= 0) {
      queue.push(() => {
        me.faint()
      })

      endBattle()
    }
  })
}

function endBattle() {
  queue.push(() => {
    // fade back to black
    gsap.to('#overlappingDiv', {
      opacity: 1,
      onComplete: () => {
        cancelAnimationFrame(battleAnimationId)
        animate()
        document.querySelector('#userInterface').style.display = 'none'

        gsap.to('#overlappingDiv', {
          opacity: 0
        })

        battle.initiated = false
        audio.Map.play()
      }
    })
  })
}

function initBattle() {
  document.querySelector('#userInterface').style.display = 'block'
  document.querySelector('#dialogueBox').style.display = 'none'
  document.querySelector('#enemyHealthBar').style.width = '100%'
  document.querySelector('#playerHealthBar').style.width = '100%'
  document.querySelector('#attacksBox').replaceChildren()
  document.querySelector('#battleMyName').innerHTML = player.name
  document.querySelector('#battleOpponentName').innerHTML = others[opponent_id].name
  if (!my_turn) {
    document.querySelector('#dialogueBox').style.display = 'block'
    document.querySelector('#dialogueBox').innerHTML = 'Wait For your turn'
  }

  opponent = new Monster(monsters.opponent)
  opponent.image = others[opponent_id].image
  opponent.health = others[opponent_id].health
  opponent.name = others[opponent_id].name
  opponent.scale = 1.5
  me = new Monster(monsters.me)
  me.scale = 1.5
  renderedSprites = [opponent, me]
  queue = []

  me.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attacksBox').append(button)
  })

  // our event listeners for our buttons (attack)
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      if (!my_turn) return
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      me.attack({
        attack: selectedAttack,
        recipient: opponent,
        renderedSprites
      })
      attack(opponent_id, me.attacks.indexOf(selectedAttack))

      if (opponent.health <= 0) {
        queue.push(() => {
          opponent.faint()
        })
        endBattle()
      }
    })

    button.addEventListener('mouseenter', (e) => {
      // console.log("sadf")
      //   const selectedAttack = attacks[e.currentTarget.innerHTML]
      //   document.querySelector('#attackType').innerHTML = selectedAttack.type
      //   document.querySelector('#attackType').style.color = selectedAttack.color
    })
  })
}
function animateBattle() {
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
// initBattle()
// animateBattle()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
  console.log('hhh')
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else if (my_turn) e.currentTarget.style.display = 'none'
  else document.querySelector('#dialogueBox').innerHTML = 'Wait For your turn'
})
