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
import OSMSource from 'ol/source/OSM';
import xyzSource from '../mixin/xyz-source';
import { pick } from '../util/minilo';

var OSM_ATTRIBUTIONS = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.';
var OSM_URL_TEMPLATE = 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var OSM_MAX_ZOOM = 19;
var props = {
  attributions: {
    type: [String, Array],
    default: OSM_ATTRIBUTIONS
  },
  maxZoom: {
    type: Number,
    default: OSM_MAX_ZOOM
  },
  url: {
    type: String,
    default: OSM_URL_TEMPLATE
  }
};
var methods = {
  createSource: function createSource() {
    // always EPSG:3857, size: 256x256, format png
    return new OSMSource({
      url: this.urlTmpl,
      attributions: this.attributions,
      crossOrigin: this.crossOrigin,
      maxZoom: this.maxZoom,
      cacheSize: this.cacheSize,
      opaque: this.opaque,
      reprojectionErrorThreshold: this.reprojectionErrorThreshold,
      wrapX: this.wrapX,
      transition: this.transition
    });
  }
};
var script = {
  name: 'vl-source-osm',
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
