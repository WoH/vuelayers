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
import xyzSource from '../mixin/xyz-source';
import { EPSG_3857, TILE_FORMAT } from '../ol-ext/consts';
import { coalesce, pick } from '../util/minilo';

var MAPBOX_URL_TEMPLATE = 'https://{a-c}.tiles.mapbox.com/v4/{mapId}/{z}/{x}/{y}{tileNameSuffix}.{tileFormat}?access_token={accessToken}';
var MAPBOX_ATTRIBUTIONS = '&copy; <a href="https://www.mapbox.com/" target="_blank">MapBox</a>, ' + new Date().getFullYear();
var props = {
  accessToken: {
    type: String,
    required: true
  },
  attributions: {
    type: [String, Array],
    default: MAPBOX_ATTRIBUTIONS
  },
  mapId: {
    type: String,
    required: true
  },
  projection: {
    type: String,
    default: EPSG_3857
  },
  tileFormat: {
    type: String,
    default: TILE_FORMAT
  },
  url: {
    type: String,
    default: MAPBOX_URL_TEMPLATE
  }
};
var computed = {
  /**
   * @type {string}
   */
  tileNameSuffix: function tileNameSuffix() {
    return _tileNameSuffix(this.tilePixelRatio);
  },

  /**
   * @type {string[]}
   */
  urlTokens: function urlTokens() {
    return ['mapId', 'accessToken', 'tileNameSuffix', 'tileFormat'];
  }
};
var script = {
  name: 'vl-source-mapbox',
  mixins: [xyzSource],
  props: props,
  computed: computed
  /**
   * @param {number} [ratio]
   * @returns {number}
   * @private
   */

};

function tileRatio(ratio) {
  ratio = coalesce(ratio, 1);
  return ratio > 1 ? 2 : 1;
}
/**
 * @param {number} [ratio]
 * @returns {string}
 * @private
 */


function _tileNameSuffix(ratio) {
  ratio = tileRatio(ratio);
  return ratio > 1 ? ['@', ratio, 'x'].join('') : '';
}

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
