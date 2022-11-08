import { gsap } from 'gsap'
import { initBattle, animateBattle } from '../../../js/battleScene'
import { battle } from '../../../js/index'

export function enterBattle(animationId, id) {
  // deactivate current animation loop
  window.cancelAnimationFrame(animationId)

  battle.initiated = true
  gsap.to('#overlappingDiv', {
    opacity: 1,
    repeat: 3,
    yoyo: true,
    duration: 0.4,
    onComplete() {
      gsap.to('#overlappingDiv', {
        opacity: 1,
        duration: 0.4,
        onComplete() {
          // activate a new animation loop
          initBattle()
          animateBattle()
          gsap.to('#overlappingDiv', {
            opacity: 0,
            duration: 0.4,
          })
        },
      })
    },
  })
}
