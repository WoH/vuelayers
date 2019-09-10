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
import Vue from 'vue';
import IdentityMap from '../util/identity-map';
import { identity } from '../util/minilo';

// const IDENTITY_MAP_PROP = Symbol('identityMap')

var IDENTITY_MAP_PROP = 'identityMap';
var identMap = {
  IDENTITY_MAP_PROP: IDENTITY_MAP_PROP,
  props: {
    /**
     * Unique key for saving to identity map
     * @type {string|number}
     * @experimental
     */
    ident: [String, Number]
  },
  methods: {
    /**
     * @param parts
     * @return {string|undefined}
     * @protected
     */
    makeSelfIdent: function makeSelfIdent() {
      if (!this.ident) return;

      for (var _len = arguments.length, parts = new Array(_len), _key = 0; _key < _len; _key++) {
        parts[_key] = arguments[_key];
      }

      return this.makeIdent.apply(this, [this.ident].concat(parts));
    },

    /**
     * @param parts
     * @return {string}
     */
    makeIdent: function makeIdent() {
      for (var _len2 = arguments.length, parts = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        parts[_key2] = arguments[_key2];
      }

      return parts.filter(identity).join('.');
    }
  },
  created: function created() {
    initIdentityMap.call(this);
  }
};
/**
 * @private
 */

function initIdentityMap() {
  var _this = this;

  if (!this[IDENTITY_MAP_PROP]) {
    Vue[IDENTITY_MAP_PROP] = Vue.prototype[IDENTITY_MAP_PROP] = new IdentityMap();
  }

  Object.defineProperties(this, {
    $identityMap: {
      enumerable: true,
      get: function get() {
        return _this[IDENTITY_MAP_PROP];
      }
    }
  });
}

export default identMap;
