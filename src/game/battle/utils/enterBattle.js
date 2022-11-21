import { gsap } from 'gsap'
import {
  initBattle,
  battleBackground,
  queue,
  renderedSprites,
} from '../../../js/battleScene'
import { battle } from '../../../js/index'

export let battleAnimationId

/**
 * battle animation start logic
 * @param {any} animationId idk
 */
export function enterBattle(animationId) {
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
