export function openForm() {
  const chatDoc = document.getElementById('chatForm')
  console.log('오픈 클릭')
  if (chatDoc.style.display === 'block') {
    console.log('열려있다')
    chatDoc.style.display = 'none'
  } else chatDoc.style.display = 'block'
}

export function closeForm() {
  console.log('닫기 클릭')
  document.getElementById('chatForm').style.display = 'none'
}

document.getElementById('chatOpenBtn').addEventListener('click', openForm, true)
document
  .getElementById('chatCloseBtn')
  .addEventListener('click', closeForm, false)
