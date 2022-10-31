import { Sprite } from './Sprite'
import { gsap } from 'gsap'
import { my_turn } from '../battle/utils'

export class Monster extends Sprite {
  constructor({
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    name,
    health,
    isEnemy,
    attacks,
  }) {
    var position
    if (isEnemy)
      position = {
        x: 650,
        y: 100,
      }
    else
      position = {
        x: 250,
        y: 305,
      }
    super({
      position,
      image,
      frames,
      sprites,
      animate,
      rotation,
      name,
    })
    this.initialHealth = health
    this.health = health
    this.isEnemy = isEnemy
    this.attacks = attacks
  }

  faint() {
    document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted!'
    gsap.to(this.position, {
      y: this.position.y + 20,
    })
    gsap.to(this, {
      opacity: 0,
    })
  }

  attack({ attack, recipient, renderedSprites }) {
    document.querySelector('#dialogueBox').style.display = 'block'
    document.querySelector('#dialogueBox').innerHTML =
      this.name + ' used ' + attack.name

    setTimeout(() => {
      if (my_turn) document.querySelector('#dialogueBox').style.display = 'none'
    }, 2000)

    let healthBar = '#enemyHealthBar'
    if (this.isEnemy) healthBar = '#playerHealthBar'

    let rotation = 1
    if (this.isEnemy) rotation = -2.2
    recipient.health -= attack.atk
    switch (attack.effect) {
      case 'Fireball':
        var fireballImage = new Image()
        fireballImage.src = './img/fireball.png'
        var fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation,
        })
        renderedSprites.splice(1, 0, fireball)

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            // Enemy actually gets hit
            gsap.to(healthBar, {
              width: (100 * recipient.health) / recipient.initialHealth + '%',
            })

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            })

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            })
            renderedSprites.splice(1, 1)
          },
        })
        break

      case 'Larva':
        var larvaImage = new Image()
        larvaImage.src = './img/draggleSprite.png'
        var larva = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: larvaImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation,
        })
        renderedSprites.splice(1, 0, larva)

        gsap.to(larva.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            // Enemy actually gets hit
            gsap.to(healthBar, {
              width: (100 * recipient.health) / recipient.initialHealth + '%',
            })

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            })

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            })
            renderedSprites.splice(1, 1)
          },
        })
        break

      case 'Tackle':
        var tl = gsap.timeline()

        var movementDistance = 20
        if (this.isEnemy) movementDistance = -20

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              // Enemy actually gets hit
              gsap.to(healthBar, {
                width: (100 * recipient.health) / recipient.initialHealth + '%',
              })

              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              })

              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              })
            },
          })
          .to(this.position, {
            x: this.position.x,
          })
        break
    }
  }
}
