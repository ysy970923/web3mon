var ws = null
var myID = null
var peerConnection = null
var webcamStream = null
var targetID = null
var others = {}
var battle_start = false

//0 ~ 9: binary; 10 ~: JSON string
var NumToType = {
    0: 'id',
    1: 'update-user-list',
    2: 'move-user',
    3: 'send-chat',
    4: 'stop-user',

    10: 'battle-offer',
    11: 'battle-answer',
    12: 'attack',
    13: 'request-user-info',
    14: 'response-user-info',
    15: 'leave-battle',
    16: 'battle-deny'
}

var reverseMapping = (o) =>
    Object.keys(o).reduce(
        (r, k) => Object.assign(r, { [o[k]]: (r[o[k]] || []).concat(k) }),
        {}
    )

var TypeToNum = reverseMapping(NumToType)

function checkOrReconnect() {
    if (!ws) {
        connect()
        return false
    }
    if (ws.readyState === WebSocket.CONNECTING)
        return false

    if (ws.readyState === WebSocket.OPEN) {
        return true
    }
    connect()
    return false
}

function moveUser(pos, rot) {
    if (!checkOrReconnect()) return
    var buffer = new ArrayBuffer(9)
    var dataview = new DataView(buffer)
    dataview.setInt8(0, TypeToNum['move-user'])
    dataview.setInt16(1, myID)
    dataview.setInt16(3, Number.parseInt(pos.x))
    dataview.setInt16(5, Number.parseInt(pos.y))
    dataview.setInt16(7, Number.parseInt(rot))
    ws.send(buffer)
}

function stopUser(pos) {
    if (!checkOrReconnect()) return
    var buffer = new ArrayBuffer(7)
    var dataview = new DataView(buffer)
    dataview.setInt8(0, TypeToNum['stop-user'])
    dataview.setInt16(1, myID)
    dataview.setInt16(3, Number.parseInt(pos.x))
    dataview.setInt16(5, Number.parseInt(pos.y))
    ws.send(buffer)
}

function sendChat() {
    if (!checkOrReconnect()) return
    var chat = document.querySelector('#chat').value
    player.chat = chat
    var msg = {
        chat: chat
    }
    sendMsgToAll('send-chat', msg)
    closeForm()
}

function battleOffer(id) {
    if (!checkOrReconnect()) return
    var buffer = new ArrayBuffer(5)
    var dataview = new DataView(buffer)
    dataview.setInt8(0, TypeToNum['battle-offer'])
    dataview.setInt16(1, myID)
    dataview.setInt16(3, id)
    ws.send(buffer)
}

function battleAnswer(id) {
    if (!checkOrReconnect()) return
    var buffer = new ArrayBuffer(5)
    var dataview = new DataView(buffer)
    dataview.setInt8(0, TypeToNum['battle-answer'])
    dataview.setInt16(1, myID)
    dataview.setInt16(3, id)
    ws.send(buffer)
}

function battleDeny(id, reason) {
    if (!checkOrReconnect()) return
    console.log('refuse battle')
    var buffer = new ArrayBuffer(7)
    var dataview = new DataView(buffer)
    dataview.setInt8(0, TypeToNum['battle-deny'])
    dataview.setInt16(1, myID)
    dataview.setInt16(3, id)
    // 0: already on battle, 1: refuse
    dataview.setInt16(5, reason)
    ws.send(buffer)
}

function requestUserInfo(id) {
    if (!checkOrReconnect()) return
    var buffer = new ArrayBuffer(5)
    var dataview = new DataView(buffer)
    dataview.setInt8(0, TypeToNum['request-user-info'])
    dataview.setInt16(1, myID)
    dataview.setInt16(3, id)
    ws.send(buffer)
}

function responseUserInfo(id) {
    if (!checkOrReconnect()) return
    var msg = {
        collection: window.contractAddress,
        url: playerUrl,
        username: player.name,
        health: monsters[window.contractAddress].health,
        attacks: monsters[window.contractAddress].attacks
    }
    sendMsgToPeer('response-user-info', id, msg)
    stopUser(global_position())
}

function attack(id, attack) {
    if (!checkOrReconnect()) return
    var buffer = new ArrayBuffer(7)
    var dataview = new DataView(buffer)
    dataview.setInt8(0, TypeToNum['attack'])
    dataview.setInt16(1, myID)
    dataview.setInt16(3, id)
    dataview.setInt16(5, attack)
    ws.send(buffer)
}

function leaveBattle(id) {
    if (!checkOrReconnect()) return
    var buffer = new ArrayBuffer(5)
    var dataview = new DataView(buffer)
    dataview.setInt8(0, TypeToNum['leave-battle'])
    dataview.setInt16(1, myID)
    dataview.setInt16(3, id)
    ws.send(buffer)
}

// if type >= 10: data should be dict
function sendMsgToServer(type, msg) {
    if (!checkOrReconnect()) return
    var typeNum = TypeToNum[type]

    var buffer1 = new ArrayBuffer(1)
    var dataview = new DataView(buffer1)
    dataview.setInt8(0, typeNum)

    var msgJSON = JSON.stringify(msg)
    log('Send to server: ' + msgJSON)
    var encoder = new TextEncoder()
    var buffer2 = encoder.encode(msgJSON).buffer

    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
    tmp.set(new Uint8Array(buffer1), 0)
    tmp.set(new Uint8Array(buffer2), 1)
    ws.send(tmp.buffer)
}

function sendMsgToAll(type, msg) {
    if (!checkOrReconnect()) return
    var typeNum = TypeToNum[type]

    var buffer1 = new ArrayBuffer(3)
    var dataview = new DataView(buffer1)
    dataview.setInt8(0, typeNum)
    dataview.setInt16(1, myID)

    var msgJSON = JSON.stringify(msg)
    log('Send to all: ' + msgJSON)
    var encoder = new TextEncoder()
    var buffer2 = encoder.encode(msgJSON).buffer

    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
    tmp.set(new Uint8Array(buffer1), 0)
    tmp.set(new Uint8Array(buffer2), 3)
    ws.send(tmp.buffer)
}

function sendMsgToPeer(type, id, msg) {
    if (!checkOrReconnect()) return
    var typeNum = TypeToNum[type]

    var buffer1 = new ArrayBuffer(5)
    var dataview = new DataView(buffer1)
    dataview.setInt8(0, typeNum)
    dataview.setInt16(1, myID)
    dataview.setInt16(3, id)

    var msgJSON = JSON.stringify(msg)
    log('Send to peer: ' + msgJSON)
    var encoder = new TextEncoder()
    var buffer2 = encoder.encode(msgJSON).buffer

    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
    tmp.set(new Uint8Array(buffer1), 0)
    tmp.set(new Uint8Array(buffer2), 5)
    ws.send(tmp.buffer)
}

function receiveMsgFromAll(data) {
    var buf = new Uint8Array(data).slice(3)

    var decoder = new TextDecoder()
    var msg = JSON.parse(decoder.decode(buf))
    return msg
}

function receiveMsgFromPeer(data) {
    var buf = new Uint8Array(data).slice(5)

    var decoder = new TextDecoder()
    var msg = JSON.parse(decoder.decode(buf))
    return msg
}

function getDictFromBinary(data) {
    var buf = new Uint8Array(data).slice(1)

    var decoder = new TextDecoder()
    var msg = JSON.parse(decoder.decode(buf))
    return msg
}

function onmessage(data) {
    var buf = new Uint8Array(data).buffer
    var dv = new DataView(buf)
    var msg = null

    var type = NumToType[dv.getInt8(0)]

    switch (type) {
        case 'id': // my id is given
            myID = dv.getInt16(1)
            log('My ID: ' + myID)
            break

        case 'update-user-list': // user list change
            msg = getDictFromBinary(data)
            console.log(others)
            Object.keys(others).forEach((id) => {
                if (id !== '250') {
                    if (!(id in msg['user-list']))
                        delete others[id]
                }
            })

            msg['user-list'].forEach((id) => {
                if (!(id in others || id == myID)) {
                    requestUserInfo(id)
                }
            })
            break

        case 'move-user': // other user move
            var id = dv.getInt16(1)
            if (others[id] === undefined) {
                requestUserInfo(id)
                break
            }
            others[id].sprite.position = local_position({
                x: dv.getInt16(3),
                y: dv.getInt16(5)
            })
            others[id].sprite.animate = true
            const rotation = dv.getInt16(7)
            switch (rotation) {
                case 0:
                    others[id].sprite.image = others[id].sprite.sprites.up
                    break
                case 1:
                    others[id].sprite.image = others[id].sprite.sprites.left
                    break
                case 2:
                    others[id].sprite.image = others[id].sprite.sprites.down
                    break
                case 3:
                    others[id].sprite.image = others[id].sprite.sprites.right
                    break
            }
            break
        
        case 'stop-user':
            var id = dv.getInt16(1)
            if (others[id] === undefined) {
                requestUserInfo(id)
                break
            }
            others[id].sprite.position = local_position({
                x: dv.getInt16(3),
                y: dv.getInt16(5)
            })
            others[id].sprite.animate = false
            break

        case 'send-chat':
            var id = dv.getInt16(1)
            msg = receiveMsgFromAll(data)
            others[id].sprite.chat = msg.chat
            break

        case 'battle-offer':
            console.log('battle offered')
            if (!battle.initiated) {
                document.getElementById('acceptBattleBtn').style.display = 'inline-block'
                document.getElementById('refuseBattleBtn').style.display = 'inline-block'
                document.getElementById('acceptBattleBtn').replaceWith(document.getElementById('acceptBattleBtn').cloneNode(true));
                document.getElementById('refuseBattleBtn').replaceWith(document.getElementById('refuseBattleBtn').cloneNode(true));

                document.getElementById('acceptBattleCard').style.display = 'block'
                document.getElementById('battleOpponentName2').innerText = 'Opponent: ' + others[dv.getInt16(1)].sprite.name
                document.getElementById('acceptBattleBtn').addEventListener('click', (e) => {
                    opponent_id = dv.getInt16(1)
                    battleAnswer(opponent_id)
                    battle_start = true
                })
                document.getElementById('refuseBattleBtn').addEventListener('click', (e) => {
                    battleDeny(dv.getInt16(1), 1)
                    document.getElementById('acceptBattleCard').style.display = 'none'
                })
            }
            else {
                battleDeny(dv.getInt16(1), 0)
            }
            break

        case 'battle-deny':
            document.getElementById('acceptBattleCard').style.display = 'none'
            if (!battle.initiated) {
                var reason = dv.getInt16(5)
                console.log('battle denied')
                console.log(reason)
                if (reason === 0)
                    window.alert('Opponent is already on Battle')
                else if (reason === 1)
                    window.alert('Opponent Refused to Battle')
            }
            break

        case 'battle-answer':
            opponent_id = dv.getInt16(1)
            battle_start = true
            my_turn = true
            break

        case 'attack':
            var attack = dv.getInt16(5)
            attacked(attack)
            break

        case 'request-user-info':
            var id = dv.getInt16(1)
            responseUserInfo(id)
            break

        case 'response-user-info':
            var id = dv.getInt16(1)
            msg = receiveMsgFromPeer(data)
            if (others[id] === undefined) {
                others[id] = {
                    draw: false,
                    collection: msg.collection,
                    health: msg.health,
                    attacks: msg.attacks,
                    sprite: new Sprite({
                        position: {
                            x: 0,
                            y: 0
                        },
                        image: playerDownImage,
                        frames: {
                            max: 4,
                            hold: 10
                        },
                        sprites: {
                            up: new Image(),
                            left: new Image(),
                            right: new Image(),
                            down: new Image()
                        },
                        name: msg.username,
                    })
                }
                others[id].baseImage = new Image()
                worker.postMessage({ url: msg.url, contractAddress: msg.collection, id: id })
            }
            break

        case 'leave-battle':
            var id = dv.getInt16(1)
            if (battle.initiated && id === opponent_id) {
                window.alert('opponent left the battle')
                endBattle()
            }
            break

        default:
            log_error('Unknown message received:')
            msg = getDictFromBinary(data)
            log_error(msg)
    }
}

function onopen() {
    log('Server Connected')
}

function onerror(data) {
    console.dir(data)
}

function log(text) {
    var time = new Date()
    console.log('[' + time.toLocaleTimeString() + '] ' + text)
}

function log_error(text) {
    var time = new Date()
    console.trace('[' + time.toLocaleTimeString() + '] ' + text)
}

function reportError(errMessage) {
    log_error(`Error ${errMessage.name}: ${errMessage.message}`)
}

function connect() {
    var serverUrl
    var scheme = 'ws'
    // var hostName = 'localhost:3000'
    var hostName = 'web3mon.yusangyoon.com'
    log('Hostname: ' + hostName)

    if (document.location.protocol === 'https:') {
        scheme += 's'
    }

    // serverUrl = scheme + '://' + hostName
    serverUrl = 'wss' + '://' + hostName
    log(`Connecting to server: ${serverUrl}`)

    if (ws != undefined) {
        ws.onerror = ws.onopen = ws.onclose = null
        ws.close()
    }

    ws = new WebSocket(serverUrl)
    // ws = new WebSocket('ws://ec2-15-164-162-167.ap-northeast-2.compute.amazonaws.com');
    ws.binaryType = 'arraybuffer'

    ws.onopen = () => onopen()
    ws.onerror = ({ data }) => onerror(data)
    ws.onmessage = ({ data }) => onmessage(data)
    ws.onclose = function () {
        ws = null
    }
    return ws
}
