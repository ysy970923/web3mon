export const skills = [
  {
    name: 'Death Spiral',
    // for this turn
    is_atk: true,
    atk: 25,
    def: 0,
    absorb: false, // if true, absorbs the atk into lastin effect
    recover: 0,
    atk_is_random: true, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: false, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 255, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 100, // activation probability of n %
    def_prob: 0, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 2, // n * AD
    critical_add: 0, // AD + n
    stack_left: 3, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %

    // for lasting effect
    lasting_to_me: undefined,
    lasting_to_op: undefined,
  },

  {
    name: 'Celsius Explosion',
    // for this turn
    is_atk: true,
    atk: 20,
    def: 0,
    absorb: false, // if true, absorbs the atk into lastin effect
    recover: 0,
    atk_is_random: false, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: false, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 255, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 100, // activation probability of n %
    def_prob: 0, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 0, // n * AD
    critical_add: 0, // AD + n
    stack_left: 0, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %

    // for lasting effect
    lasting_to_me: undefined,
    lasting_to_op: undefined,
  },

  {
    name: 'Block of Fud',
    // for this turn
    is_atk: true,
    atk: 18,
    def: 0,
    absorb: false, // if true, absorbs the atk into lastin effect
    recover: 0,
    atk_is_random: false, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: false, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 255, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 100, // activation probability of n %
    def_prob: 0, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 0, // n * AD
    critical_add: 0, // AD + n
    stack_left: 0, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %
    guess_op_action: 0, // if guessed right, nullifies op's action

    // for lasting effect
    lasting_to_me: undefined,
    lasting_to_op: undefined,
  },

  {
    name: 'Hacked',
    // for this turn
    is_atk: true,
    atk: 20,
    def: 0,
    absorb: false, // if true, absorbs the atk into lastin effect
    recover: 15,
    atk_is_random: false, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: false, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 255, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 100, // activation probability of n %
    def_prob: 0, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 0, // n * AD
    critical_add: 0, // AD + n
    stack_left: 0, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %
    guess_op_action: undefined, // if guessed right, nullifies op's action

    // for lasting effect
    lasting_to_me: undefined,
    lasting_to_op: undefined,
  },

  {
    name: 'FTT Tsunami',
    // for this turn
    is_atk: true,
    atk: 20,
    def: 0,
    absorb: false, // if true, absorbs the atk into lastin effect
    recover: 0,
    atk_is_random: false, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: false, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 255, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 100, // activation probability of n %
    def_prob: 0, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 0, // n * AD
    critical_add: 0, // AD + n
    stack_left: 0, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %
    guess_op_action: undefined, // if guessed right, nullifies op's action

    // for lasting effect
    lasting_to_me: {
      last_for: 3,
      damage: 5,
    },

    lasting_to_op: {
      last_for: 3,
      damage: 20,
    },
  },

  {
    name: 'Fall of Voyager',
    // for this turn
    is_atk: true,
    atk: 40,
    def: 0,
    absorb: false, // if true, absorbs the atk into lastin effect
    recover: 0,
    atk_is_random: false, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: false, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 2, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 100, // activation probability of n %
    def_prob: 0, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 0, // n * AD
    critical_add: 0, // AD + n
    stack_left: 0, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %
    guess_op_action: undefined, // if guessed right, nullifies op's action

    // for lasting effect
    lasting_to_me: undefined,
    lasting_to_op: undefined,
  },

  {
    name: 'Hard Fork Arrow',
    // for this turn
    is_atk: true,
    atk: 40,
    def: 0,
    absorb: false, // if true, absorbs the atk into lastin effect
    recover: 0,
    atk_is_random: false, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: false, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 2, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 100, // activation probability of n %
    def_prob: 0, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 0, // n * AD
    critical_add: 0, // AD + n
    stack_left: 0, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %
    guess_op_action: undefined, // if guessed right, nullifies op's action

    // for lasting effect
    lasting_to_me: undefined,
    lasting_to_op: undefined,
  },

  {
    name: 'Short Selling',
    // for this turn
    is_atk: true,
    atk: 15,
    def: 0,
    absorb: false, // if true, absorbs the atk into lastin effect
    recover: 0,
    atk_is_random: false, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: false, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 255, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 100, // activation probability of n %
    def_prob: 0, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 0, // n * AD
    critical_add: 0, // AD + n
    stack_left: 0, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %
    guess_op_action: undefined, // if guessed right, nullifies op's action

    // for lasting effect
    lasting_to_me: undefined,

    lasting_to_op: {
      last_for: 1,
      nullify_prob: 50,
      damage: 15,
    },
  },

  {
    name: 'POW Shield',
    // for this turn
    is_atk: false,
    atk: 0,
    def: 15,
    absorb: true, // if true, absorbs the atk into lastin effect
    recover: 0,
    atk_is_random: false, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: false, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 255, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 0, // activation probability of n %
    def_prob: 100, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 0, // n * AD
    critical_add: 0, // AD + n
    stack_left: 0, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %
    guess_op_action: undefined, // if guessed right, nullifies op's action

    // for lasting effect
    lasting_to_me: undefined,

    lasting_to_op: {
      last_for: 1,
      damage: 0,
    },
  },

  {
    name: 'Merge Wall',
    // for this turn
    is_atk: false,
    atk: 0,
    def: 50,
    absorb: false, // if true, absorbs the atk into lastin effect
    recover: 0,
    atk_is_random: false, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: true, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 255, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 0, // activation probability of n %
    def_prob: 50, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 0, // n * AD
    critical_add: 0, // AD + n
    stack_left: 0, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %
    guess_op_action: undefined, // if guessed right, nullifies op's action

    // for lasting effect
    lasting_to_me: undefined,
    lasting_to_op: undefined,
  },

  {
    name: 'Audit Field',
    // for this turn
    is_atk: false,
    atk: 0,
    def: 20,
    absorb: false, // if true, absorbs the atk into lastin effect
    recover: 0,
    atk_is_random: false, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: true, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 255, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 0, // activation probability of n %
    def_prob: 100, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 0, // n * AD
    critical_add: 0, // AD + n
    stack_left: 0, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %
    guess_op_action: undefined, // if guessed right, nullifies op's action

    // for lasting effect
    lasting_to_me: undefined,
    lasting_to_op: undefined,
  },

  {
    name: 'Grace of CZ',
    // for this turn
    is_atk: false,
    atk: 0,
    def: 100,
    absorb: false, // if true, absorbs the atk into lastin effect
    recover: 0,
    atk_is_random: false, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: true, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 255, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 0, // activation probability of n %
    def_prob: 33, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 0, // n * AD
    critical_add: 0, // AD + n
    stack_left: 0, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %
    guess_op_action: undefined, // if guessed right, nullifies op's action
    clear_effects: true, // if true, clear all lasting effects

    // for lasting effect
    lasting_to_me: undefined,
    lasting_to_op: undefined,
  },

  {
    name: 'Withdrawals Cloak',
    // for this turn
    is_atk: false,
    atk: 15,
    def: 20,
    absorb: false, // if true, absorbs the atk into lastin effect
    recover: 0,
    atk_is_random: false, // if true, atk follows a uniform distribution following mean of AD
    def_is_percentage: true, // if true, def is 50 %, else def is 50 AD
    max_possible_sequence: 255, // must be used before max possible sequence n
    remains: 255,
    atk_prob: 0, // activation probability of n %
    def_prob: 100, // activation probability of n %
    critical_prob: 0, // critical hit probability of n %
    critical_mult: 0, // n * AD
    critical_add: 0, // AD + n
    stack_left: 0, // n stack needed to be critical
    reflection_prob: 0, // reflection of damage of n %
    guess_op_action: undefined, // if guessed right, nullifies op's action
    clear_effects: true, // if true, clear all lasting effects

    // for lasting effect
    lasting_to_me: undefined,
    lasting_to_op: undefined,
  },
]
