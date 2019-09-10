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
import Fill from 'ol/style/Fill';
import style from '../mixin/style';
import { isEqual, pick } from '../util/minilo';

var props = {
  color: [String, Array]
};
var methods = {
  /**
   * @return {Fill}
   * @protected
   */
  createStyle: function createStyle() {
    return new Fill({
      color: this.color
    });
  },

  /**
   * @return {void}
   * @protected
   */
  mount: function mount() {
    this.$stylesContainer && this.$stylesContainer.setFill(this);
  },

  /**
   * @return {void}
   * @protected
   */
  unmount: function unmount() {
    this.$stylesContainer && this.$stylesContainer.setFill(undefined);
  }
};
var watch = {
  color: function color(value) {
    if (this.$style && !isEqual(value, this.$style.getColor())) {
      this.$style.setColor(value);
      this.scheduleRefresh();
    }
  }
};
var script = {
  name: 'vl-style-fill',
  mixins: [style],
  props: props,
  methods: methods,
  watch: watch
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

function __vue_normalize__(template, style$$1, script$$1, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "style.vue";

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


var Style = __vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Style, options);
  Vue.component(Style.name, Style);
}

export default plugin;
export { Style, plugin as install };
