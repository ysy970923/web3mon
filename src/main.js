import './web/clickButtons'
import './web/logIn'
import './js/index'
import './js/utils'
import './game/interaction/move'
import './web/eventListener'
import './game/chat/chatForm'
import './game/chat/sendChat'
import './index.scss'
import './game/battle/battleStart'

const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let serverUrl = 'ws://ec2-44-201-5-87.compute-1.amazonaws.com:8080/ws'

let ws = new WebSocket(serverUrl)

console.log('웹소켓', ws)

ws.binaryType = 'arraybuffer'

ws.onopen = (e) => {
  console.log('오픈 되었다', e)
}

ws.onerror = ({ data }) => {
  console.log('ㅇㅔ러보기', data)
}
ws.onmessage = ({ data }) => {
  console.log('데이터', data)
  const msg = JSON.parse(data)
  const type = Object.keys(msg)[0]
  onmessage(type, msg[type])
}
ws.onclose = function (e) {
  console.log('닫혔다', e)
  ws = null
}
