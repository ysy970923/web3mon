import { endBattle, opponent_id } from './battleScene'
import { startBattleSetting } from '../game/battle/utils'
import { battle, local_position } from '../js/index'
import { ACTION, CHAT, NETWORK } from '../game/network/callType'
import { npc_list } from '../game/data/npc'
import { makeOthers } from '../game/object/makeOthers'
import { checkOrReconnect } from '../game/network/checkConnection'
import { displayBattleAcceptPopup } from '../game/battle/battleStart'
import { offerBattle } from '../game/battle/acceptBattleBtn'

export let ws = null
export let myID = null
export const others = {}
export let isMyEntrance = true

function onmessage(type, data) {
  console.log('내려왔습니다', type, data)

  let id = data.id

  switch (type) {
    case NETWORK.JOIN:
    case 'your_player_id':
      console.log('실행합니다')
      // 유저가 들어왔다.
      // if (data.joined_player_id === myID) {
      if (data === myID) {
        break
      }
      if (!isMyEntrance) {
        // makeOthers(data.joined_player_id, [
        //   window.innerWidth / 2 - 192 / 4 / 2,
        //   window.innerHeight / 2 - 102 / 2,
        // ])
        makeOthers(data, [
          window.innerWidth / 2 - 192 / 4 / 2,
          window.innerHeight / 2 - 102 / 2,
        ])
      } else {
        myID = data
        // myID = data.joined_player_id
        isMyEntrance = false
      }
      log('My ID: ' + myID)
      break

    case NETWORK.LEAVE:
      delete others[data.leaved_player_id]
      break

    case NETWORK.MAP_STATUS:
      Object.keys(others).forEach((id) => {
        if (!npc_list.includes(id)) {
          if (!(id in data['player_infos_for_view'])) delete others[id]
        }
      })

      data['player_infos_for_view'].forEach((avatar) => {
        // if (isMyEntrance) {
        //   myID = avatar['player_id']
        //   isMyEntrance = false
        // } else
        if (!(avatar.player_id in others || avatar.player_id === myID)) {
          // 원래는 유저 정보를 요청해서 받아온 다음 생성이었는데, 이제 애초에 정보가 같이 내려오기 때문에 바로 생성
          makeOthers(
            avatar.player_id,
            avatar.coordinate,
            String(avatar.player_id).slice(0, 5),
            avatar.nft_image_url
          )
        }
      })

      break

    case ACTION.MOVE:
      if (data.player_key === myID) {
        return
      } else {
        const id = data.player_key

        if (data.coordinate[0] === 1 && data.coordinate[1] === 1) {
          others[id].sprite.animate = false
        } else {
          // 디렉션 계산해서 이미지 부여하기
          const newPosition = local_position({
            x: data.coordinate[0],
            y: data.coordinate[1],
          })

          const isLeft = others[id].sprite.position.x - newPosition.x < -1
          const isBottom = others[id].sprite.position.y - newPosition.y < -1
          const isRight = others[id].sprite.position.x - newPosition.x > 1
          const isUp = others[id].sprite.position.y - newPosition.y > 1

          if (isUp) others[id].sprite.image = others[id].sprite.sprites.up
          else if (isBottom)
            others[id].sprite.image = others[id].sprite.sprites.down
          else if (isLeft)
            others[id].sprite.image = others[id].sprite.sprites.right
          else if (isRight)
            others[id].sprite.image = others[id].sprite.sprites.left

          // 포지션 이동이 아니라 새로운 포지션까지 이동하는 애니메이션이어야 하는데?
          moveObject(id, newPosition, isLeft | isRight, isUp | isBottom)
          others[id].sprite.animate = true
        }
      }
      break

    case CHAT.BOARD_CAST_CHAT:
      if (data.send_player_id !== myID)
        others[data.send_player_id].sprite.chat = data['content']
      break

    case ACTION.MAP_TRANSFER:
      console.log('유저의 맵이동', type, data)
      break

    case NETWORK.BATTLE_OFFER:
      console.log('누가 나한테 배틀 신청함!', data)
      // 우선 수락할건지 말건지 화면을 보여줘야한다.
      displayBattleAcceptPopup(data.proposer_player_id)
      offerBattle(data.proposer_player_id, false, data.battle_id)
      break

    case NETWORK.BATTLE_REJECT:
      console.log('누가 내 배틀 거절함!', data.reason)
      if (!battle.initiated) {
        if (data.reason === 0) window.alert('Opponent is already on Battle')
        else if (data.reason === 1) window.alert('Opponent Refused to Battle')
      }

      break

    case NETWORK.BATTLE_INIT_INFO:
      console.log('배틀 시작')

      // 예상 컨트랙트 코드 위치
      // battle_init

      // 배틀 시작할 때 상대방의 스킬 공개.

      // for now, battle proposer attacks later
      if (data.proposer_player_id === myID) {
        others[data.receiver_player_id].skillType = 1
        startBattleSetting(data.receiver_player_id, true, data.battle_id)
      } else {
        others[data.proposer_player_id].skillType = 1
        startBattleSetting(data.proposer_player_id, false, data.battle_id)
      }
      break

    case NETWORK.ACTION:
      window.battle.receiveQueue.push(data.msg)
      break

    case NETWORK.LEAVE_BATTLE:
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

function audoBattleOffer(id) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(5)
  var dataview = new DataView(buffer)
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  ws.send(buffer)
}

function autoBattleAnswer(id) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(5)
  var dataview = new DataView(buffer)
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  ws.send(buffer)
}

function autoBattleSelectType(id, type) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(7)
  var dataview = new DataView(buffer)
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  dataview.setInt16(5, type)
  ws.send(buffer)
}

export function leaveBattle(id) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(5)
  var dataview = new DataView(buffer)
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

// TODO (used for battle)
export function send(msg){}

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
    ws.onerror = ws.onopen = ws.onclose = null
    ws.close()
  }

  serverUrl = 'ws://ec2-44-201-5-87.compute-1.amazonaws.com:8080/ws'

  ws = new WebSocket(serverUrl)

  console.log('웹소켓', ws)

  ws.binaryType = 'arraybuffer'

  ws.onopen = (e) => {
    // console.log('오픈 되었다', e)
    onopen()
  }

  ws.onerror = ({ data }) => onerror(data)
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data)
    const type = Object.keys(msg)[0]
    onmessage(type, msg[type])
  }
  ws.onclose = function (e) {
    console.log('Websocket Server is Closed! with : ', e)
    ws = null
  }
  return ws
}

/**
 *
 * @param {string} id
 * @param {x : number, y : number} position
 * @param {boolean} isHorizontalMove 오른쪽으로 가는 건가?
 * @param {boolean} isVerticalMove 위로 가는건가?
 */
function moveObject(id, position, isHorizontalMove, isVerticalMove) {
  others[id].sprite.position = position
  // const pastPosition = others[id].sprite.position

  // const interval = setInterval(() => {
  //   others[id].sprite.position.x += (position.x - pastPosition.x) / 5
  //   others[id].sprite.position.y +=
  //     (position.y - others[id].sprite.position.y) / 5
  // }, 5)

  // setTimeout(() => {
  //   clearInterval(interval)
  // }, 100)

  // while (others[id].sprite.position.x - position.x < -1) {
  //   console.log('실행', others[id].sprite.position.x)
  //   others[id].sprite.position.x += 0.2
  // }

  // for (let i = 0; i < 10; i++) {
  //   others[id].sprite.position.x =
  //     others[id].sprite.position.x + (position.x - pastPostion.x) / 10
  //   others[id].sprite.position.y =
  //     others[id].sprite.position.y + (position.y - pastPostion.y) / 10
  // }
}
