import {
  checkOrReconnect,
  log,
  TypeToNum,
  ws,
  myID,
  NumToType,
} from '../../js/network'
import { player } from '../../js/index'
import { closeForm } from './chatForm'
import { CHAT } from '../network/callType'

document
  .getElementById('sendChatBtn')
  .addEventListener('click', sendChat, false)

export function sendChat() {
  if (!checkOrReconnect()) return
  console.log('전송을 시도')
  const chat = document.querySelector('#chat').value
  if (chat === 1) {
    let body = {
      chat: chat,
    }
    ws.send(JSON.stringify(body))
  }
  console.log('전송을 메세지', chat)

  player.chat = chat

  // sendMsgToAll(CHAT.SEND, chat)
  // closeForm()

  var buffer = new ArrayBuffer(7)
  var dataview = new DataView(buffer)
  dataview.setInt16(1, myID)
  dataview.setInt16(3, 12323)
  ws.send(buffer)
}

export function sendMsgToAll(type, chat) {
  if (!checkOrReconnect()) return
  const msg = {
    type: CHAT.SEND,
    chat: chat,
  }
  // var typeNum = TypeToNum[type]

  var msgJSON = JSON.stringify(msg)
  log('Send to all: ' + msgJSON)
  ws.send(msgJSON)
}

// if type >= 10: data should be dict
export function sendMsgToServer(type, chat) {
  if (!checkOrReconnect()) return
  const msg = {
    type: CHAT.SEND,
    chat: chat,
  }

  ws.send(msg)
}

export function sendMsgToPeer(type, id, chat) {
  if (!checkOrReconnect()) return

  console.log('샌드 메시지 투 피어')

  const msg = {
    type: type,
    peer: id,
    chat: chat,
  }

  ws.send(msg)
}
