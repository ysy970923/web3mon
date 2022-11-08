import { connectWallets } from '../../web/logIn'

export let battle_start = false
export let my_turn
export let mySkillType

document.getElementById('selectType').addEventListener('change', () => {
  connectWallets()
})

export function startBattle() {
  document.getElementById('selectTypeCard').style.display = 'none'
  battle_start = true
  my_turn = true
  mySkillType = document.getElementById('selectType').value
}

export function setBattleStart(bool) {
  battle_start = bool
}

export function setMyTurn(bool) {
  my_turn = bool
}

export function setMySkillType(type) {
  mySkillType = type
}
