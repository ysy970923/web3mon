import { myID, ws, connect } from '../../js/network'

export function checkOrReconnect() {
  console.log('연결 확인', ws)
  console.log('연결 확인2', ws.readyState)
  console.log('연결 확인3', WebSocket.CONNECTING)
  console.log('연결 확인3', WebSocket.OPEN)
  if (!ws) {
    // 연결이 끊겨 있으면 연결하기
    connect()
    return false
  }
  if (ws.readyState === WebSocket.CONNECTING) return false

  if (ws.readyState === WebSocket.OPEN) {
    console.log('트루를 반환')
    return true
  }
  // connect()
  return false
}
