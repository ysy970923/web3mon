const image = new Image()
image.src = './img/Pellet Town.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

var joy = new JoyStick('joyDiv')

function truncate(input, length) {
    if (input.length > length) {
        return input.substring(0, length) + '...'
    }
    return input
}

let playerUrl
let tokenId

connectWallet()

canvas.width = window.innerWidth
canvas.height = window.innerHeight

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
    x: window.innerWidth / 2 - 3360 / 2,
    y: window.innerHeight / 2 - 1920 / 2
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

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 102 / 2
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
    },
    name: ''
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
    initiated: false,
    ready: false,
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
        }) && overlappingArea > (a.width * a.height) / 10
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

others['250'] = {
    collection: "asac.near",
    health: monsters["asac.near"].health,
    attacks: monsters["asac.near"].attacks,
    sprite: new Sprite({
        position: { x: battleZones[10].position.x, y: battleZones[10].position.y },
        image: playerDownImage,
        frames: {
            max: 4,
            hold: 10
        },
        sprites: {
            up: playerDownImage,
            left: playerLeftImage,
            right: playerRightImage,
            down: playerDownImage
        },
        name: "jaewon.near (BOT)"
    })
}

makeChracterImage("https://ipfs.io/ipfs/bafybeicj5zfhe3ytmfleeiindnqlj7ydkpoyitxm7idxdw2kucchojf7v4/129.png", others['250'].sprite, 'asac.near')

function animate() {
    const animationId = window.requestAnimationFrame(animate)
    renderables.forEach((renderable) => {
        renderable.draw()
    })
    if (animationId % 600 < 200)
        others['250'].sprite.chat = 'Come in'
    else if (animationId % 600 < 400)
        others['250'].sprite.chat = 'Battle Zone'
    else
        others['250'].sprite.chat = 'Click Me!'
    for (const key in others) {
        others[key].sprite.draw()
    }
    joyToKey()
    let moving = true
    player.animate = false

    let rotation = 0

    if (battle.initiated) return

    if (battle_start) {
        battle_start = false
        document.getElementById('acceptBattleCard').style.display = 'none'
        enterBattle(animationId)
    }

    if (document.getElementById('myForm').style.display !== 'none') return

    // enable to battle with others
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        battle.ready = false
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            if (checkCollision(player, battleZone)) {
                battle.ready = true
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
                others[key].sprite.position.y += 3
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
                others[key].sprite.position.x += 3
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
                others[key].sprite.position.y -= 3
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
                others[key].sprite.position.x -= 3
            }
    }
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed)
        if (moving) moveUser(global_position(), rotation)
}
// animate()