import { ws, myID } from '../../js/network'
import { checkOrReconnect } from '../network/checkConnection'

export function battleAccept() {
  document.getElementById('acceptBattleCard').style.display = 'none'
  document.getElementById('selectTypeCard').style.display = 'block'
}
