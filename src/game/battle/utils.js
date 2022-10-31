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
  console.log('선택한 스킬 타입', mySkillType)
}

export function setBattleStart(bool) {
  battle_start = bool
}
