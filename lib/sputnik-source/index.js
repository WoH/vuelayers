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
import { pick } from '../util/minilo';

/**
 * Layer source to work with Sputnik.ru tile server.
 */

var SPUTNIK_URL_TEMPLATE = 'http://tiles.maps.sputnik.ru/{z}/{x}/{y}.png?apikey={apikey}';
var SPUTNIK_ATTRIBUTIONS = '<a href="http://maps.sputnik.ru/" target="_blank">Спутник</a> ' + '&copy; <a href="http://rt.ru/" target="_blank">Ростелеком</a>, ' + new Date().getFullYear();
var props = {
  url: {
    type: String,
    default: SPUTNIK_URL_TEMPLATE
  },
  apiKey: {
    type: String
  },
  attributions: {
    type: String,
    default: SPUTNIK_ATTRIBUTIONS
  }
};
var computed = {
  /**
   * @type {string[]}
   */
  urlTokens: function urlTokens() {
    return ['apiKey'];
  }
};
var script = {
  name: 'vl-source-sputnik',
  mixins: [xyzSource],
  props: props,
  computed: computed
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
