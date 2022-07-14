const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
// battleBackgroundImage.src = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f18eec73-a0af-43fe-a42a-9cce3f729e08/ddpvmlj-e8f6414c-5133-42bf-a713-db075029df20.png/v1/fill/w_400,h_225,q_80,strp/battlebgroute_by_aveontrainer_ddpvmlj-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1IiwicGF0aCI6IlwvZlwvZjE4ZWVjNzMtYTBhZi00M2ZlLWE0MmEtOWNjZTNmNzI5ZTA4XC9kZHB2bWxqLWU4ZjY0MTRjLTUxMzMtNDJiZi1hNzEzLWRiMDc1MDI5ZGYyMC5wbmciLCJ3aWR0aCI6Ijw9NDAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.q3QK6V-gVEz13QwGro2Wm1xclQweqWgMX27ywimSwwQ'
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
        others[opponent_id].position = { x: 0, y: 0 }
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

  opponent = new Monster(monsters.opponent)
  opponent.image = others[opponent_id].image
  opponent.name = others[opponent_id].name
  me = new Monster(monsters.me)
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
