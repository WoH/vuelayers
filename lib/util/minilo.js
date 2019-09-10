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
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var _context;

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(range);

/**
 * Mini Lodash.
 */
var glob = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};
var globIsFinite = glob.isFinite || noop;
var objectProto = Object.prototype;
var funcProto = Object.prototype;
var objectToString = objectProto.toString;
var funcToString = funcProto.toString;
var objectTag = (_context = {}, objectToString).call(_context);
var numberTag = (_context = 0, objectToString).call(_context);
var stringTag = (_context = '', objectToString).call(_context);
var booleanTag = (_context = true, objectToString).call(_context);
var objectCtorString = funcToString.call(Object);
function noop() {// do nothing
}
function constant(value) {
  return function () {
    return value;
  };
}
function stubArray() {
  return [];
}
function identity(value) {
  return value;
}
function toArray(value) {
  return Array.from(value);
}
function isBoolean(value) {
  return objectToString.call(value) === booleanTag;
}
function isNumber(value) {
  return objectToString.call(value) === numberTag;
}
function isString(value) {
  return objectToString.call(value) === stringTag;
}
function isArray(value) {
  return Array.isArray(value);
}
function isArrayLike(value) {
  return isObjectLike(value) && value.hasOwnProperty('length');
}
function isFinite(value) {
  return typeof value === 'number' && globIsFinite(value);
}
function isFunction(value) {
  return typeof value === 'function';
}
/**
 * @param {*} value
 * @return {boolean} True if value is number or numeric string.
 */

function isNumeric(value) {
  return !isNaN(parseFloat(value)) && globIsFinite(value);
}
function isObjectLike(value) {
  return value != null && _typeof(value) === 'object';
}
function isPlainObject(value) {
  if (!isObjectLike(value) || objectToString.call(value) !== objectTag) {
    return false;
  }

  var proto = Object.getPrototypeOf(value);

  if (proto == null) {
    return true;
  }

  var Ctor = proto.constructor;
  return typeof Ctor === 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) === objectCtorString;
}
/**
 * @param {...*} [args]
 *
 * @return {*}
 */

function coalesce() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.find(function (val) {
    return val != null;
  });
}
/**
 * @param {Object} object
 * @return {Object} Returns object only with plain properties.
 */

function plainProps(object) {
  var newObject = {};

  var isPlain = function isPlain(x) {
    return isNumeric(x) || isString(x) || isArray(x) || isBoolean(x) || isPlainObject(x);
  };

  Object.keys(object).forEach(function (key) {
    if (isPlain(object[key])) {
      newObject[key] = object[key];
    }
  });
  return newObject;
}
/**
 * Replaces `tokens` in the `string` by values from the `replaces`.
 *
 * @param {string} string
 * @param {Object} replaces
 *
 * @returns {string}
 */

function replaceTokens(string, replaces) {
  var regExp = new RegExp(Object.keys(replaces).map(function (field) {
    return '(\\{' + field + '\\})';
  }).join('|'), 'ig');
  return string.replace(regExp, function (match) {
    return replaces[match.substr(1, match.length - 2)] || '';
  });
}
function isEqual(value, other) {
  if (value === other) {
    return true;
  }

  if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
    // eslint-disable-next-line no-self-compare
    return value !== value && other !== other;
  }

  var valueProps = Object.keys(value);
  var otherProps = Object.keys(other);

  if (valueProps.length !== otherProps.length) {
    return false;
  }

  var checked = [];

  var traverse = function traverse(valueProps, otherProps) {
    for (var i = 0, l = valueProps.length; i < l; i++) {
      var valueProp = valueProps[i];

      if (checked.includes(valueProp)) {
        continue;
      }

      if (other.hasOwnProperty(valueProp) === false) {
        return false;
      }

      var otherProp = otherProps[i];

      if (!isEqual(value[valueProp], other[otherProp])) {
        return false;
      }

      checked.push(otherProp);
    }

    return true;
  };

  if (traverse(valueProps, otherProps) === false) {
    return false;
  }

  return traverse(otherProps, valueProps);
}
function isEmpty(value) {
  return !value || isArrayLike(value) && value.length === 0 || isObjectLike(value) && Object.keys(value).length === 0;
}
function isNotEmpty(value) {
  return !isEmpty(value);
}
function forEach(collection, iteratee) {
  var keys = Object.keys(collection);

  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    var value = collection[key];

    if (iteratee(value, key) === false) {
      return;
    }
  }
}
function reduce(collection, iteratee, initial) {
  var result = initial;
  forEach(collection, function (value, key) {
    result = iteratee(result, value, key);
  });
  return result;
}
function filter(collection) {
  var iteratee = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : isNotEmpty;
  return reduce(collection, function (newCollection, value, key) {
    if (iteratee(value, key)) {
      if (isArray(newCollection)) {
        newCollection.push(value);
      } else {
        newCollection[key] = value;
      }
    }

    return newCollection;
  }, isArray(collection) ? [] : {});
}
function map(collection) {
  var iteratee = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;
  return reduce(collection, function (newCollection, value, key) {
    newCollection[key] = iteratee(value, key);
    return newCollection;
  }, isArray(collection) ? [] : {});
}
function mapValues(object) {
  var iteratee = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;
  return map(object, iteratee);
}
function mapKeys(object) {
  var iteratee = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;
  return reduce(object, function (newObject, value, key) {
    newObject[iteratee(value, key)] = value;
    return newObject;
  });
}
function firstEl(object) {
  if (!isArrayLike(object)) return;
  return object[0];
}
function lastEl(object) {
  if (!isArrayLike(object)) return;
  return object[object.length - 1];
}
function pick(object, key) {
  for (var _len2 = arguments.length, keys = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    keys[_key2 - 2] = arguments[_key2];
  }

  if (Array.isArray(key)) {
    keys = key;
  } else {
    keys = [key].concat(keys);
  }

  return reduce(keys, function (picked, key) {
    picked[key] = object[key];
    return picked;
  }, {});
}
function omit(object, key) {
  for (var _len3 = arguments.length, keys = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    keys[_key3 - 2] = arguments[_key3];
  }

  if (Array.isArray(key)) {
    keys = key;
  } else {
    keys = [key].concat(keys);
  }

  return filter(object, function (value, key) {
    return !keys.includes(key);
  });
}
function upperFirst(string) {
  string = String(string);

  if (string.length === 0) {
    return '';
  }

  return string[0].toUpperCase() + string.slice(1);
}
function lowerFirst(string) {
  string = String(string);

  if (string.length === 0) {
    return '';
  }

  return string[0].toLowerCase() + string.slice(1);
}
function range(start, end) {
  var step,
      i,
      _args = arguments;
  return regeneratorRuntime.wrap(function range$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          step = _args.length > 2 && _args[2] !== undefined ? _args[2] : 1;
          i = start;

        case 2:
          if (!(i < end)) {
            _context2.next = 8;
            break;
          }

          _context2.next = 5;
          return i;

        case 5:
          i += step;
          _context2.next = 2;
          break;

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked, this);
}
function get(object, path, defaultValue) {
  // eslint-disable-next-line no-new-func
  var fn = new Function('object', "try { return object.".concat(path, " } catch (e) {}"));
  return coalesce(fn(object), defaultValue);
}
function includes(array, value) {
  var comparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : isEqual;
  var elems = filter(array, function (elem) {
    return comparator(elem, value);
  });
  return elems.shift();
}
function difference(array1, array2) {
  var comparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : isEqual;
  return filter(array1, function (value) {
    return !includes(array2, value, comparator);
  });
}
/**
 * @param {string} str
 * @return {string}
 */

function camelCase(str) {
  var regExp = /([-_]\w)/g;
  return str.replace(regExp, function (matches) {
    return matches[1].toUpperCase();
  });
}
function arrayLengthValidator(len) {
  return function (len) {
    return function (value) {
      return isArray(value) && value.length === len;
    };
  };
}

export { noop, constant, stubArray, identity, toArray, isBoolean, isNumber, isString, isArray, isArrayLike, isFinite, isFunction, isNumeric, isObjectLike, isPlainObject, coalesce, plainProps, replaceTokens, isEqual, isEmpty, isNotEmpty, forEach, reduce, filter, map, mapValues, mapKeys, firstEl, lastEl, pick, omit, upperFirst, lowerFirst, range, get, includes, difference, camelCase, arrayLengthValidator };
