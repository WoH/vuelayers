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
import ImageLayer from 'ol/layer/Image';
import layer from '../mixin/layer';
import { pick } from '../util/minilo';

/**
 * @vueProps
 */

var props =
/** @lends module:image-layer/layer# */
{};
/**
 * @vueMethods
 */

var methods =
/** @lends module:image-layer/layer# */
{
  /**
   * @return {Image}
   * @protected
   */
  createLayer: function createLayer() {
    return new ImageLayer({
      id: this.id,
      minResolution: this.minResolution,
      maxResolution: this.maxResolution,
      opacity: this.opacity,
      visible: this.visible,
      extent: this.extent,
      zIndex: this.zIndex,
      source: this._source
    });
  }
};
/**
 * Layer for server-rendered images that are available for arbitrary extents and resolutions.
 *
 * @title vl-layer-image
 * @alias module:image-layer/layer
 * @vueProto
 *
 * @vueSlot default Default slot for `vl-source-*` (image-like only) components.
 */

var script = {
  name: 'vl-layer-image',
  mixins: [layer],
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
