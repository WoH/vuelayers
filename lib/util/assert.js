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
import { isNumeric } from './minilo';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var AssertionError =
/*#__PURE__*/
function (_Error) {
  _inherits(AssertionError, _Error);

  function AssertionError(message) {
    var _this;

    _classCallCheck(this, AssertionError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, message));
    _this.name = _this.constructor.name;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(_assertThisInitialized(_assertThisInitialized(_this)), _this.constructor);
    } else {
      _this.stack = new Error(message).stack;
    }

    return _this;
  }

  return AssertionError;
}(_wrapNativeSuper(Error));
/**
 * @param {*} value
 * @param {string} message
 * @throws AssertionError
 */

function assert(value, message) {
  if (!value) {
    throw new AssertionError(message || "Assertion failed");
  }
}
/**
 * Alias of `assert` function.
 * @param value
 * @param message
 */

function ok(value, message) {
  return assert(value, message);
}
/**
 * @param {*} value
 * @throws {AssertionError}
 */

function numeric(value) {
  assert(isNumeric(value), 'value is a number');
}
/**
 * @param {*} value
 * @param {Function} Ctor
 * @throws {AssertionError}
 */

function instanceOf(value, Ctor) {
  assert(value instanceof Ctor, "value is an instance of ".concat(Ctor.name));
}
function hasOlObject(vm) {
  assert(vm.$olObject, 'component has "$olObject" property');
}
/**
 * @param {Object} vm
 * @return {void}
 * @throws {AssertionError}
 */

function hasMap(vm) {
  assert(vm.$map, 'component has "$map" property');
}
/**
 * @param {Object} vm
 * @return {void}
 * @throws {AssertionError}
 */

function hasView(vm) {
  assert(vm.$view, 'component has "$view" property');
}
/**
 * @param {Object} vm
 * @return {void}
 * @throws {AssertionError}
 */

function hasGeolocation(vm) {
  assert(vm.$geolocation, 'component has "$geolocation" property');
}
/**
 * @param {Object} vm
 * @return {void}
 * @throws {AssertionError}
 */

function hasFeature(vm) {
  assert(vm.$feature, 'component has "$feature" property');
}
/**
 * @param {Object} vm
 * @return {void}
 * @throws {AssertionError}
 */

function hasLayer(vm) {
  assert(vm.$layer, 'component has "$layer" property');
}
/**
 * @param {Object} vm
 * @return {void}
 * @throws {AssertionError}
 */

function hasSource(vm) {
  assert(vm.$source, 'component has "$source" property');
}
/**
 * @param {Object} vm
 * @return {void}
 * @throws {AssertionError}
 */

function hasGeometry(vm) {
  assert(vm.$geometry, 'component has "$geometry" property');
}
/**
 * @param {Object} vm
 * @return {void}
 * @throws {AssertionError}
 */

function hasInteraction(vm) {
  assert(vm.$interaction, 'component has "$interaction" property');
}
/**
 * @param {Object} vm
 * @return {void}
 * @throws {AssertionError}
 */

function hasStyle(vm) {
  assert(vm.$style, 'component has "$style" property');
}
/**
 * @param {Object} vm
 * @return {void}
 * @throws {AssertionError}
 */

function hasOverlay(vm) {
  assert(vm.$overlay, 'component has "$overlay" property');
}
function hasGraticule(vm) {
  assert(vm.$graticule, 'component has "$graticule" property');
}

export { AssertionError, assert, ok, numeric, instanceOf, hasOlObject, hasMap, hasView, hasGeolocation, hasFeature, hasLayer, hasSource, hasGeometry, hasInteraction, hasStyle, hasOverlay, hasGraticule };
