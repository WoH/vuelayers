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
import BingMapsSource from 'ol/source/BingMaps';
import { tileSource } from '../mixin';
import { makeWatchers } from '../util/vue-helpers';
import { pick } from '../util/minilo';

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

var BINGMAPS_MAX_ZOOM = 21;
var BINGMAPS_CULTURE = 'en-us';
var script = {
  name: 'vl-source-bingmaps',
  mixins: [tileSource],
  props: {
    /**
     * Enables hidpi tiles.
     * @type {boolean}
     */
    hidpi: {
      type: Boolean,
      default: false
    },

    /**
     * Culture code.
     * @type {string}
     */
    culture: {
      type: String,
      default: BINGMAPS_CULTURE
    },

    /**
     * Bing Maps API key.
     * @type {string}
     */
    apiKey: {
      type: String,
      required: true
    },

    /**
     * Type of imagery.
     * @type {string}
     */
    imagerySet: {
      type: String,
      required: true
    },
    maxZoom: {
      type: Number,
      default: BINGMAPS_MAX_ZOOM
    },
    url: String
  },
  methods: {
    /**
     * @return {BingMaps}
     * @protected
     */
    createSource: function createSource() {
      return new BingMapsSource({
        cacheSize: this.cacheSize,
        hidpi: this.hidpi,
        culture: this.culture,
        key: this.apiKey,
        imagerySet: this.imagerySet,
        maxZoom: this.maxZoom,
        reprojectionErrorThreshold: this.reprojectionErrorThreshold,
        wrapX: this.wrapX,
        transition: this.transition,
        tileLoadFunction: this.tileLoadFunction
      });
    }
  },
  watch: _objectSpread({}, makeWatchers(['apiKey', 'imagerySet'], function () {
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

/**
 * @param {Vue} Vue
 * @param {VueLayersOptions} [options]
 */

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
