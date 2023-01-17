import { Sprite } from './Sprite'
import { gsap } from 'gsap'
import { my_attack } from '../battle/utils'
import { MonsterSkillType } from './objectType'

var larvaImage = new Image()
larvaImage.src = '../.././img/draggleSprite.png'

var fireballImage = new Image()
fireballImage.src = '../.././img/fireball.png'

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
    skills,
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
    this.skills = skills
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

  /** 공격 : 공격의 종류, 공격 받는 사람, 배틀에 참여중인 sprites */
  action({ action, opponent, renderedSprites, health }) {
    let healthBar = '#playerHealthBar'
    if (this.isEnemy) healthBar = '#enemyHealthBar'

    this.health = health
    gsap.to(healthBar, {
      width: (100 * this.health) / this.initialHealth + '%',
    })

    let rotation = 1
    if (this.isEnemy) rotation = -2.2

    switch (action.name) {
      case MonsterSkillType.DEATH_SPIRAL:
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
          name: MonsterSkillType.DEATH_SPIRAL,
        })
        renderedSprites.splice(1, 0, fireball)

        gsap.to(fireball.position, {
          x: opponent.position.x,
          y: opponent.position.y,
          onComplete: () => {
            renderedSprites.splice(1, 1)
          },
        })
        break

      case MonsterSkillType.CELSIUS_EXPLOSION:
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
          name: MonsterSkillType.CELSIUS_EXPLOSION,
        })
        renderedSprites.splice(1, 0, larva)

        gsap.to(larva.position, {
          x: opponent.position.x,
          y: opponent.position.y,
          onComplete: () => {
            renderedSprites.splice(1, 1)
          },
        })
        break

      case MonsterSkillType.BLOCK_OF_FUD:
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
              gsap.to(opponent.position, {
                x: opponent.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              })

              gsap.to(opponent, {
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
      case 'Shield':
        // const shieldImage = new Image()
        // shieldImage.src = './img/shield.png'
        // const shield = new Sprite({
        //   position: {
        //     x: this.position.x,
        //     y: this.position.y,
        //   },
        //   image: shieldImage,
        //   frames: {
        //     max: 21,
        //     hold: 5,
        //   },
        //   animate: true,
        // })
        // renderedSprites.splice(1, 0, shield)
        // setTimeout(() => {
        //   renderedSprites.splice(1, 1)
        // }, 2000)
        break
    }
  }
}

const attackGaspAnimation = (healthBar, renderedSprites, recipient) => {
  return {
    x: recipient.position.x,
    y: recipient.position.y,
    onComplete: () => {
      // Enemy actually gets hit
      console.log(recipient.health)
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
  }
}
