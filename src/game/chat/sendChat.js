import { log, ws, myID } from '../../js/network'
import { player } from '../../js/index'
import { closeForm } from './chatForm'
import { CHAT } from '../network/callType'
import { checkOrReconnect } from '../network/checkConnection'

document
  .getElementById('sendChatBtn')
  .addEventListener('click', sendChat, false)

document.getElementById('chatForm').addEventListener('submit', (e) => {
  e.preventDefault()
  sendChat()
})

export function sendChat() {
  console.log('클릭은됨')
  if (!checkOrReconnect()) return

  const chat = document.querySelector('#chat').value
  player.chat = chat

  const msg = {
    BoardCastChat: {
      content: chat,
    },
  }

  ws.send(JSON.stringify(msg))
  closeForm()
}

export function sendWhisperChat(receiver_id) {
  if (!checkOrReconnect()) return

  const chat = document.querySelector('#chat').value

  const msg = {
    WhisperChat: {
      content: chat,
      receiver_player_id: receiver_id,
    },
  }

  ws.send(JSON.stringify(msg))
  closeForm()
}

export function sendMapChat() {
  if (!checkOrReconnect()) return

  const chat = document.querySelector('#chat').value
  player.chat = chat

  const msg = {
    MapChat: {
      content: chat,
    },
  }

  ws.send(JSON.stringify(msg))
  closeForm()
}
