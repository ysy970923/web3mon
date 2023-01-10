function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import { others, connect } from './network';
import { player } from './index';
import { animate } from '../game/animate';
import * as nearApi from 'near-api-js';
export var worker = new Worker('./js/worker.js');
worker.onmessage = function (event) {
  if (event.data) {
    if (event.data.id === '-1') {
      player.sprites.up.src = event.data.up;
      player.sprites.down.src = event.data.down;
      player.sprites.left.src = event.data.left;
      player.sprites.right.src = event.data.right;
      player.baseImage.src = event.data.baseImage;
      player.image = player.sprites.down;
      document.getElementById('loading').style.display = 'none';
      animate();
      connect();
    } else {
      others[event.data.id].sprite.sprites.up.src = event.data.up;
      others[event.data.id].sprite.sprites.down.src = event.data.down;
      others[event.data.id].sprite.sprites.left.src = event.data.left;
      others[event.data.id].sprite.sprites.right.src = event.data.right;
      others[event.data.id].baseImage.src = event.data.baseImage;
      others[event.data.id].sprite.image = others[event.data.id].sprite.sprites.down;
      others[event.data.id].draw = true;
    }
  }
};
worker.onerror = function (err) {
  console.log(err);
};
export function findMyNFT() {
  return _findMyNFT.apply(this, arguments);
}
function _findMyNFT() {
  _findMyNFT = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var nft_contract_list, args, _imgs, _i, _nft_contract_list, contract_id, metadata, data, p, imgs, _i2, _nft_contract_list2, res, key, i, nft, nft_data, img, img_url, response, _p, base_url, url, _imgs2, _url, _img;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          document.getElementById('chain_containers').style.display = 'none';
          document.getElementById('loading_container').style.display = 'block';
          if (!(window.chain === '' || window.accountId === '')) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return");
        case 4:
          if (!(window.chain === 'near')) {
            _context.next = 25;
            break;
          }
          nft_contract_list = ['near-punks.near', 'nearnautnft.near', 'asac.near', 'tinkerunion_nft.enleap.near', 'v0.apemetaerror.near', 'cartelgen1.neartopia.near', 'realbirds.near', 'mrbrownproject.near'];
          args = {
            account_id: window.wallet.getAccountId(),
            from_index: '0',
            limit: 50
          }; // 초기화
          document.querySelector('#nftListBox').innerHTML = '';
          document.getElementById('tokenId').value = '';
          _imgs = [];
          _i = 0, _nft_contract_list = nft_contract_list;
        case 11:
          if (!(_i < _nft_contract_list.length)) {
            _context.next = 23;
            break;
          }
          contract_id = _nft_contract_list[_i];
          _context.next = 15;
          return window.wallet.viewMethod({
            contractId: contract_id,
            method: 'nft_metadata'
          });
        case 15:
          metadata = _context.sent;
          _context.next = 18;
          return window.wallet.viewMethod({
            contractId: contract_id,
            method: 'nft_tokens_for_owner',
            args: args
          });
        case 18:
          data = _context.sent;
          if (data.length !== 0) {
            data.forEach(function (nft) {
              var src = '';
              if (nft.metadata.media.includes('https://')) src = nft.metadata.media;else src = metadata.base_uri + '/' + nft.metadata.media;
              var name = metadata.name + ' #' + (Number(nft.metadata.title) + 1);
              var img = document.createElement('img');
              img.src = src;
              img.style = 'width: 100px; opacity: 0.5;';
              img.setAttribute('asset_id', nft.token_id);
              img.setAttribute('name', name);
              img.onclick = onImgClick;
              _imgs.push(img);
            });
          }
        case 20:
          _i++;
          _context.next = 11;
          break;
        case 23:
          _imgs.forEach(function (i) {
            document.querySelector('#nftListBox').appendChild(i);
          });
          if (_imgs.length === 0) {
            p = document.createElement('p');
            p.innerHTML = 'There is no NFT';
            document.querySelector('#nftListBox').appendChild(p);
          }
        case 25:
          if (!(window.chain === 'terra')) {
            _context.next = 73;
            break;
          }
          nft_contract_list = ['terra16ds898j530kn4nnlc7xlj6hcxzqpcxxk4mj8gkcl3vswksu6s3zszs8kp2', 'terra17vysjt8ws64v8w696mavjpqs8mksf8s993qghlust9yey8qcmppqnhgw0e'];
          document.querySelector('#nftListBox').innerHTML = '';
          document.getElementById('tokenId').value = '';
          imgs = [];
          _i2 = 0, _nft_contract_list2 = nft_contract_list;
        case 31:
          if (!(_i2 < _nft_contract_list2.length)) {
            _context.next = 71;
            break;
          }
          contract_id = _nft_contract_list2[_i2];
          args = {
            owner: window.wallet.getAccountId()
          };
          _context.next = 36;
          return window.wallet.viewMethod({
            contractId: contract_id,
            method: 'tokens',
            args: args
          });
        case 36:
          res = _context.sent;
          key = Object.keys(res.data)[0];
          _context.t0 = _regeneratorRuntime().keys(res.data[key]);
        case 39:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 68;
            break;
          }
          i = _context.t1.value;
          nft = res.data[key][i];
          args = {
            token_id: nft
          };
          _context.next = 45;
          return window.wallet.viewMethod({
            contractId: contract_id,
            method: 'nft_info',
            args: args
          });
        case 45:
          nft_data = _context.sent;
          img = document.createElement('img');
          console.log(nft_data);
          img_url = nft_data.data.extension.image;
          if (!(img_url === undefined)) {
            _context.next = 59;
            break;
          }
          _context.next = 52;
          return fetch(nft_data.data.token_uri, {
            method: 'GET'
          });
        case 52:
          response = _context.sent;
          _context.next = 55;
          return response.json();
        case 55:
          response = _context.sent;
          // console.log(response)
          img_url = response.media;
          _context.next = 60;
          break;
        case 59:
          if (!img_url.includes('https://')) img_url = "https://ipfs.io/ipfs/".concat(nft_data.data.extension.image.replace('ipfs://', ''));
        case 60:
          img.src = img_url;
          img.style = 'width: 100px; opacity: 0.5;';
          img.setAttribute('asset_id', nft);
          img.setAttribute('name', nft_data.data.extension.name);
          img.onclick = onImgClick;
          imgs.push(img);
          _context.next = 39;
          break;
        case 68:
          _i2++;
          _context.next = 31;
          break;
        case 71:
          imgs.forEach(function (i) {
            document.querySelector('#nftListBox').appendChild(i);
          });
          if (imgs.length === 0) {
            _p = document.createElement('p');
            _p.innerHTML = 'There is no NFT';
            document.querySelector('#nftListBox').appendChild(_p);
          }
        case 73:
          if (!(window.chain === 'algo')) {
            _context.next = 104;
            break;
          }
          base_url = 'https://broken-spring-moon.algorand-mainnet.discover.quiknode.pro/index/v2/';
          url = "accounts/".concat(window.accountId, "/assets");
          _context.next = 78;
          return fetch(base_url + url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
        case 78:
          res = _context.sent;
          _context.next = 81;
          return res.json();
        case 81:
          res = _context.sent;
          // 초기화
          document.querySelector('#nftListBox').innerHTML = '';
          document.getElementById('tokenId').value = '';
          _imgs2 = [];
          _context.t2 = _regeneratorRuntime().keys(res.assets);
        case 86:
          if ((_context.t3 = _context.t2()).done) {
            _context.next = 103;
            break;
          }
          i = _context.t3.value;
          nft = res.assets[i];
          if (!(nft.amount !== 1)) {
            _context.next = 91;
            break;
          }
          return _context.abrupt("continue", 86);
        case 91:
          _url = "assets/".concat(nft['asset-id']);
          _context.next = 94;
          return fetch(base_url + _url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
        case 94:
          nft_data = _context.sent;
          _context.next = 97;
          return nft_data.json();
        case 97:
          nft_data = _context.sent;
          if (!(nft_data.asset.params['unit-name'] === undefined)) {
            _context.next = 100;
            break;
          }
          return _context.abrupt("continue", 86);
        case 100:
          if (nft_data.asset.params['unit-name'].startsWith(window.collection)) {
            _img = document.createElement('img');
            console.log(nft['asset-id']);
            _img.src = "https://ipfs.io/ipfs/".concat(nft_data.asset.params.url.replace('ipfs://', ''));
            _img.style = 'width: 100px; opacity: 0.5;';
            _img.onclick = onImgClick(_img, nft['asset-id'], nft['name']);
            _imgs2.push(_img);
          }
          _context.next = 86;
          break;
        case 103:
          _imgs2.forEach(function (i) {
            document.querySelector('#nftListBox').appendChild(i);
          });
        case 104:
          document.getElementById('loading_container').style.display = 'none';
          document.getElementById('nft_choose_container').style.display = 'flex';
        case 106:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _findMyNFT.apply(this, arguments);
}
var prevSelect = undefined;
function onImgClick(e) {
  if (prevSelect !== undefined) prevSelect.style.opacity = 0.5;
  e.target.style.opacity = 1.0;
  prevSelect = e.target;
  window.imgUrl = e.target.src;
  window.name = e.target.getAttribute('name');
  window.tokenId = e.target.getAttribute('asset_id');
}