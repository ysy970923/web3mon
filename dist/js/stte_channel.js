function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function player_init(battle_id, pk) {
  // TODO: player send money with battle_id and pk
}
var battle_state = {
  battle_id: 0,
  expires_at: 0,
  sequence: 1,
  attacker_id: 0,
  player_state: [{
    attacks: [{
      atk: 10,
      remains: 255,
      critical_prob: 30
    }, {
      atk: 20,
      remains: 3,
      critical_prob: 0
    }, {
      atk: 15,
      remains: 1,
      critical_prob: 30
    }],
    defenses: [{
      def: 1,
      remains: 255,
      reflection_prob: 0
    }, {
      def: 2,
      remains: 3,
      reflection_prob: 0
    }, {
      def: 0,
      remains: 1,
      reflection_prob: 100
    }],
    hp: 50
  }, {
    attacks: [{
      atk: 10,
      remains: 255,
      critical_prob: 30
    }, {
      atk: 20,
      remains: 3,
      critical_prob: 0
    }, {
      atk: 15,
      remains: 1,
      critical_prob: 30
    }],
    defenses: [{
      def: 1,
      remains: 255,
      reflection_prob: 0
    }, {
      def: 2,
      remains: 3,
      reflection_prob: 0
    }, {
      def: 0,
      remains: 1,
      reflection_prob: 100
    }],
    hp: 50
  }]
};
var battle_action = {
  action: 0,
  rand_num: 0
};
var tmp_wallet = ethers.Wallet.createRandom();
var channel_state = {
  battle_state: battle_state,
  new_battle_state: battle_state,
  op_commit: '',
  op_commit_signature: '',
  my_action: '',
  op_action: '',
  manager_signature: '',
  op_pk: '',
  manager_pk: '',
  my_sk: tmp_wallet.privateKey
};
send_commit(0, battle_action, 'channel');
function send_commit(_x, _x2, _x3) {
  return _send_commit.apply(this, arguments);
} // 'channel' mode
// assert signature == sign(commit, pk)
function _send_commit() {
  _send_commit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(sequence, action, mode) {
    var commit, a, b, message, signature;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(action)));
        case 2:
          commit = _context.sent;
          a = new Uint8Array([sequence]);
          b = ethers.utils.arrayify(commit);
          message = new Uint8Array(a.length + b.length);
          message.set(a);
          message.set(b, a.length);
          _context.next = 10;
          return tmp_wallet.signMessage(message);
        case 10:
          signature = _context.sent;
          if (mode === 'channel') {
            // send to server
            // sendMsgToServer(TypeToNum['send-commit'], commit);
            receive_commit(sequence, commit, signature, tmp_wallet.address);
          } else if (mode === 'chain') {
            // send to chain
          }
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _send_commit.apply(this, arguments);
}
function receive_commit(_x4, _x5, _x6, _x7) {
  return _receive_commit.apply(this, arguments);
}
function _receive_commit() {
  _receive_commit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(sequence, commit, signature, op_pk) {
    var a, b, message, addr, op_addr;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!(Date.now() > channel_state.battle_state.expires_at + 40)) {
            _context2.next = 2;
            break;
          }
          return _context2.abrupt("return", false);
        case 2:
          a = new Uint8Array([sequence]);
          b = ethers.utils.arrayify(commit);
          message = new Uint8Array(a.length + b.length);
          message.set(a);
          message.set(b, a.length);
          addr = ethers.utils.verifyMessage(message, signature);
          op_addr = ethers.utils.computeAddress(op_pk);
          if (!(addr === op_addr)) {
            _context2.next = 15;
            break;
          }
          channel_state.op_commit = commit;
          channel_state.op_commit_signature = signature;
          return _context2.abrupt("return", true);
        case 15:
          return _context2.abrupt("return", false);
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _receive_commit.apply(this, arguments);
}
function send_action(_x8, _x9) {
  return _send_action.apply(this, arguments);
} // 'channel' mode
// assert H(reveal) == commit
function _send_action() {
  _send_action = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(action, mode) {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (mode === 'channel') {
            // send to server
          } else if (mode === 'chain') {
            // send to chain
          }
        case 1:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _send_action.apply(this, arguments);
}
function receive_action(_x10, _x11) {
  return _receive_action.apply(this, arguments);
} // 'channel' mode
function _receive_action() {
  _receive_action = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(commit, action) {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (!(Date.now() > channel_state.battle_state.expires_at + 50)) {
            _context4.next = 2;
            break;
          }
          return _context4.abrupt("return", false);
        case 2:
          _context4.next = 4;
          return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(action)));
        case 4:
          commit = _context4.sent;
          if (!(commit === channel_state.op_commit)) {
            _context4.next = 10;
            break;
          }
          channel_state.op_action = action;
          return _context4.abrupt("return", true);
        case 10:
          return _context4.abrupt("return", false);
        case 11:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _receive_action.apply(this, arguments);
}
function compute_and_send_state(_x12, _x13, _x14) {
  return _compute_and_send_state.apply(this, arguments);
}
function _compute_and_send_state() {
  _compute_and_send_state = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(old_state, my_action, op_action) {
    var message, signature;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(channel_state.new_battle_state)));
        case 2:
          message = _context5.sent;
          _context5.next = 5;
          return tmp_wallet.signMessage(message);
        case 5:
          signature = _context5.sent;
          if (mode === 'channel') {
            // send to server
            // sendMsgToServer(TypeToNum['send-commit'], commit);
            receive_state(sequence, commit, signature, tmp_wallet.address);
          }
        case 7:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _compute_and_send_state.apply(this, arguments);
}
function compute_state() {
  channel_state.new_battle_state.expires_at += 60000;
  var rand_num = channel_state.my_action.rand_num + channel_state.op_action.rand_num;
}

/**
 *
 * @param {*} signature
 * @param {*} manager_pk
 * @returns
 * 'channel' mode
 * assert manager_sig == sign(state, manager_pk)
 */
function receive_state_signature(_x15, _x16) {
  return _receive_state_signature.apply(this, arguments);
}
function _receive_state_signature() {
  _receive_state_signature = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(signature, manager_pk) {
    var message, addr, manager_addr;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          if (!(Date.now() > channel_state.battle_state.expires_at + 60)) {
            _context6.next = 2;
            break;
          }
          return _context6.abrupt("return", false);
        case 2:
          _context6.next = 4;
          return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(channel_state.new_battle_state)));
        case 4:
          message = _context6.sent;
          addr = ethers.utils.verifyMessage(message, signature);
          manager_addr = ethers.utils.computeAddress(manager_pk);
          if (!(addr === manager_addr)) {
            _context6.next = 12;
            break;
          }
          channel_state.battle_state = channel_state.new_battle_state;
          return _context6.abrupt("return", true);
        case 12:
          return _context6.abrupt("return", false);
        case 13:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _receive_state_signature.apply(this, arguments);
}
function read_state_from_chain() {
  return _read_state_from_chain.apply(this, arguments);
}
function _read_state_from_chain() {
  _read_state_from_chain = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _read_state_from_chain.apply(this, arguments);
}