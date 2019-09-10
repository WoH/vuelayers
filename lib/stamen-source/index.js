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
import StamenSource from 'ol/source/Stamen';
import xyzSource from '../mixin/xyz-source';
import { pick } from '../util/minilo';

var props = {
  /**
   * Stamen layer name
   *
   * @type {string}
   */
  layer: {
    type: String,
    required: true
  },

  /**
   * If nothing provided then default url resolved
   * with current layer params will be used.
   * @see {ol.source.Stamen}
   *
   * @type {string}
   */
  url: String
};
var methods = {
  createSource: function createSource() {
    return new StamenSource({
      cacheSize: this.cacheSize,
      layer: this.layer,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      opaque: this.opaque,
      reprojectionErrorThreshold: this.reprojectionErrorThreshold,
      tileLoadFunction: this.tileLoadFunction,
      url: this.urlTmpl || undefined,
      wrapX: this.wrapX
    });
  }
};
var script = {
  name: 'vl-source-stamen',
  mixins: [xyzSource],
  props: props,
  methods: methods
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
