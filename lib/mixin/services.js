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
import mergeDescriptors from '../util/multi-merge-descriptors';

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

// const SERVICES_PROP = Symbol('services')

var SERVICES_PROP = 'services';
/**
 * Service container mixin
 */

var services = {
  inject: {
    $services: SERVICES_PROP // todo works only in Vue 2.5.x
    // $services: {from: SERVICES_PROP, default: Object.create(null)},

  },
  provide: function provide() {
    return _defineProperty({}, SERVICES_PROP, this.getServices());
  },
  methods: {
    /**
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      return mergeDescriptors({}, this.$services || {});
    }
  },
  beforeCreate: function beforeCreate() {
    var source = this.$parent;

    while (source) {
      if (source._provided != null && source._provided[SERVICES_PROP] != null) {
        break;
      }

      source = source.$parent;
    }

    if (source == null || source._provided[SERVICES_PROP] == null) {
      delete this.$options.inject.$services;
    }
  }
};

export default services;
