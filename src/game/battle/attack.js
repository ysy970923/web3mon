export const checkCanUserSkill = (selectedAttack) => {
  if (selectedAttack.left_cool_time > 0) {
    window.alert('cool time is left')
    return false
  } else if (selectedAttack.limit == 0) {
    window.alert('limit is over')
    return false
  } else {
    return true
  }
}
