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