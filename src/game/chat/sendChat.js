import { log, ws, myID } from '../../js/network'
import { player } from '../../js/index'
import { closeForm } from './chatForm'
import { CHAT } from '../network/callType'
import { checkOrReconnect } from '../network/checkConnection'

document
  .getElementById('sendChatBtn')
  .addEventListener('click', sendChat, false)

export function sendChat() {
  console.log('채팅을 보냄', msg)
  if (!checkOrReconnect()) return

  const chat = document.querySelector('#chat').value
  player.chat = chat

  const msg = {
    BoardCastChat: {
      content: chat,
    },
  }

  console.log('채팅을 보냄22', msg)

  ws.send(JSON.stringify(msg))
  // sendMsgToAll('BoardCastChat', msg)
  closeForm()
}

export function sendMsgToAll(type, msg) {
  if (!checkOrReconnect()) return

  // var buffer1 = new ArrayBuffer(3)
  // var dataview = new DataView(buffer1)
  // dataview.setInt8(0, typeNum)
  // dataview.setInt16(1, myID)

  // var msgJSON = JSON.stringify(msg)
  // log('Send to all: ' + msgJSON)
  // var encoder = new TextEncoder()
  // var buffer2 = encoder.encode(msgJSON).buffer

  // var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
  // tmp.set(new Uint8Array(buffer1), 0)
  // tmp.set(new Uint8Array(buffer2), 3)

  ws.send(JSON.stringify(msg))
}

// if type >= 10: data should be dict
export function sendMsgToServer(type, msg) {
  if (!checkOrReconnect()) return

  var buffer1 = new ArrayBuffer(1)
  var dataview = new DataView(buffer1)

  var msgJSON = JSON.stringify(msg)
  log('Send to server: ' + msgJSON)
  var encoder = new TextEncoder()
  var buffer2 = encoder.encode(msgJSON).buffer

  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
  tmp.set(new Uint8Array(buffer1), 0)
  tmp.set(new Uint8Array(buffer2), 1)
  ws.send(tmp.buffer)
}
