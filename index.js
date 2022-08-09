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

function clickOutSideEvent(e) {
    if (!document.getElementById('profileCard').contains(e.target)) {
        document.body.removeEventListener('click', clickOutSideEvent, true)
        document.getElementById('profileCard').style.display = 'none'
    }
}

document.getElementById('profileButton').addEventListener('click', (e) => {
    document.getElementById('profileCard').style.display = 'block'
    document.body.addEventListener('click', clickOutSideEvent, true)
})

function clickOutSideEvent1(e) {
    if (!document.getElementById('guidanceCard').contains(e.target)) {
        document.body.removeEventListener('click', clickOutSideEvent1, true)
        document.getElementById('guidanceCard').style.display = 'none'
    }
}

document.getElementById('guidanceButton').addEventListener('click', (e) => {
    document.getElementById('guidanceCard').style.display = 'block'
    document.body.addEventListener('click', clickOutSideEvent1, true)
})

document.getElementById('closeResultBtn').addEventListener('click', (e) => {
    document.getElementById('battleResultCard').style.display = 'none'
})

// click opponent to offer battle
canvas.addEventListener('click', (e) => {
    // need to be ready and not currently battling
    if (!battle.ready || battle.initiated)
        return
    for (const key in others) {
        var x = e.offsetX - others[key].sprite.width / 2
        var y = e.offsetY - others[key].sprite.height / 2
        if ((others[key].sprite.position.x - x) ** 2 + (others[key].sprite.position.y - y) ** 2 < 900) {
            for (let i = 0; i < battleZones.length; i++) {
                const battleZone = battleZones[i]
                if (checkCollision(others[key].sprite, battleZone)) {
                    document.getElementById('acceptBattleBtn').style.display = 'inline-block'
                    document.getElementById('refuseBattleBtn').style.display = 'inline-block'
                    document.getElementById('acceptBattleBtn').replaceWith(document.getElementById('acceptBattleBtn').cloneNode(true));
                    document.getElementById('refuseBattleBtn').replaceWith(document.getElementById('refuseBattleBtn').cloneNode(true));

                    document.getElementById('acceptBattleCard').style.display = 'block'
                    document.getElementById('battleOpponentName2').innerText = 'Opponent: ' + others[key].sprite.name
                    document.getElementById('acceptBattleBtn').addEventListener('click', (e) => {
                        if (key == 250) {
                            opponent_id = key
                            battle_start = true
                            my_turn = true
                        }
                        else {
                            document.getElementById('battleOpponentName2').innerText = 'Waiting for accpetance...'
                            document.getElementById('acceptBattleBtn').style.display = 'none'
                            document.getElementById('refuseBattleBtn').style.display = 'none'
                            battleOffer(key)
                        }
                    })
                    document.getElementById('refuseBattleBtn').addEventListener('click', (e) => {
                        document.getElementById('acceptBattleCard').style.display = 'none'
                    })
                    break
                }
            }
            break
        }
    }
})

function truncate(input, length) {
    if (input.length > length) {
        return input.substring(0, length) + '...'
    }
    return input
}

let playerUrl
let tokenId

document.getElementById('joinGame').addEventListener('click', (e) => {
    initContract().then(() => {
        tokenId = document.getElementById('tokenId').value
        window.contract.nft_token({ token_id: tokenId }).then((msg) => {
            if (msg === null) {
                window.alert('invalid token id')
                return
            }
            player.name = truncate(msg.owner_id, 20)
            if (msg.metadata.media.includes('https://'))
                playerUrl = msg.metadata.media
            else playerUrl = window.metadata.base_uri + '/' + msg.metadata.media
            document.getElementById('chatOpenBtn').style.display = 'block'
            document.getElementById('loginDiv').style.display = 'none'
            document.getElementById('profileName').innerHTML =
                window.metadata.name + ' #' + (Number(msg.metadata.title) + 1)
            document.getElementById('profileNFT').innerHTML = player.name
            document.getElementById('profileImg').src = playerUrl
            document.getElementById('profileHP').innerHTML =
                'HP: ' + monsters[window.contractAddress].health
            document.getElementById('profileAP').innerHTML =
                'AP: ' + monsters[window.contractAddress].attacks[0].damage
            document.getElementById('parasUrl').addEventListener('click', (e) => {
                window
                    .open(
                        `https://paras.id/token/${window.contract.contractId}::${msg.token_id}/${msg.token_id}`,
                        '_blank'
                    )
                    .focus()
            })
            makeChracterImage(playerUrl, player).then((res) => {
                document.getElementById('loading').style.display = 'none'
                animate()
                connect()
            })
        })
    })
})

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

window.addEventListener('resize', onResizeEvent, true)
function onResizeEvent() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    var delta_x = canvas.width / 2 - 192 / 4 / 2 - player.position.x
    var delta_y = canvas.height / 2 - 68 / 2 - player.position.y
    renderables.forEach((renderable) => {
        renderable.position.x = renderable.position.x + delta_x
        renderable.position.y = renderable.position.y + delta_y
    })
    for (const key in others) {
        others[key].sprite.position.x = others[key].sprite.position.x + delta_x
        others[key].sprite.position.y = others[key].sprite.position.y + delta_y
    }
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

makeChracterImage("https://ipfs.io/ipfs/bafybeicj5zfhe3ytmfleeiindnqlj7ydkpoyitxm7idxdw2kucchojf7v4/129.png", others['250'].sprite)

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

var joyStickMoving = false
function joyToKey() {
    var x = joy.GetX()
    var y = joy.GetY()
    var moving = false
    if (y > 45) {
        keys.w.pressed = true
        lastKey = 'w'
        moving = true
    } else if (y < -45) {
        keys.s.pressed = true
        lastKey = 's'
        moving = true
    } else if (x > 45) {
        keys.d.pressed = true
        lastKey = 'd'
        moving = true
    } else if (x < -45) {
        keys.a.pressed = true
        lastKey = 'a'
        moving = true
    } else if (joyStickMoving) {
        keys.w.pressed = false
        keys.a.pressed = false
        keys.s.pressed = false
        keys.d.pressed = false
        joyStickMoving = false
    }
    joyStickMoving = moving
}

let clicked = false
addEventListener('click', () => {
    if (!clicked) {
        audio.Map.play()
        clicked = true
    }
})
