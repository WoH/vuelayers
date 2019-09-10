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
import { isArray, isEqual, isString } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';
import cmp from './ol-virt-cmp';
import useMapCmp from './use-map-cmp';

var source = {
  mixins: [cmp, useMapCmp],
  props: {
    attributions: {
      type: [String, Array],
      validator: function validator(value) {
        return isString(value) || isArray(value) && value.every(isString);
      }
    },
    attributionsCollapsible: {
      type: Boolean,
      default: true
    },
    projection: String,
    wrapX: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    state: function state() {
      if (!this.rev || !this.$source) {
        return;
      }

      return this.$source.getState();
    }
  },
  methods: {
    /**
     * @return {module:ol/source/Source~Source|Promise<module:ol/source/Source~Source>}
     * @protected
     */
    createOlObject: function createOlObject() {
      return this.createSource();
    },

    /**
     * @return {module:ol/source/Source~Source|Promise<module:ol/source/Source~Source>}
     * @protected
     * @abstract
     */
    createSource: function createSource() {
      throw new Error('Not implemented method');
    },

    /**
     * @return {Promise|void}
     * @protected
     */
    init: function init() {
      return cmp.methods.init.call(this);
    },

    /**
     * @return {Promise|void}
     * @protected
     */
    deinit: function deinit() {
      return cmp.methods.deinit.call(this);
    },

    /**
     * @return {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return mergeDescriptors(cmp.methods.getServices.call(this), {
        get source() {
          return vm.$source;
        }

      });
    },

    /**
     * @return {Promise|void}
     * @protected
     */
    mount: function mount() {
      this.$sourceContainer && this.$sourceContainer.setSource(this);
      return cmp.methods.mount.call(this);
    },

    /**
     * @return {Promise|void}
     * @protected
     */
    unmount: function unmount() {
      this.$sourceContainer && this.$sourceContainer.setSource(undefined);
      return cmp.methods.unmount.call(this);
    },

    /**
     * @return {Promise}
     */
    refresh: function refresh() {
      var _this = this;

      if (!this.$source) return Promise.resolve();
      return new Promise(function (resolve) {
        if (_this.$source) {
          _this.$source.once('change', function () {
            return resolve;
          });

          _this.$source.refresh();
        } else {
          resolve();
        }
      });
    },

    /**
     * Internal usage only in components that doesn't support refreshing.
     * @return {Promise}
     * @protected
     */
    remount: function remount() {
      return cmp.methods.remount.call(this);
    },

    /**
     * Internal usage only in components that doesn't support refreshing.
     * @return {Promise}
     * @protected
     */
    recreate: function recreate() {
      return cmp.methods.recreate.call(this);
    },

    /**
     * @protected
     */
    subscribeAll: function subscribeAll() {
      cmp.methods.subscribeAll.call(this);
    }
  },
  watch: {
    attributions: function attributions(value) {
      if (!this.$source || isEqual(value, this.$source.getAttributions())) {
        return;
      }

      this.$source.setAttributions(value);
    },
    attributionsCollapsible: function attributionsCollapsible(value) {
      if (!this.$source || value === this.$source.getAttributionsCollapsible()) {
        return;
      }

      this.scheduleRecreate();
    },
    projection: function projection(value) {
      if (!this.$source || this.$source.getProjection() && value === this.$source.getProjection().getCode()) {
        return;
      }

      this.scheduleRecreate();
    },
    wrapX: function wrapX(value) {
      if (!this.$source || value === this.$source.getWrapX()) {
        return;
      }

      this.scheduleRecreate();
    }
  },
  stubVNode: {
    empty: function empty() {
      return this.$options.name;
    }
  },
  created: function created() {
    defineServices.call(this);
  }
};

function defineServices() {
  var _this2 = this;

  Object.defineProperties(this, {
    /**
     * @type {module:ol/source/Source~Source|undefined}
     */
    $source: {
      enumerable: true,
      get: function get() {
        return _this2.$olObject;
      }
    },
    $map: {
      enumerable: true,
      get: function get() {
        return _this2.$services && _this2.$services.map;
      }
    },
    $view: {
      enumerable: true,
      get: function get() {
        return _this2.$services && _this2.$services.view;
      }
    },
    $sourceContainer: {
      enumerable: true,
      get: function get() {
        return _this2.$services && _this2.$services.sourceContainer;
      }
    }
  });
}

export default source;
