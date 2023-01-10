import { ws } from '../../js/network';
import { checkOrReconnect } from './checkConnection';
export function sendMsgToPeer(type, id, msg) {
  if (!checkOrReconnect()) return;
  // var typeNum = TypeToNum[type]
  // console.log(type)
  // console.log(typeNum)

  // var buffer1 = new ArrayBuffer(5)
  // var dataview = new DataView(buffer1)
  // dataview.setInt8(0, typeNum)
  // dataview.setInt16(1, myID)
  // dataview.setInt16(3, id)

  // var msgJSON = JSON.stringify(msg)
  // log('Send to peer: ' + msgJSON)
  // var encoder = new TextEncoder()
  // var buffer2 = encoder.encode(msgJSON).buffer

  // var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
  // tmp.set(new Uint8Array(buffer1), 0)
  // tmp.set(new Uint8Array(buffer2), 5)
  var body = {
    type: type,
    id: id,
    msg: msg
  };
  ws.send(JSON.stringify(body));
}