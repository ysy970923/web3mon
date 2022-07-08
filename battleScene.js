const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})
let opponent_id
let draggle
let emby
let renderedSprites
let battleAnimationId
let queue
let my_turn = false

function attacked(attack) {
  queue.push(() => {
    draggle.attack({
      attack: draggle.attacks[attack],
      recipient: emby,
      renderedSprites
    })

    if (emby.health <= 0) {
      queue.push(() => {
        emby.faint()
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
  if (!my_turn) {
    document.querySelector('#dialogueBox').style.display = 'block'
    document.querySelector('#dialogueBox').innerHTML = 'Wait For your turn'
  }

  draggle = new Monster(monsters.Draggle)
  emby = new Monster(monsters.Emby)
  renderedSprites = [draggle, emby]
  queue = []

  emby.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attacksBox').append(button)
  })

  // our event listeners for our buttons (attack)
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites
      })
      attack(opponent_id, emby.attacks.indexOf(selectedAttack))

      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint()
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

animate()
connect()
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
