const attacks = {
  Default: {
    criticial_prob: 0.3,
    limit: 10000,
    cool_time: 0,
    left_cool_time: 0,
    atk: 10,
  },
  Skill1: {
    critical_prob: 0,
    limit: 10000,
    cool_time: 3,
    left_cool_time: 0,
    atk: 15,
  },
  Skill2: {
    critical_prob: 0,
    limit: 1,
    cool_time: 0,
    left_cool_time: 0,
    atk: 20,
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
      Object.assign({}, attacks.Default, {
        atk: 12,
        effect: 'Tackle',
        name: 'Tackle',
      }),
      Object.assign({}, attacks.Skill1, {
        effect: 'Fireball',
        name: 'Fireball',
      }),
      Object.assign({}, attacks.Skill2, { effect: 'Larva', name: 'Larva' }),
    ],
    def: [defenses.Default, defenses.Shield, defenses.Thorn],
  },
  2: {
    health: 100,
    atk: [
      Object.assign({}, attacks.Default, { effect: 'Tackle', name: 'Tackle' }),
      Object.assign({}, attacks.Skill1, {
        effect: 'Fireball',
        name: 'Fireball',
      }),
      Object.assign({}, attacks.Skill2, {
        effect: 'Lightning',
        name: 'Lightning',
      }),
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
      Object.assign({}, attacks.Default, { effect: 'Tackle', name: 'Tackle' }),
      Object.assign({}, attacks.Skill1, {
        atk: 18,
        effect: 'Fireball',
        name: 'Fireball',
      }),
      Object.assign({}, attacks.Skill2, {
        atk: 24,
        effect: 'Lightning',
        name: 'Lightning',
      }),
    ],
    def: [defenses.Default, defenses.Shield, defenses.Thorn],
  },
  4: {
    health: 100,
    atk: [
      Object.assign({}, attacks.Default, { effect: 'Tackle' }),
      Object.assign({}, attacks.Skill1, { effect: 'Shield' }),
      Object.assign({}, attacks.Skill2, { effect: 'Lightning' }),
    ],
    def: [
      defenses.Default,
      defenses.Shield,
      Object.assign({}, defenses.Thorn, { def: 10000 }),
    ],
  },
}
