import {
  attacked,
  endBattle,
  opponent_id,
  mySkillType,
  my_turn,
} from './battleScene'
import { battle, local_position } from '../js/index'
import { ACTION, CHAT, NETWORK } from '../game/network/callType'
import { npc_list } from '../game/data/npc'
import { requestUserInfo } from '../game/network/userConnection'
import { battleAnswer, battleDeny } from '../game/battle/battleOffer'
import { makeOthers } from '../game/object/makeOthers'
import { checkOrReconnect } from '../game/network/checkConnection'

// import { WebSocketServer } from 'ws'

export let skillTypes = {}

export let ws = null
export let myID = null
var peerConnection = null
var webcamStream = null
var targetID = null
export const others = {}
export let battle_start = false
let myTurn = false

//0 ~ 9: binary; 10 ~: JSON string
var NumToType = {
  0: 'id',
  1: 'update-user-list',
}

function onmessage(type, data) {
  console.log('Type', type, '데이터', data)

  const msg = data
  let id = data.id

  switch (type) {
    case NETWORK.JOIN:
      // 유저가 들어왔다.
      if (myTurn) {
        makeOthers(data.id, [
          window.innerWidth / 2 - 192 / 4 / 2,
          window.innerHeight / 2 - 102 / 2,
        ])
      } else {
        myID = data.id
        myTurn = true
      }
      log('My ID: ' + myID)
      break

    case NETWORK.LEAVE:
      delete others[data.id]
      break

    case NETWORK.MAP_STATUS:
      Object.keys(others).forEach((id) => {
        if (!npc_list.includes(id)) {
          if (!(id in data['avatar_status'])) delete others[id]
        }
      })

      data['avatar_status'].forEach((avatar) => {
        if (!(avatar.client_key in others || avatar.client_key === myID)) {
          // 원래는 유저 정보를 요청해서 받아온 다음 생성이었는데, 이제 애초에 정보가 같이 내려오기 때문에 바로 생성
          makeOthers(avatar.client_key, avatar.coordinate)
        }
      })

      break

    case ACTION.MOVE:
      if (data.mover_id === myID) {
        return
      } else {
        const id = data.mover_id

        if (data.coordinate[0] === 1 && data.coordinate[1] === 1) {
          others[id].sprite.animate = false
        } else {
          // 디렉션 계산해서 이미지 부여하기
          const newPosition = local_position({
            x: data.coordinate[0],
            y: data.coordinate[1],
          })

          const isLeft = others[id].sprite.position.x - newPosition.x < 0
          const isBottom = others[id].sprite.position.y - newPosition.y < 0
          const isRight = others[id].sprite.position.x - newPosition.x > 0
          const isUp = others[id].sprite.position.y - newPosition.y > 0

          if (isUp) others[id].sprite.image = others[id].sprite.sprites.up
          else if (isBottom)
            others[id].sprite.image = others[id].sprite.sprites.down
          else if (isLeft)
            others[id].sprite.image = others[id].sprite.sprites.right
          else if (isRight)
            others[id].sprite.image = others[id].sprite.sprites.left

          // 포지션 이동
          others[id].sprite.position = newPosition
          others[id].sprite.animate = true
        }
      }
      break

    case CHAT.BOARD_CAST_CHAT:
      others[data.sender_id].sprite.chat = data.content
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

  ws.binaryType = 'arraybuffer'

  ws.onopen = (e) => onopen()

  ws.onerror = ({ data }) => onerror(data)
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data)
    const type = Object.keys(msg)[0]
    onmessage(type, msg[type])
  }
  ws.onclose = function (e) {
    ws = null
  }
  return ws
}
