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
import { WMS_VERSION } from '../ol-ext';
import { hasSource, hasView } from '../util/assert';
import { isEqual, reduce } from '../util/minilo';
import { makeWatchers } from '../util/vue-helpers';

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

var _cleanExtParams = function cleanExtParams(params) {
  return reduce(params, function (params, value, key) {
    var filterKeys = ['LAYERS', 'VERSION', 'STYLES', 'FORMAT', 'TRANSPARENT', 'BGCOLOR', 'TIME'];
    key = key.toUpperCase();

    if (filterKeys.includes(key)) {
      return params;
    }

    params[key] = value;
    return params;
  }, {});
};

var props = {
  /**
   * Extra WMS request parameters
   */
  extParams: Object,
  layers: {
    type: String,
    required: true
  },
  styles: String,
  // WMS Request styles
  version: {
    type: String,
    default: WMS_VERSION
  },
  transparent: {
    type: Boolean,
    default: true
  },
  format: {
    type: String,
    default: 'image/png'
  },
  bgColor: String,
  time: String
};
var computed = {
  cleanExtParams: function cleanExtParams() {
    return this.extParams ? _cleanExtParams(this.extParams) : undefined;
  },
  allParams: function allParams() {
    return _objectSpread({}, this.cleanExtParams, {
      LAYERS: this.layers,
      STYLES: this.styles,
      VERSION: this.version,
      FORMAT: this.format,
      TRANSPARENT: this.transparent,
      BGCOLOR: this.bgColor,
      TIME: this.time
    });
  }
};
var methods = {
  /**
   * @param {number[]} coordinate
   * @param {number} [resolution]
   * @param {string} [projection]
   * @param {Object} [params] GetFeatureInfo params. `info_format` at least should be provided.
   *                          If `query_layers` is not provided then the layers specified in the `layers` prop will be used.
   *                          `version` should not be specified here (value from `version` prop will be used).
   * @return {string|undefined}
   */
  getFeatureInfoUrl: function getFeatureInfoUrl(coordinate, resolution, projection) {
    var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    hasView(this);
    hasSource(this);
    resolution || (resolution = this.$view.getResolution());
    projection || (projection = this.projection);
    params = _objectSpread({}, this.allParams, params);
    return this.$source.getGetFeatureInfoUrl(coordinate, resolution, projection, params);
  }
};

var watch = _objectSpread({}, makeWatchers(['layers', 'version', 'styles', 'transparent', 'format', 'bgColor', 'time'], function (prop) {
  return function (value, prevValue) {
    if (isEqual(value, prevValue)) return;
    prop = prop.toUpperCase();
    this.$source && this.$source.updateParams(_defineProperty({}, prop, value));
  };
}), {
  extParams: function extParams(value) {
    this.$source && this.$source.updateParams(value ? _cleanExtParams(value) : undefined);
  }
});

var wmsSource = {
  props: props,
  computed: computed,
  methods: methods,
  watch: watch
};

export default wmsSource;
