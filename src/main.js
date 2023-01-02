import './web/clickButtons'
import './web/logIn'
import './js/index'
import './js/utils'
import './game/interaction/move'
import './web/eventListener'
import './game/chat/chatForm'
import './game/chat/sendChat'
import './index.scss'
import './game.scss'
import './game/data/map'
import './web/initialSetting'

const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

document
  .getElementById('nft_choose_container_back')
  .addEventListener('click', (e) => {
    document.getElementById('chain_containers').style.display = 'block'
    document.getElementById('nft_choose_container').style.display = 'none'
  })
