import { checkOrReconnect, myID, ws } from '../../js/network'
import { NETWORK } from './callType'
import { sendMsgToPeer } from '../chat/sendChat'
import { stopUser } from '../interaction/move'
import { global_position, player } from '../../js/index'
import { playerUrl } from '../../web/logIn'

export function requestUserInfo(id) {
  if (!checkOrReconnect()) return

  let msg = {
    id: id,
    myID: myID,
    type: NETWORK.REQUEST_USER_INFO,
  }

  let body = JSON.stringify(msg)
  console.log('십사 다음단계232', body)

  var buffer = new ArrayBuffer(7)
  var dataview = new DataView(buffer)
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  dataview.setInt16(5, NETWORK.REQUEST_USER_INFO)

  // ws.send(buffer)
  ws.send(buffer)
}

export function responseUserInfo(id) {
  if (!checkOrReconnect()) return
  const msg = {
    collection: window.contractAddress,
    url: playerUrl,
    username: player.name,
  }
  sendMsgToPeer(NETWORK.REQUEST_USER_INFO, id, msg)
  stopUser(global_position())
}
