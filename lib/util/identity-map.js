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
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/**
 * Simple Identity map with refs count
 */
var IdentityMap =
/*#__PURE__*/
function () {
  function IdentityMap() {
    _classCallCheck(this, IdentityMap);

    _defineProperty(this, "pools", Object.create(null));
  }

  _createClass(IdentityMap, [{
    key: "_preparePool",

    /**
     * @param {string} pool
     * @private
     */
    value: function _preparePool(pool) {
      this.pools[pool] || (this.pools[pool] = Object.create(null));
    }
    /**
     * @param {string} id
     * @param {*} value
     * @param {string} pool
     */

  }, {
    key: "set",
    value: function set(id, value) {
      var pool = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'default';
      if (value == null) return;

      this._preparePool(pool);

      this.pools[pool][id] = {
        value: value,
        refs: 1
      };
    }
    /**
     * @param {string} id
     * @param {string} pool
     */

  }, {
    key: "get",
    value: function get(id) {
      var pool = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

      this._preparePool(pool);

      var rec = this.pools[pool][id];
      if (!rec || rec.value == null) return;
      rec.refs++;
      this.pools[pool][id] = rec;
      return rec.value;
    }
    /**
     * @param {string} id
     * @param {string} pool
     */

  }, {
    key: "unset",
    value: function unset(id) {
      var pool = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

      this._preparePool(pool);

      var rec = this.pools[pool][id];
      if (!rec || rec.value == null) return;
      rec.refs--;

      if (rec.refs === 0) {
        delete this.pools[pool][id];
      } else {
        this.pools[pool][id] = rec;
      }
    }
    /**
     * @param {string} id
     * @param {string} pool
     * @return {boolean}
     */

  }, {
    key: "has",
    value: function has(id) {
      var pool = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

      this._preparePool(pool);

      return !!this.pools[pool][id];
    }
    /**
     * @param {string} pool
     * @return {string[]}
     */

  }, {
    key: "ids",
    value: function ids() {
      var pool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';

      this._preparePool(pool);

      return Object.keys(this.pools[pool]);
    }
    /**
     * @param {string} id
     * @param {string} pool
     * @return {*}
     */

  }, {
    key: "refs",
    value: function refs(id) {
      var pool = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

      this._preparePool(pool);

      return this.has(id, pool) ? this.pools[pool][id].refs : undefined;
    }
  }]);

  return IdentityMap;
}();

export default IdentityMap;
