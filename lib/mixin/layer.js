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
import uuid from 'uuid/v4';
import Vue from 'vue';
import { getLayerId, initializeLayer, setLayerId } from '../ol-ext';
import { hasLayer, hasMap } from '../util/assert';
import { isEqual } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';
import { observableFromOlEvent } from '../rx-ext';
import { makeWatchers } from '../util/vue-helpers';
import cmp from './ol-virt-cmp';
import sourceContainer from './source-container';
import useMapCmp from './use-map-cmp';

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

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var layer = {
  mixins: [cmp, useMapCmp, sourceContainer],
  props: {
    id: {
      type: [String, Number],
      default: function _default() {
        return uuid();
      }
    },

    /**
     * The bounding extent for layer rendering defined in the map view projection.
     * The layer will not be rendered outside of this extent.
     * @default undefined
     * @type {number[]|undefined}
     */
    extent: {
      type: Array,
      validator: function validator(value) {
        return value.length === 4;
      }
    },
    minResolution: Number,
    maxResolution: Number,
    opacity: {
      type: Number,
      default: 1
    },
    overlay: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: true
    },
    zIndex: Number
  },
  methods: {
    /**
     * @return {Promise<module:ol/layer/BaseLayer~BaseLayer>}
     * @protected
     */
    createOlObject: function () {
      var _createOlObject = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var layer;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.createLayer();

              case 2:
                layer = _context.sent;
                initializeLayer(layer, this.id);
                return _context.abrupt("return", layer);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function createOlObject() {
        return _createOlObject.apply(this, arguments);
      };
    }(),

    /**
     * @return {module:ol/layer/BaseLayer~BaseLayer|Promise<module:ol/layer/BaseLayer~BaseLayer>}
     * @protected
     * @abstract
     */
    createLayer: function createLayer() {
      throw new Error('Not implemented method');
    },

    /**
     * @return {Promise<Vue<module:ol/layer/BaseLayer~BaseLayer>>}
     * @protected
     */
    init: function init() {
      return cmp.methods.init.call(this);
    },

    /**
     * @return {void|Promise}
     * @protected
     */
    deinit: function deinit() {
      return cmp.methods.deinit.call(this);
    },

    /**
     * @param {number[]} pixel
     * @return {boolean}
     */
    isAtPixel: function isAtPixel(pixel) {
      var _this = this;

      hasMap(this);
      return this.$map.forEachLayerAtPixel(pixel, function (layer) {
        return layer === _this.$layer;
      });
    },

    /**
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return mergeDescriptors(cmp.methods.getServices.call(this), sourceContainer.methods.getServices.call(this), {
        get layer() {
          return vm.$layer;
        }

      });
    },

    /**
     * @return {{
     *     setSource: function(module:ol/source/Source~Source): void,
     *     getSource: function(): module:ol/source/Source~Source
     *   }|undefined}
     * @protected
     */
    getSourceTarget: function getSourceTarget() {
      return this.$layer;
    },

    /**
     * @return {Promise}
     * @protected
     */
    mount: function mount() {
      if (this.overlay && this.$map) {
        this.setMap(this.$map);
      } else if (this.$layersContainer) {
        this.$layersContainer.addLayer(this);
      }

      return cmp.methods.mount.call(this);
    },

    /**
     * @return {Promise}
     * @protected
     */
    unmount: function unmount() {
      if (this.overlay) {
        this.setMap(undefined);
      } else if (this.$layersContainer) {
        this.$layersContainer.removeLayer(this);
      }

      return cmp.methods.unmount.call(this);
    },

    /**
     * Updates layer state
     * @return {Promise}
     */
    refresh: function refresh() {
      return cmp.methods.refresh.call(this);
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
      return cmp.methods.remount.call(this);
    },

    /**
     * @protected
     */
    subscribeAll: function subscribeAll() {
      cmp.methods.subscribeAll.call(this);
      subscribeToLayerEvents.call(this);
    },

    /**
     * @param {module:ol/Map~Map|Vue|undefined} map
     */
    setMap: function setMap(map) {
      hasLayer(this);
      map = map instanceof Vue ? map.$map : map;
      this.$layer.setMap(map);
    }
  },
  watch: _objectSpread({
    id: function id(value) {
      if (!this.$layer || value === getLayerId(this.$layer)) {
        return;
      }

      setLayerId(this.$layer, value);
    },
    maxResolution: function maxResolution(value) {
      if (!this.$layer || value === this.$layer.getMaxResolution()) {
        return;
      }

      this.$layer.setMaxResolution(value);
    },
    minResolution: function minResolution(value) {
      if (!this.$layer || value === this.$layer.getMinResolution()) {
        return;
      }

      this.$layer.setMinResolution(value);
    },
    opacity: function opacity(value) {
      if (!this.$layer || value === this.$layer.getOpacity()) {
        return;
      }

      this.$layer.setOpacity(value);
    },
    visible: function visible(value) {
      if (!this.$layer || value === this.$layer.getVisible()) {
        return;
      }

      this.$layer.setVisible(value);
    },
    zIndex: function zIndex(value) {
      if (!this.$layer || value === this.$layer.getZIndex()) {
        return;
      }

      this.$layer.setZIndex(value);
    },
    extent: function extent(value) {
      if (!this.$layer || isEqual(value, this.$layer.getExtent())) {
        return;
      }

      this.$layer.setExtent(value);
    }
  }, makeWatchers(['overlay'], function () {
    return function (value, prevValue) {
      if (isEqual(value, prevValue)) return;
      this.scheduleRecreate();
    };
  })),
  stubVNode: {
    attrs: function attrs() {
      return {
        id: [this.$options.name, this.id].join('-'),
        class: this.$options.name
      };
    }
  },
  created: function created() {
    defineServices.call(this);
  }
};

function defineServices() {
  var _this2 = this;

  Object.defineProperties(this, {
    $layer: {
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
    $layersContainer: {
      enumerable: true,
      get: function get() {
        return _this2.$services && _this2.$services.layersContainer;
      }
    }
  });
}

function subscribeToLayerEvents() {
  var _this3 = this;

  hasLayer(this);
  var events = observableFromOlEvent(this.$layer, ['postcompose', 'precompose', 'render']);
  this.subscribeTo(events, function (evt) {
    return _this3.$emit(evt.type, evt);
  });
}

export default layer;
