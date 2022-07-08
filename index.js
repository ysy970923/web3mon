const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
document.getElementById('login').addEventListener('click', (e) => {
  const url = document.getElementById('url').value
  document.getElementById('loginDiv').style.display = 'none'
  makeChracter(url)
})

function makeChracter(url) {
  const imageUrl = url

  // handlers for before and after image elements
//   const before = document.querySelector('#before img')
//   const afterCrop = document.querySelector('#afterCrop img')

//   load image for original container element
//   before.src = imageUrl

  Jimp.read({
    url: imageUrl
  })
    .then((image) => {
      const backgroundColor = image.getPixelColor(0, 0)
      const targetColor = Jimp.intToRGBA(backgroundColor)
      // const targetColor = { r: 60, g: 171, b: 118, a: 255 } // Color you want to replace
      const replaceColor = { r: 0, g: 0, b: 0, a: 0 } // Color you want to replace with
      const colorDistance = (c1, c2) =>
        Math.sqrt(
          Math.pow(c1.r - c2.r, 2) +
            Math.pow(c1.g - c2.g, 2) +
            Math.pow(c1.b - c2.b, 2) +
            Math.pow(c1.a - c2.a, 2)
        ) // Distance between two colors
      const threshold = 32 // Replace colors under this threshold. The smaller the number, the more specific it is.
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        const thisColor = {
          r: image.bitmap.data[idx + 0],
          g: image.bitmap.data[idx + 1],
          b: image.bitmap.data[idx + 2],
          a: image.bitmap.data[idx + 3]
        }
        if (colorDistance(targetColor, thisColor) <= threshold) {
          image.bitmap.data[idx + 0] = replaceColor.r
          image.bitmap.data[idx + 1] = replaceColor.g
          image.bitmap.data[idx + 2] = replaceColor.b
          image.bitmap.data[idx + 3] = replaceColor.a
        }
      })
      image = image.crop(200, 200, 48 * 23, 48 * 23)
      image = image.resize(48, 48)
      Jimp.read({ url: './img/playerDown.png' }).then((playerImg) => {
        playerImg = playerImg.composite(image, 0, 0)
        playerImg = playerImg.composite(image, 48, 0)
        playerImg = playerImg.composite(image, 48 * 2, 0)
        playerImg = playerImg.composite(image, 48 * 3, 0)

        playerImg.getBase64('image/png', (err, res) => {
        //   afterCrop.src = res
        playerDownImage.src = res
        player.image = player.sprites.down
        console.log(res)
        })
      })
    })
    .catch((error) => {
      console.log(`Error loading image -> ${error}`)
    })
}

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const charactersMap = []
for (let i = 0; i < charactersMapData.length; i += 70) {
  charactersMap.push(charactersMapData.slice(i, 70 + i))
}
console.log(charactersMap)

const boundaries = []
const offset = {
  x: -735,
  y: -650
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          type: 'collision'
        })
      )
  })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          type: 'battle'
        })
      )
  })
})

const characters = []
const villagerImg = new Image()
villagerImg.src = './img/villager/Idle.png'

const oldManImg = new Image()
oldManImg.src = './img/oldMan/Idle.png'

charactersMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    // 1026 === villager
    if (symbol === 1026) {
      characters.push(
        new Sprite({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          image: villagerImg,
          frames: {
            max: 4,
            hold: 60
          },
          scale: 3,
          animate: true
        })
      )
    }
    // 1031 === oldMan
    else if (symbol === 1031) {
      characters.push(
        new Sprite({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          image: oldManImg,
          frames: {
            max: 4,
            hold: 60
          },
          scale: 3
        })
      )
    }

    if (symbol !== 0) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
    }
  })
})

const image = new Image()
image.src = './img/Pellet Town.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './img/new.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage
  }
})

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImage
})

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

const movables = [
  background,
  ...boundaries,
  foreground,
  ...battleZones,
  ...characters
]
const renderables = [
  background,
  ...boundaries,
  ...battleZones,
  ...characters,
  player,
  foreground
]

const battle = {
  initiated: false
}

function global_position() {
  return {
    x: player.position.x - background.position.x,
    y: player.position.y - background.position.y
  }
}

function local_position(position) {
  return {
    x: position.x + background.position.x,
    y: position.y + background.position.y
  }
}

function checkCollision(a, b) {
  const overlappingArea =
    (Math.min(a.position.x + a.width, b.position.x + b.width) -
      Math.max(a.position.x, b.position.x)) *
    (Math.min(a.position.y + a.height, b.position.y + b.height) -
      Math.max(a.position.y, b.position.y))
  return (
    rectangularCollision({
      rectangle1: a,
      rectangle2: b
    }) &&
    overlappingArea > (a.width * a.height) / 2 &&
    Math.random() < 0.5
  )
}

function enterBattle(animationId, id) {
  // deactivate current animation loop
  window.cancelAnimationFrame(animationId)

  audio.Map.stop()
  audio.initBattle.play()
  audio.battle.play()

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
            duration: 0.4
          })
        }
      })
    }
  })
}

function animate() {
  const animationId = window.requestAnimationFrame(animate)
  renderables.forEach((renderable) => {
    renderable.draw()
  })
  for (const key in others) {
    others[key].draw()
  }
  let moving = true
  player.animate = false

  let rotation = 0

  if (battle.initiated) return

  if (battle_start) {
    battle_start = false
    enterBattle(animationId)
  }

  // activate a battle
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i]
      if (checkCollision(player, battleZone)) {
        for (const key in others) {
          if (checkCollision(others[key], battleZone)) {
            battleOffer(key)
            break
          }
        }
        break
      }
    }
  }

  if (keys.w.pressed && lastKey === 'w') {
    player.animate = true
    player.image = player.sprites.up
    rotation = 0

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 0, y: 3 }
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3
      })
    if (moving)
      for (const key in others) {
        others[key].position.y += 3
      }
  } else if (keys.a.pressed && lastKey === 'a') {
    player.animate = true
    player.image = player.sprites.left
    rotation = 1

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 3, y: 0 }
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3
      })
    if (moving)
      for (const key in others) {
        others[key].position.x += 3
      }
  } else if (keys.s.pressed && lastKey === 's') {
    player.animate = true
    player.image = player.sprites.down
    rotation = 2

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 0, y: -3 }
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3
      })
    if (moving)
      for (const key in others) {
        others[key].position.y -= 3
      }
  } else if (keys.d.pressed && lastKey === 'd') {
    player.animate = true
    player.image = player.sprites.right
    rotation = 3

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: -3, y: 0 }
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3
      })
    if (moving)
      for (const key in others) {
        others[key].position.x -= 3
      }
  }
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed)
    if (moving)
      if (ws)
        if (ws.readyState === WebSocket.OPEN) {
          moveUser(global_position(), rotation)
        }
}
// animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break

    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break

    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
})

let clicked = false
addEventListener('click', () => {
  if (!clicked) {
    audio.Map.play()
    clicked = true
  }
})
