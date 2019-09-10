/**
 * VueLayers
 * Web map Vue components with the power of OpenLayers
 *
 * @package vuelayers
 * @author Vladimir Vershinin <ghettovoice@gmail.com>
 * @version 0.11.5-beta.8
 * @license MIT
 * @copyright (c) 2017-2019, Vladimir Vershinin <ghettovoice@gmail.com>
 */
import debounce from 'debounce-promise';
import { interval } from 'rxjs/_esm5/internal/observable/interval';
import { first } from 'rxjs/_esm5/internal/operators/first';
import { skipUntil } from 'rxjs/_esm5/internal/operators/skipUntil';
import { skipWhile } from 'rxjs/_esm5/internal/operators/skipWhile';
import { log } from '../util/log';
import { identity, isFunction } from '../util/minilo';
import identMap from './ident-map';
import rxSubs from './rx-subs';
import services from './services';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var VM_PROP = 'vm';
var INSTANCE_PROMISE_POOL = 'instance_promise';
/**
 * Basic ol component mixin.
 * todo try to subscribe to generic change event here and update rev according to internal ol counter
 */

var olCmp = {
  VM_PROP: VM_PROP,
  INSTANCE_PROMISE_POOL: INSTANCE_PROMISE_POOL,
  mixins: [identMap, rxSubs, services],
  data: function data() {
    return {
      rev: 0
    };
  },
  computed: {
    name: function name() {
      return [this.$options.name, this.id].filter(identity).join(' ');
    }
  },
  methods: {
    /**
     * @return {Promise<void>}
     * @protected
     */
    beforeInit: function beforeInit() {},

    /**
     * @return {Promise<void>} Resolves when initialization completes
     * @protected
     */
    init: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var createPromise, ident;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                ident = this.makeSelfIdent();

                if (ident && this.$identityMap.has(ident, INSTANCE_PROMISE_POOL)) {
                  createPromise = this.$identityMap.get(ident, INSTANCE_PROMISE_POOL);
                } else {
                  createPromise = this.createOlObject();

                  if (ident) {
                    this.$identityMap.set(ident, createPromise, INSTANCE_PROMISE_POOL);
                  }
                }

                _context.next = 4;
                return createPromise;

              case 4:
                this._olObject = _context.sent;
                this._olObject[VM_PROP] || (this._olObject[VM_PROP] = []);

                if (!this._olObject[VM_PROP].includes(this)) {
                  // for loaded from IdentityMap
                  this._olObject[VM_PROP].push(this);
                }

                ++this.rev;

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function init() {
        return _init.apply(this, arguments);
      };
    }(),

    /**
     * @return {module:ol/Object~BaseObject|Promise<module:ol/Object~BaseObject>}
     * @protected
     * @abstract
     */
    createOlObject: function createOlObject() {
      throw new Error('Not implemented method');
    },

    /**
     * @return {void|Promise<void>}
     * @protected
     */
    deinit: function deinit() {
      var _this = this;

      var ident = this.makeSelfIdent();

      if (ident) {
        this.$identityMap.unset(ident, INSTANCE_PROMISE_POOL);
      }

      if (this._olObject) {
        this._olObject[VM_PROP] = this._olObject[VM_PROP].filter(function (vm) {
          return vm !== _this;
        });
        this._olObject = undefined;
      }
    },

    /**
     * Redefine for easy call in child components
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      return services.methods.getServices.call(this);
    },

    /**
     * @return {void|Promise<void>}
     * @protected
     */
    mount: function mount() {
      this.subscribeAll();
    },

    /**
     * @return {void|Promise<void>}
     * @protected
     */
    unmount: function unmount() {
      this.unsubscribeAll();
    },

    /**
     * Refresh internal ol objects
     * @return {Promise<void>}
     */
    refresh: function refresh() {
      var _this2 = this;

      if (this.$olObject == null) return Promise.resolve();
      return new Promise(function (resolve) {
        if (_this2.$olObject && isFunction(_this2.$olObject.changed)) {
          _this2.$olObject.once('change', function () {
            return resolve();
          });

          _this2.$olObject.changed();
        } else {
          resolve();
        }
      });
    },

    /**
     * Internal usage only in components that doesn't support refreshing.
     * @return {Promise<void>}
     * @protected
     */
    remount: function () {
      var _remount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this.$olObject == null)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                _context2.next = 4;
                return this.unmount();

              case 4:
                _context2.next = 6;
                return this.mount();

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function remount() {
        return _remount.apply(this, arguments);
      };
    }(),

    /**
     * Only for internal purpose to support watching for properties
     * for which OpenLayers doesn't provide setters.
     * @return {Promise}
     * @protected
     */
    recreate: function () {
      var _recreate = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(this.$olObject == null)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                _context3.next = 4;
                return this.unmount();

              case 4:
                _context3.next = 6;
                return this.deinit();

              case 6:
                _context3.next = 8;
                return this.init();

              case 8:
                _context3.next = 10;
                return this.mount();

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function recreate() {
        return _recreate.apply(this, arguments);
      };
    }(),
    subscribeAll: function subscribeAll() {}
  },
  created: function created() {
    var _this3 = this;

    /**
     * @type {module:ol/Object~BaseObject}
     * @private
     */
    this._olObject = undefined;
    Object.defineProperties(this, {
      $olObject: {
        enumerable: true,
        get: function get() {
          return _this3._olObject;
        }
      }
    });
    defineLifeCyclePromises.call(this);
    defineDebouncedHelpers.call(this);
  },
  mounted: function () {
    var _mounted = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.$createPromise;

            case 2:
              this._mounted = true;

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function mounted() {
      return _mounted.apply(this, arguments);
    };
  }(),
  beforeDestroy: function () {
    var _beforeDestroy = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return this.$mountPromise;

            case 2:
              this._mounted = false;

            case 3:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function beforeDestroy() {
      return _beforeDestroy.apply(this, arguments);
    };
  }(),
  destroyed: function () {
    var _destroyed = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return this.$unmountPromise;

            case 2:
              this._destroyed = true;

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function destroyed() {
      return _destroyed.apply(this, arguments);
    };
  }()
};

function defineLifeCyclePromises() {
  var _this4 = this;

  var makeEventEmitter = function makeEventEmitter(event) {
    return function () {
      _this4.$emit(event, _this4);

      if (process.env.VUELAYERS_DEBUG) {
        log(event, _this4.name);
      }

      return _this4;
    };
  }; // create


  this._createPromise = Promise.resolve(this.beforeInit()).then(function () {
    return _this4.init();
  }).then(makeEventEmitter('created')); // mount

  var mountObs = interval(1000 / 60).pipe(skipWhile(function () {
    return !_this4._mounted;
  }), first());
  this._mountPromise = mountObs.toPromise(Promise).then(function () {
    return _this4.mount();
  }).then(makeEventEmitter('mounted')); // unmount

  var unmountObs = interval(1000 / 60).pipe(skipUntil(mountObs), skipWhile(function () {
    return _this4._mounted;
  }), first());
  this._unmountPromise = unmountObs.toPromise(Promise).then(function () {
    return _this4.unmount();
  }).then(makeEventEmitter('unmounted')); // destroy

  var destroyObs = interval(1000 / 60).pipe(skipWhile(function () {
    return !_this4._destroyed;
  }), first());
  this._destroyPromise = destroyObs.toPromise(Promise).then(function () {
    return _this4.deinit();
  }).then(makeEventEmitter('destroyed'));
  Object.defineProperties(this, {
    $createPromise: {
      enumerable: true,
      get: function get() {
        return _this4._createPromise;
      }
    },
    $mountPromise: {
      enumerable: true,
      get: function get() {
        return _this4._mountPromise;
      }
    },
    $unmountPromise: {
      enumerable: true,
      get: function get() {
        return _this4._unmountPromise;
      }
    },
    $destroyPromise: {
      enumerable: true,
      get: function get() {
        return _this4._destroyPromise;
      }
    }
  });
}

function defineDebouncedHelpers() {
  var t = 1000 / 10; // bind debounced functions at runtime
  // for each instance to avoid interfering between
  // different instances

  this.scheduleRefresh = debounce(function () {
    return this.refresh();
  }, t);
  this.scheduleRemount = debounce(function () {
    return this.remount();
  }, t);
  this.scheduleRecreate = debounce(function () {
    return this.recreate();
  }, t);
}

export default olCmp;
