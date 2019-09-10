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
import Stroke from 'ol/style/Stroke';
import style from '../mixin/style';
import { isEqual, pick } from '../util/minilo';

var props = {
  color: [Array, String],
  lineCap: {
    type: String,
    default: 'round' // round, butt, square

  },
  lineJoin: {
    type: String,
    default: 'round' // round, bevel, miter

  },
  lineDash: Array,
  lineDashOffset: {
    type: Number,
    default: 0
  },
  miterLimit: {
    type: Number,
    default: 10
  },
  width: {
    type: Number,
    default: 1.25
  }
};
var methods = {
  /**
   * @return {Stroke}
   * @protected
   */
  createStyle: function createStyle() {
    return new Stroke({
      color: this.color,
      lineCap: this.lineCap,
      lineJoin: this.lineJoin,
      lineDash: this.lineDash,
      lineDashOffset: this.lineDashOffset,
      miterLimit: this.miterLimit,
      width: this.width
    });
  },

  /**
   * @return {void}
   * @protected
   */
  mount: function mount() {
    this.$stylesContainer && this.$stylesContainer.setStroke(this);
  },

  /**
   * @return {void}
   * @protected
   */
  unmount: function unmount() {
    this.$stylesContainer && this.$stylesContainer.setStroke(undefined);
  }
};
var watch = {
  color: function color(value) {
    if (this.$style && !isEqual(value, this.$style.getColor())) {
      this.$style.setColor(value);
      this.scheduleRefresh();
    }
  },
  lineCap: function lineCap(value) {
    if (this.$style && !isEqual(value, this.$style.getLineCap())) {
      this.$style.setLineCap(value);
      this.scheduleRefresh();
    }
  },
  lineDash: function lineDash(value) {
    if (this.$style && !isEqual(value, this.$style.getLineDash())) {
      this.$style.setLineDash(value);
      this.scheduleRefresh();
    }
  },
  lineJoin: function lineJoin(value) {
    if (this.$style && !isEqual(value, this.$style.getLineJoin())) {
      this.$style.setLineJoin(value);
      this.scheduleRefresh();
    }
  },
  width: function width(value) {
    if (this.$style && !isEqual(value, this.$style.getWidth())) {
      this.$style.setWidth(value);
      this.scheduleRefresh();
    }
  }
};
var script = {
  name: 'vl-style-stroke',
  mixins: [style],
  props: props,
  watch: watch,
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
