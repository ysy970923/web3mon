import {
  attacked,
  endBattle,
  opponent_id,
  mySkillType,
  my_turn,
} from './battleScene'
import { battle, local_position, playerDownImage } from '../js/index'
import { worker } from './utils'
import { Sprite } from '../game/object/Sprite'
import { CHAT, MOVE, NETWORK } from '../game/network/callType'
import {
  responseUserInfo,
  requestUserInfo,
} from '../game/network/userConnection'

export let skillTypes = {}

export let ws = null
export let myID = null
var peerConnection = null
var webcamStream = null
var targetID = null
export const others = {}
export let battle_start = false

//0 ~ 9: binary; 10 ~: JSON string
export let NumToType = {
  0: 'id',
  1: 'update-user-list',
  10: CHAT.SEND,
  11: MOVE.OTHER_USER,
  12: MOVE.STOP,
}

export function checkOrReconnect() {
  if (!ws) {
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

export function battleOffer(id, type) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(7)
  var dataview = new DataView(buffer)
  dataview.setInt8(0, TypeToNum['battle-offer'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  dataview.setInt16(5, type)
  ws.send(buffer)
}

export function battleAnswer(id, type) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(7)
  var dataview = new DataView(buffer)
  dataview.setInt8(0, TypeToNum['battle-answer'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  dataview.setInt16(5, type)
  ws.send(buffer)
}

export function battleDeny(id, reason) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(7)
  var dataview = new DataView(buffer)
  dataview.setInt8(0, TypeToNum['battle-deny'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  // 0: already on battle, 1: refuse
  dataview.setInt16(5, reason)
  ws.send(buffer)
}

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

function getDictFromBinary(data) {
  var buf = new Uint8Array(data).slice(1)
  var decoder = new TextDecoder()
  var msg = JSON.parse(decoder.decode(buf))
  return msg
}

function onmessage(data) {
  // var type = NumToType[dataview.getInt8(0)]
  let id

  const msg = JSON.parse(data)
  console.log('데이터가 넘어왔다.', msg)

  const type = msg.type

  switch (type) {
    case NETWORK.ID: // my id is given
      myID = msg.id
      // NumToType = msg.NumToType
      // TypeToNum = msg.TypeToNum
      // skillTypes = msg.skillSets
      log('My ID: ' + myID)
      break

    case NETWORK.UPDATE_USER_LIST: // user list change
      id = msg.id
      Object.keys(others).forEach((id) => {
        // NPC인지 아닌지 체크
        if (id !== '250') {
          // NPC도 아닌데 userList안에 없는 경우 others에서 빼버린다.
          if (!(id in msg['userList'])) {
            console.log('삭제에 해당하나>?', id)
            delete others[id]
          }
        }
      })

      msg['userList'].forEach((id) => {
        // 유저 리스트 안의 아이디들이 내 id도 아니고, others안에도 없을 때.
        console.log('222 22222222', id, myID, others, id === myID, id == myID)
        if (!(id in others || id == myID)) {
          console.log('십사', id)
          requestUserInfo(id)
        }
      })
      break

    case MOVE.OTHER_USER: // other user move
      console.log('움직이기 유저')
      id = msg.id
      if (others[id] === undefined) {
        requestUserInfo(id)
        break
      }
      others[id].sprite.position = local_position({
        x: msg.x,
        y: msg.y,
      })
      others[id].sprite.animate = true

      switch (msg.direction) {
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

    case MOVE.STOP:
      if (others[id] === undefined) {
        requestUserInfo(id)
        break
      }
      others[id].sprite.position = local_position({
        x: msg.x,
        y: msg.y,
      })
      others[id].sprite.animate = false
      break

    case CHAT.SEND:
      console.log('메세지', msg)
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
      console.log('아니 잠깐만', msg)
      responseUserInfo(msg.id)
      break

    case NETWORK.RESPONSE_USER_INFO:
      console.log('이게 실행될 일이 있나?', msg)

      if (others[id] === undefined) {
        others[id] = {
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
        others[id].baseImage = new Image()
        worker.postMessage({
          url: msg.url,
          contractAddress: msg.collection,
          id: id,
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
      console.log(msg, '이게 옴')
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
 * ws = new WebSocker(serverUrl)
 */
export function connect() {
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

  // ws = new WebSocket(NEW_SERVER_URL)
  // log(`Connecting to server: ${NEW_SERVER_URL}`)

  ws = new WebSocket(serverUrl)
  log(`Connecting to server: ${serverUrl}`)

  // ws = new WebSocket('ws://ec2-15-164-162-167.ap-northeast-2.compute.amazonaws.com');
  ws.binaryType = 'arraybuffer'

  console.log(ws, '웹소켓')

  ws.onopen = () => onopen()
  ws.onerror = ({ data }) => {
    onerror(data)
  }
  ws.onmessage = (event) => {
    console.log('넘어왔다', getDictFromBinary(event.data))
    // var buf = new Uint8Array(data).buffer
    // var dataview = new DataView(buf)

    // const type = NumToType[dataview.getInt8(0)]

    // let msg

    // if (type === 'id') {
    //   msg = {
    //     type: type,
    //     id: dataview.getInt16(1),
    //   }
    // } else if (type === 'update-user-list') {
    //   const translated = getDictFromBinary(data)
    //   msg = {
    //     type: type,
    //     userList: translated['user-list'],
    //   }
    // } else {
    //   msg = {
    //     type: type,
    //     ...getDictFromBinary(data),
    //   }
    // }

    onmessage(event.data)
  }
  ws.onclose = function () {
    ws = null
  }
  return ws
}
