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
import { cleanSourceExtraParams, ARCGIS_EXTRA_PARAMS } from '../ol-ext';
import { isEqual, pick } from '../util/minilo';
import { makeWatchers } from '../util/vue-helpers';

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

var serialize = function serialize(value) {
  if (value == null) return value;
  return _typeof(value) === 'object' ? JSON.stringify(value) : value;
};

var arcgisSource = {
  props: {
    /**
     * Extra ArcGIS request parameters
     * todo rename to extraParams
     */
    extParams: Object,
    format: {
      type: String,
      default: 'PNG32'
    },
    layers: String,
    layerDefs: [Object, String],
    dynamicLayers: [Object, String],
    dpi: Number,
    transparent: {
      type: Boolean,
      default: true
    },
    time: String,
    layerTimeOptions: [Object, String],
    gdbVersion: String,
    mapScale: String,
    rotation: Number,
    datumTransformations: [Array, String],
    mapRangeValues: [Array, String],
    layerRangeValues: [Array, String],
    layerParameterValues: [Array, String],
    historicMoment: Number
  },
  computed: {
    // todo rename to cleanExtraParams
    cleanExtParams: function cleanExtParams() {
      return this.extParams ? cleanSourceExtraParams(this.extParams, ARCGIS_EXTRA_PARAMS) : undefined;
    },
    allParams: function allParams() {
      return _objectSpread({}, this.cleanExtParams, {
        LAYERS: this.layers,
        FORMAT: this.format,
        LAYERDEFS: serialize(this.layerDefs),
        DYNAMICLAYERS: serialize(this.dynamicLayers),
        DPI: this.dpi,
        TRANSPARENT: this.transparent,
        TIME: serialize(this.time),
        LAYERTIMEOPTIONS: serialize(this.layerTimeOptions),
        GDBVERSION: this.gdbVersion,
        MAPSCALE: this.mapScale,
        ROTATION: this.rotation,
        DATUMTRANSFORMATIONS: serialize(this.datumTransformations),
        MAPRANGEVALUES: serialize(this.mapRangeValues),
        LAYERRANGEVALUES: serialize(this.layerRangeValues),
        LAYERPARAMETERVALUES: serialize(this.layerParameterValues),
        HISTORICMOMENT: serialize(this.historicMoment)
      });
    }
  },
  watch: _objectSpread({}, makeWatchers(['layers', 'format', 'dpi', 'transparent', 'gdbVersion', 'mapScale', 'rotation', 'historicMoment'], function (prop) {
    return function (value) {
      if (!this.$source) return;
      prop = prop.toUpperCase();
      var params = this.$source.getParams() || {};
      if (isEqual(value, params[value])) return;
      this.$source.updateParams(_defineProperty({}, prop, value));
    };
  }), makeWatchers(['layerDefs', 'dynamicLayers', 'time', 'layerTimeOptions', 'datumTransformations', 'mapRangeValues', 'layerRangeValues', 'layerParameterValues'], function (prop) {
    return function (value) {
      if (!this.$source) return;
      prop = prop.toUpperCase();
      value = serialize(value);
      var params = this.$source.getParams() || {};
      if (isEqual(value, params[value])) return;
      this.$source.updateParams(_defineProperty({}, prop, value));
    };
  }), {
    extParams: function extParams(value) {
      if (!this.$source) return;
      var params = pick(this.$source.getParams() || {}, Object.keys(value));
      if (isEqual(value, params)) return;
      this.$source.updateParams(value ? cleanSourceExtraParams(value) : undefined);
    }
  })
};

export default arcgisSource;
