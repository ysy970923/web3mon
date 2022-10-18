import { checkOrReconnect, log, TypeToNum, ws, myID } from '../../js/network'
import { player } from '../../js/index'
import { closeForm } from './chatForm'

document
  .getElementById('sendChatBtn')
  .addEventListener('click', sendChat, false)

export function sendChat() {
  if (!checkOrReconnect()) return

  const chat = document.querySelector('#chat').value

  player.chat = chat

  const msg = {
    chat: chat,
  }
  sendMsgToAll('send-chat', msg)
  closeForm()
}

export function sendMsgToAll(type, msg) {
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

// if type >= 10: data should be dict
export function sendMsgToServer(type, msg) {
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

export function sendMsgToPeer(type, id, msg) {
  if (!checkOrReconnect()) return
  var typeNum = TypeToNum[type]
  console.log(type)
  console.log(typeNum)

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
