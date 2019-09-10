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
import WMTSSource from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { makeWatchers } from '../util/vue-helpers';
import tileSource from '../mixin/tile-source';
import { EXTENT_CORNER, WMTS_FORMAT, WMTS_REQUEST_ENCODING, WMTS_VERSION } from '../ol-ext/consts';
import { createExtentFromProjection, getExtentCorner } from '../ol-ext/extent';
import { resolutionsFromExtent } from '../ol-ext/tile-grid';
import { range, pick } from '../util/minilo';

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

var script = {
  name: 'vl-source-wmts',
  mixins: [tileSource],
  props: {
    dimensions: Object,
    format: {
      type: String,
      default: WMTS_FORMAT
    },
    layerName: {
      type: String,
      required: true
    },
    matrixSet: {
      type: String,
      required: true
    },
    requestEncoding: {
      type: String,
      default: WMTS_REQUEST_ENCODING
    },
    styleName: {
      type: String,
      required: true
    },
    version: {
      type: String,
      default: WMTS_VERSION
    },
    url: {
      type: String,
      required: true
    },
    origin: {
      type: Array
    },
    resolutions: {
      type: Array
    }
  },
  methods: {
    /**
     * @returns {WMTS}
     * @protected
     */
    createSource: function createSource() {
      return new WMTSSource({
        attributions: this.attributions,
        cacheSize: this.cacheSize,
        crossOrigin: this.crossOrigin,
        dimensions: this.dimensions,
        format: this.format,
        layer: this.layerName,
        logo: this.logo,
        matrixSet: this.matrixSet,
        origin: this.origin,
        projection: this.projection,
        reprojectionErrorThreshold: this.reprojectionErrorThreshold,
        requestEncoding: this.requestEncoding,
        resolutions: this.resolutions,
        tileGrid: this._tileGrid,
        tilePixelRatio: this.tilePixelRatio,
        style: this.styleName,
        version: this.version,
        url: this.urlTmpl,
        wrapX: this.wrapX,
        transition: this.transition,
        tileLoadFunction: this.tileLoadFunction
      });
    },

    /**
     * @return {Promise}
     * @protected
     */
    init: function init() {
      var extent = createExtentFromProjection(this.projection);
      var resolutions = this.resolutions ? this.resolutions : resolutionsFromExtent(extent, this.maxZoom, this.tileSize);
      var origin = this.origin ? this.origin : getExtentCorner(extent, EXTENT_CORNER.TOP_LEFT);
      var matrixIds = Array.from(range(this.minZoom, resolutions.length));
      /**
       * @type {module:ol/Tile~UrlFunction}
       * @protected
       */

      this._tileGrid = new WMTSTileGrid({
        extent: extent,
        origin: origin,
        resolutions: resolutions,
        tileSize: this.tileSize,
        minZoom: this.minZoom,
        matrixIds: matrixIds
      });
      return tileSource.methods.init.call(this);
    }
  },
  watch: _objectSpread({}, makeWatchers(['dimensions', 'format', 'layerName', 'matrixSet', 'requestEncoding', 'styleName', 'version', 'resolutions', 'origin'], function () {
    return function () {
      this.scheduleRecreate();
    };
  }))
};

/* script */
var __vue_script__ = script;
/* template */

/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = undefined;
/* component normalizer */

function __vue_normalize__(template, style, script$$1, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "source.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var Source = __vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Source, options);
  Vue.component(Source.name, Source);
}

export default plugin;
export { Source, plugin as install };
