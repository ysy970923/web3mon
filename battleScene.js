const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground2.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})
let opponent_id = null
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
                document.querySelector('#joyDiv').style.display = 'block'
                gsap.to('#overlappingDiv', {
                    opacity: 0
                })

                battle.initiated = false
                audio.Map.play()
            }
        })
        battle_start = false
    })
}

function initBattle() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.querySelector('#joyDiv').style.display = 'none'
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()
    document.querySelector('#battleMyName').innerHTML = `me(${player.name})`
    document.querySelector('#battleOpponentName').innerHTML = `opponent(${others[opponent_id].name})`
    if (!my_turn) {
        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = 'Wait For your turn'
    }

    var opponentMonster = {
        image: others[opponent_id].sprite.baseImage,
        isEnemy: true,
        name: others[opponent_id].sprite.name,
        health: others[opponent_id].health,
        attacks: others[opponent_id].attacks,
    }

    opponent = new Monster(opponentMonster)

    var myMonster = {
        image: player.baseImage,
        isEnemy: false,
        name: player.name,
        health: monsters[window.contractAddress].health,
        attacks: monsters[window.contractAddress].attacks,
    }
    me = new Monster(myMonster)
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
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else if (my_turn) e.currentTarget.style.display = 'none'
    else document.querySelector('#dialogueBox').innerHTML = 'Wait For your turn'
})
