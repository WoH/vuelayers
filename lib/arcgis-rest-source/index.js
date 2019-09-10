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
import TileArcGISRestSource from 'ol/source/TileArcGISRest';
import { tileSource, arcgisSource } from '../mixin';
import { pick } from '../util/minilo';

var script = {
  name: 'vl-source-arcgis-rest',
  mixins: [tileSource, arcgisSource],
  props: {
    url: {
      type: String,
      required: true,
      validator: function validator(value) {
        return !!value.length;
      }
    }
  },
  methods: {
    createSource: function createSource() {
      return new TileArcGISRestSource({
        attributions: this.attributions,
        cacheSize: this.cacheSize,
        crossOrigin: this.crossOrigin,
        params: this.allParams,
        tileGrid: this._tileGrid,
        projection: this.projection,
        reprojectionErrorThreshold: this.reprojectionErrorThreshold,
        tileLoadFunction: this.tileLoadFunction,
        url: this.urlTmpl,
        wrapX: this.wrapX,
        transition: this.transition
      });
    }
  }
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
