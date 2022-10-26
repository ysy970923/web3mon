import { connectWallets } from '../web/logIn'
import { collisions } from '../game/data/collisions'
import { joyToKey } from '../game/interaction/move'
import { initBattle, animateBattle } from './battleScene'
import { battleZonesData } from '../game/data/battleZones'
import { charactersMapData } from '../game/data/characters'
import { Boundary } from '../game/object/Boundary'
import { Sprite } from '../game/object/Sprite'
import { others } from './network'
import { worker } from './utils'
import { rectangularCollision } from '../game/utils/checkCollision'
import * as nearAPI from 'near-api-js'
import { gsap } from 'gsap'
// import playerDownImages from '../../img/playerDown.png'

// 최초로 지갑 연결
connectWallets(nearAPI)

const image = new Image()
image.src = '../img/Pellet Town.png'

const foregroundImage = new Image()
foregroundImage.src = '../img/foregroundObjects.png'

// export const playerDownImage = playerDownImages

export const playerDownImage = new Image()
playerDownImage.src = '../img/playerDown.png'

export const canvas = document.querySelector('canvas')
export const canva = canvas.getContext('2d')

export const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

export const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

export const charactersMap = []
for (let i = 0; i < charactersMapData.length; i += 70) {
  charactersMap.push(charactersMapData.slice(i, 70 + i))
}

export const boundaries = []

export const offset = {
  x: window.innerWidth / 2 - 3360 / 2,
  y: window.innerHeight / 2 - 1920 / 2,
}
console.log('오프셋', offset)

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          type: 'collision',
        })
      )
  })
})

export const battleZones = []

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          type: 'battle',
        })
      )
  })
})

export const characters = []
const villagerImg = new Image()
villagerImg.src = '../img/villager/Idle.png'

const oldManImg = new Image()
oldManImg.src = '../img/oldMan/Idle.png'

charactersMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    // 1026 === villager
    if (symbol === 1026) {
      characters.push(
        new Sprite({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          image: villagerImg,
          frames: {
            max: 4,
            hold: 60,
          },
          scale: 3,
          animate: true,
        })
      )
    }
    // 1031 === oldMan
    else if (symbol === 1031) {
      characters.push(
        new Sprite({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          image: oldManImg,
          frames: {
            max: 4,
            hold: 60,
          },
          scale: 3,
        })
      )
    }

    if (symbol !== 0) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      )
    }
  })
})

export const player = new Sprite({
  position: {
    x: window.innerWidth / 2 - 192 / 4 / 2,
    y: window.innerHeight / 2 - 102 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: new Image(),
    left: new Image(),
    right: new Image(),
    down: new Image(),
  },
  name: '',
  direction: 0,
})

export const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
})

export const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
})

export const movables = [
  background,
  ...boundaries,
  foreground,
  ...battleZones,
  ...characters,
]

export const renderables = [
  background,
  ...boundaries,
  ...battleZones,
  ...characters,
  player,
  foreground,
]

export const battle = {
  initiated: false,
  ready: false,
}

export function global_position() {
  return {
    x: player.position.x - background.position.x,
    y: player.position.y - background.position.y,
  }
}

export function local_position(position) {
  return {
    x: position.x + background.position.x,
    y: position.y + background.position.y,
  }
}

export function checkCollision(a, b) {
  const overlappingArea =
    (Math.min(a.position.x + a.width, b.position.x + b.width) -
      Math.max(a.position.x, b.position.x)) *
    (Math.min(a.position.y + a.height, b.position.y + b.height) -
      Math.max(a.position.y, b.position.y))
  return (
    rectangularCollision({
      rectangle1: a,
      rectangle2: b,
    }) && overlappingArea > (a.width * a.height) / 10
  )
}

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

// Jaewon NPC 생성
const makeNPC = () => {
  others['250'] = {
    draw: false,
    collection: 'asac.near',
    skillType: 1,
    sprite: new Sprite({
      position: {
        x: battleZones[10].position.x,
        y: battleZones[10].position.y,
      },
      image: playerDownImage,
      frames: {
        max: 4,
        hold: 10,
      },
      sprites: {
        up: new Image(),
        left: new Image(),
        right: new Image(),
        down: new Image(),
      },
      name: 'jaewon.near (BOT)',
    }),
  }

  others['250'].baseImage = new Image()

  worker.postMessage({
    url: 'https://ipfs.io/ipfs/bafybeicj5zfhe3ytmfleeiindnqlj7ydkpoyitxm7idxdw2kucchojf7v4/129.png',
    contractAddress: 'asac.near',
    id: '250',
  })
}

makeNPC()
