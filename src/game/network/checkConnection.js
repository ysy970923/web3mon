import { myID, ws, connect } from '../../js/network'

export function checkOrReconnect() {
  if (!ws) {
    // 연결이 끊겨 있으면 연결하기
    connect()
    return false
  }
  if (ws.readyState === WebSocket.CONNECTING) return false

  if (ws.readyState === WebSocket.OPEN) {
    return true
  }
  // connect()
  return false
}
