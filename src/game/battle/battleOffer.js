import { ws, myID, checkOrReconnect } from '../../js/network'

export function battleOffer(id, type) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(7)
  var dataview = new DataView(buffer)
  //   dataview.setInt8(0, TypeToNum['battle-offer'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  dataview.setInt16(5, type)
  ws.send(buffer)
}

export function battleAnswer(id, type) {
  if (!checkOrReconnect()) return
  var buffer = new ArrayBuffer(7)
  var dataview = new DataView(buffer)
  //   dataview.setInt8(0, TypeToNum['battle-answer'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  dataview.setInt16(5, type)
  ws.send(buffer)
}

export function battleDeny(id, reason) {
  if (!checkOrReconnect()) return
  console.log('refuse battle')
  var buffer = new ArrayBuffer(7)
  var dataview = new DataView(buffer)
  //   dataview.setInt8(0, TypeToNum['battle-deny'])
  dataview.setInt16(1, myID)
  dataview.setInt16(3, id)
  // 0: already on battle, 1: refuse
  dataview.setInt16(5, reason)
  ws.send(buffer)
}
