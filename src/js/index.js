import { connectWallets } from '../web/logIn'
import { collisions } from '../game/data/collisions'
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
import { background, foreground } from '../game/data/map'
import { clickEvent } from '../game/battle/battleStart'

// 최초로 지갑 연결
// connectWallets(nearAPI)

// export const playerDownImage = playerDownImages

export let stopAllPlay = false
export const setStopAllPlay = (bol) => {
  stopAllPlay = bol
}

export const playerDownImage = new Image()
playerDownImage.src = '../img/playerDown.png'

export const canvas = document.querySelector('canvas')
clickEvent()
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

export let movables = [
  background,
  ...boundaries,
  foreground,
  ...battleZones,
  ...characters,
]

export let renderables = [
  background,
  ...boundaries,
  ...battleZones,
  ...characters,
  player,
  foreground,
]

export const setMovables = (mova) => {
  movables = mova
}
export const setRenderables = (rend) => {
  renderables = rend
}

export const battle = {
  initiated: false,
  ready: true,
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
initalSetting()

function initalSetting() {
  document.getElementById('map_identifier').innerText =
    'MAIN map : you cannot fight here!'
}
