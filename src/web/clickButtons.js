function clickOutSideEvent1(e) {
  if (!document.getElementById('guidanceCard').contains(e.target)) {
    document.body.removeEventListener('click', clickOutSideEvent1, true)
    document.getElementById('guidanceCard').style.display = 'none'
  }
}

document.getElementById('guidanceButton').addEventListener('click', (e) => {
  document.getElementById('guidanceCard').style.display = 'block'
  document.body.addEventListener('click', clickOutSideEvent1, true)
})

document.getElementById('closeResultBtn').addEventListener('click', (e) => {
  document.getElementById('battleResultCard').style.display = 'none'
})

function clickOutSideEvent(e) {
  if (!document.getElementById('profileCard').contains(e.target)) {
    document.body.removeEventListener('click', clickOutSideEvent, true)
    document.getElementById('profileCard').style.display = 'none'
  }
}

document.getElementById('profileButton').addEventListener('click', (e) => {
  document.getElementById('profileCard').style.display = 'block'
  document.body.addEventListener('click', clickOutSideEvent, true)
})
