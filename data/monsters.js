const monsters = {
  me: {
    position: {
      x: 250,
      y: 305
    },
    image: {
      src: './img/embySprite.png'
    },
    // frames: {
    //   max: 4,
    //   hold: 30
    // },
    animate: true,
    name: 'Emby',
    attacks: [attacks.Default, attacks.Fireball]
  },
  opponent: {
    position: {
      x: 650,
      y: 100
    },
    image: {
      src: './img/draggleSprite.png'
    },
    // frames: {
    //   max: 4,
    //   hold: 30
    // },
    animate: true,
    isEnemy: true,
    name: 'Draggle',
    attacks: [attacks.Default, attacks.Fireball]
  }
}
