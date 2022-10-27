import {
  attacked,
  endBattle,
  opponent_id,
  mySkillType,
  my_turn,
} from './battleScene'
import {
  player,
  battle,
  local_position,
  global_position,
  playerDownImage,
} from '../js/index'
import { worker } from './utils'
import { Sprite } from '../game/object/Sprite'
import { playerUrl } from '../web/logIn'
import { NETWORK } from '../game/network/callType'
import { npc_list } from '../game/data/npc'
import {
  responseUserInfo,
  requestUserInfo,
} from '../game/network/userConnection'
import {
  battleOffer,
  battleAnswer,
  battleDeny,
} from '../game/battle/battleOffer'

// import { WebSocketServer } from 'ws'

export let skillTypes = {}

export let ws = null
export let myID = null
var peerConnection = null
var webcamStream = null
var targetID = null
export const others = {}
export let battle_start = false

//0 ~ 9: binary; 10 ~: JSON string
var NumToType = {
  0: 'id',
  1: 'update-user-list',
}

export function checkOrReconnect() {
  console.log('연결 확인', ws)
  console.log('연결 확인2', ws.readyState)
  console.log('연결 확인3', ws.binaryType)
  console.log('연결 확인4', ws.url)
  if (!ws) {
    // 연결이 끊겨 있으면 연결하기
    connect()
    return false
  }
  if (ws.readyState === WebSocket.CONNECTING) return false

  if (ws.readyState === WebSocket.OPEN) {
    return true
  }
  connect()
  return false
}

const reverseMapping = (o) =>
  Object.keys(o).reduce(
    (r, k) => Object.assign(r, { [o[k]]: (r[o[k]] || []).concat(k) }),
    {}
  )

export let TypeToNum = reverseMapping(NumToType)

function audoBattleOffer(id) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(5)
  var dataview = new DataView(buffer)
  dataview.setInt8(0, TypeToNum['auto-battle-offer'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  ws.send(buffer)
}

function autoBattleAnswer(id) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(5)
  var dataview = new DataView(buffer)
  dataview.setInt8(0, TypeToNum['auto-battle-answer'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  ws.send(buffer)
}

function autoBattleSelectType(id, type) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(7)
  var dataview = new DataView(buffer)
  dataview.setInt8(0, TypeToNum['auto-battle-select-type'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  dataview.setInt16(5, type)
  ws.send(buffer)
}
export function attack(id, attack) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(7)
  var dataview = new DataView(buffer)
  dataview.setInt8(0, TypeToNum['attack'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  dataview.setInt16(5, attack)
  ws.send(buffer)
}

export function leaveBattle(id) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(5)
  var dataview = new DataView(buffer)
  dataview.setInt8(0, TypeToNum['leave-battle'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  ws.send(buffer)
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

function onmessage(type, data) {
  console.log('Type', type, '데이터', data)

  const msg = data
  let id = data.id

  switch (type) {
    case NETWORK.JOIN: // my id is given
      myID = data.id
      log('My ID: ' + myID)
      break

    case NETWORK.MAP_STATUS:
      console.log(data['avatar_status'].length, '명 있구만!')

      Object.keys(others).forEach((id) => {
        if (!npc_list.includes(id)) {
          if (!(id in data['avatar_status'])) delete others[id]
        }
      })

      data['avatar_status'].forEach((id) => {
        if (!(id in others || id === myID)) {
          // 유저를 생성하기 위해서 더 자세한 정보를 요청.
          requestUserInfo(id)
        }
      })

      break

    case 'update-user-list': // user list change
      Object.keys(others).forEach((id) => {
        if (id !== '250') {
          if (!(id in msg['user-list'])) delete others[id]
        }
      })

      msg['user-list'].forEach((id) => {
        if (!(id in others || id == myID)) {
          requestUserInfo(id)
        }
      })
      break

    case 'move-user': // other user move
      if (others[id] === undefined) {
        requestUserInfo(id)
        break
      }
      others[id].sprite.position = local_position({
        x: data.coordinate[0],
        y: data.coordinate[1],
      })
      others[id].sprite.animate = true

      switch (dataview.getInt16(7)) {
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
      if (others[id] === undefined) {
        requestUserInfo(id)
        break
      }
      others[id].sprite.position = local_position({
        x: dataview.getInt16(3),
        y: dataview.getInt16(5),
      })
      others[id].sprite.animate = false
      break

    case 'send-chat':
      msg = receiveMsgFromAll(data)
      others[id].sprite.chat = msg.chat
      break

    case 'battle-offer':
      if (!battle.initiated) {
        document.getElementById('acceptBattleBtn').style.display =
          'inline-block'
        document.getElementById('refuseBattleBtn').style.display =
          'inline-block'
        document
          .getElementById('acceptBattleBtn')
          .replaceWith(
            document.getElementById('acceptBattleBtn').cloneNode(true)
          )
        document
          .getElementById('refuseBattleBtn')
          .replaceWith(
            document.getElementById('refuseBattleBtn').cloneNode(true)
          )

        document.getElementById('acceptBattleCard').style.display = 'block'
        document.getElementById('battleOpponentName2').innerText =
          'Opponent: ' + others[dataview.getInt16(1)].sprite.name
        document
          .getElementById('acceptBattleBtn')
          .addEventListener('click', (e) => {
            opponent_id = dataview.getInt16(1)
            others[opponent_id].skillType = dataview.getInt16(5)
            document.getElementById('acceptBattleCard').style.display = 'none'
            document.getElementById('selectTypeCard').style.display = 'block'
            document
              .getElementById('selectTypeBtn')
              .addEventListener('click', (e) => {
                document.getElementById('selectTypeCard').style.display = 'none'
                battle_start = true
                my_turn = true
                mySkillType = document.getElementById('selectType').value
                battleAnswer(opponent_id, mySkillType)
                battle_start = true
              })
          })
        document
          .getElementById('refuseBattleBtn')
          .addEventListener('click', (e) => {
            battleDeny(dataview.getInt16(1), 1)
            document.getElementById('acceptBattleCard').style.display = 'none'
          })
      } else {
        battleDeny(dataview.getInt16(1), 0)
      }
      break

    case 'battle-deny':
      document.getElementById('acceptBattleCard').style.display = 'none'
      if (!battle.initiated) {
        var reason = dataview.getInt16(5)
        if (reason === 0) window.alert('Opponent is already on Battle')
        else if (reason === 1) window.alert('Opponent Refused to Battle')
      }
      break

    case 'battle-answer':
      opponent_id = dataview.getInt16(1)
      others[opponent_id].skillType = dataview.getInt16(5)
      battle_start = true
      my_turn = true
      break

    case 'attack':
      var attack = dataview.getInt16(5)
      attacked(attack)
      break

    case NETWORK.REQUEST_USER_INFO:
      // 내 정보를 알려달라고 요청이 왔다.
      responseUserInfo(data.id)
      break

    case NETWORK.RESPONSE_USER_INFO:
      // 유저를 생성하기 위해서 정보를 요청했고, 받았다.
      //
      // msg = receiveMsgFromPeer(data)
      if (others[data.id] === undefined) {
        others[data.id] = {
          draw: false,
          collection: msg.collection,
          sprite: new Sprite({
            position: {
              x: 0,
              y: 0,
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
            name: msg.username,
          }),
        }
        others[data.id].baseImage = new Image()
        worker.postMessage({
          url: msg.url,
          contractAddress: msg.collection,
          id: data.id,
        })
      }
      break

    case 'leave-battle':
      if (battle.initiated && id === opponent_id) {
        window.alert('opponent left the battle')
        endBattle()
      }
      break

    default:
      log_error('Unknown message received:')
      log_error(type)
  }
}

export function onopen() {
  log('Server Connected')
}

export function onerror(data) {
  console.dir(data)
}

export function log(text) {
  var time = new Date()
}

export function log_error(text) {
  var time = new Date()
  console.trace('[' + time.toLocaleTimeString() + '] ' + text)
}

export function reportError(errMessage) {
  log_error(`Error ${errMessage.name}: ${errMessage.message}`)
}

/**
 * 서버와 연결하도록 하는 함수
 * ws = new WebSocket(serverUrl)
 */
export function connect() {
  let serverUrl
  let scheme = 'ws'
  const hostName = 'ec2-44-201-5-87.compute-1.amazonaws.com:8080/ws'
  // var hostName = 'web3mon.yusangyoon.com'
  log('Hostname: ' + hostName)

  if (document.location.protocol === 'https:') {
    scheme += 's'
  }

  // serverUrl = scheme + '://' + hostName
  serverUrl = 'wss' + '://' + hostName
  log(`Connecting to server: ${serverUrl}`)

  if (ws != undefined) {
    console.log('닫고 다시 연결')
    ws.onerror = ws.onopen = ws.onclose = null
    ws.close()
  }

  serverUrl = 'ws://ec2-44-201-5-87.compute-1.amazonaws.com:8080/ws'

  ws = new WebSocket(serverUrl)
  // ws = new WebSocket('ws://ec2-15-164-162-167.ap-northeast-2.compute.amazonaws.com');
  ws.binaryType = 'arraybuffer'

  ws.onopen = (e) => {
    onopen()
  }
  ws.onerror = ({ data }) => onerror(data)
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data)
    const type = Object.keys(msg)[0]
    onmessage(type, msg[type])
  }
  ws.onclose = function () {
    console.log('닫습니까??')
    ws = null
  }
  return ws
}
