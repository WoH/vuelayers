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
import VectorLayer from 'ol/layer/Vector';
import vectorLayer from '../mixin/vector-layer';
import { pick } from '../util/minilo';

var RENDER_MODES = ['vector', 'image'];
/**
 * @vueProps
 */

var props = {
  /**
   * Render mode for vector layers. Available values:
   * - `image` - vector layers are rendered as images
   * - `vector` - vector layers are rendered as vectors
   * @type {string}
   * @default vector
   */
  renderMode: {
    type: String,
    default: 'vector',
    validator: function validator(val) {
      return RENDER_MODES.includes(val);
    }
  }
  /**
   * @vueMethods
   */

};
var methods = {
  /**
   * @return {Vector}
   * @protected
   */
  createLayer: function createLayer() {
    return new VectorLayer({
      id: this.id,
      minResolution: this.minResolution,
      maxResolution: this.maxResolution,
      opacity: this.opacity,
      visible: this.visible,
      extent: this.extent,
      zIndex: this.zIndex,
      updateWhileAnimating: this.updateWhileAnimating,
      updateWhileInteracting: this.updateWhileInteracting,
      source: this._source,
      renderMode: this.renderMode,
      renderBuffer: this.renderBuffer,
      renderOrder: this.renderOrder,
      declutter: this.declutter
    });
  }
};
/**
 * Layer for data that is rendered client-side.
 *
 * @vueProto
 * @title vl-layer-vector
 * @alias module:vector-layer/layer
 *
 * @vueSlot default Default slot for `vl-source-*` (vector-like only) components.
 */

var script = {
  name: 'vl-layer-vector',
  mixins: [vectorLayer],
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

  component.__file = "layer.vue";

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


var Layer = __vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Layer, options);
  Vue.component(Layer.name, Layer);
}

export default plugin;
export { Layer, plugin as install };
