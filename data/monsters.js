const monsters = {
  me: {
    position: {
      x: 280,
      y: 325
    },
    image: {
      src: './img/embySprite.png'
    },
    frames: {
      max: 4,
      hold: 30
    },
    animate: true,
    name: 'Emby',
    health: 100,
    attacks: [attacks.Default, attacks.Fireball]
  },
  opponent: {
    position: {
      x: 800,
      y: 100
    },
    image: {
      src: './img/draggleSprite.png'
    },
    frames: {
      max: 4,
      hold: 30
    },
    animate: true,
    isEnemy: true,
    name: 'Draggle',
    health: 100,
    attacks: [attacks.Default, attacks.Fireball]
  }
}
