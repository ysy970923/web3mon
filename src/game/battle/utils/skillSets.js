const attacks = {
  Default: {
    criticial_prob: 0.3,
    limit: 10000,
    cool_time: 0,
    left_cool_time: 0,
    atk: 12,
    name: 'Tackle',
    effect: 'Tackle',
    value: 0,
  },
  Fireball: {
    critical_prob: 0,
    limit: 10000,
    cool_time: 3,
    left_cool_time: 0,
    atk: 15,
    name: 'Fireball',
    effect: 'Fireball',
    value: 1,
  },
  Larva: {
    critical_prob: 0,
    limit: 1,
    cool_time: 0,
    left_cool_time: 0,
    atk: 20,
    name: 'Larva',
    effect: 'Larva',
    value: 2,
  },
  Hammer: {
    critical_prob: 0,
    limit: 1,
    cool_time: 0,
    left_cool_time: 0,
    atk: 120,
    name: 'Hammer',
    effect: 'Hammer',
    value: 3,
  },
}

const defenses = {
  Default: {
    limit: 10000,
    cool_time: 0,
    left_cool_time: 0,
    effect: 'Slash',
    def: 5,
  },
  Shield: {
    limit: 10000,
    cool_time: 3,
    left_cool_time: 0,
    effect: 'Shield',
    def: 10000,
  },
  Thorn: {
    limit: 1,
    cool_time: 0,
    left_cool_time: 0,
    effect: 'Thorn',
    def: 0,
  },
}

export let skillTypes = {
  1: {
    health: 100,
    atk: [
      Object.assign({}, attacks['Default']),
      Object.assign({}, attacks['Fireball']),
      Object.assign({}, attacks['Larva']),
    ],
    def: [defenses.Default, defenses.Shield, defenses.Thorn],
  },
  2: {
    health: 100,
    atk: [
      Object.assign({}, attacks['Default']),
      Object.assign({}, attacks['Fireball']),
      Object.assign({}, attacks['Larva']),
    ],
    def: [
      Object.assign({}, defenses.Default, { def: 7 }),
      defenses.Shield,
      defenses.Thorn,
    ],
  },
  3: {
    health: 100,
    atk: [
      Object.assign({}, attacks['Default']),
      Object.assign({}, attacks['Fireball']),
      Object.assign({}, attacks['Larva']),
    ],
    def: [defenses.Default, defenses.Shield, defenses.Thorn],
  },
  4: {
    health: 100,
    atk: [
      Object.assign({}, attacks['Default']),
      Object.assign({}, attacks['Fireball']),
      Object.assign({}, attacks['Hammer']),
    ],
    def: [
      defenses.Default,
      defenses.Shield,
      Object.assign({}, defenses.Thorn, { def: 10000 }),
    ],
  },
}
