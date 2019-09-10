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
import Text from 'ol/style/Text';
import style from '../mixin/style';
import { isEqual, pick } from '../util/minilo';
import withFillStrokeStyle from '../mixin/with-fill-stroke-style';
import mergeDescriptors from '../util/multi-merge-descriptors';

var props = {
  font: {
    type: String,
    default: '10px sans-serif' // css font format https://developer.mozilla.org/en-US/docs/Web/CSS/font?v=control

  },
  placement: String,
  offsetX: {
    type: Number,
    default: 0
  },
  offsetY: {
    type: Number,
    default: 0
  },
  rotateWithView: {
    type: Boolean,
    default: false
  },
  rotation: {
    type: Number,
    default: 0
  },
  scale: {
    type: Number,
    default: 1
  },
  text: String,
  textAlign: String,
  // left, right, center, end, start
  textBaseline: String // bottom, top, middle, alphabetic, hanging, ideographic

};
var methods = {
  /**
   * @returns {Text}
   * @protected
   */
  createStyle: function createStyle() {
    return new Text({
      font: this.font,
      placement: this.placement,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      rotateWithView: this.rotateWithView,
      rotation: this.rotation,
      scale: this.scale,
      text: this.text,
      textAlign: this.textAlign,
      textBaseline: this.textBaseline,
      fill: this._fill,
      stroke: this._stroke
    });
  },

  /**
   * @return {void}
   * @protected
   */
  mount: function mount() {
    this.$stylesContainer && this.$stylesContainer.setText(this);
  },

  /**
   * @return {void}
   * @protected
   */
  unmount: function unmount() {
    this.$stylesContainer && this.$stylesContainer.setText(undefined);
  },

  /**
   * @returns {Object}
   * @protected
   */
  getServices: function getServices() {
    var vm = this;
    return mergeDescriptors(style.methods.getServices.call(this), {
      get stylesContainer() {
        return vm;
      }

    });
  }
};
var watch = {
  font: function font(value) {
    if (this.$style && !isEqual(value, this.$style.getFont())) {
      this.$style.setFont(value);
      this.scheduleRefresh();
    }
  },
  placement: function placement(value) {
    if (this.$style && !isEqual(value, this.$style.getPlacement())) {
      this.$style.setFont(value);
      this.scheduleRefresh();
    }
  },
  offsetX: function offsetX(value) {
    if (this.$style && !isEqual(value, this.$style.getOffsetX())) {
      this.$style.setOffsetX(value);
      this.scheduleRefresh();
    }
  },
  offsetY: function offsetY(value) {
    if (this.$style && !isEqual(value, this.$style.getOffsetY())) {
      this.$style.setOffsetY(value);
      this.scheduleRefresh();
    }
  },
  rotation: function rotation(value) {
    if (this.$style && !isEqual(value, this.$style.getRotation())) {
      this.$style.setRotation(value);
      this.scheduleRefresh();
    }
  },
  rotateWithView: function rotateWithView(value) {
    if (this.$style && !isEqual(value, this.$style.getRotateWithView())) {
      this.$style.setRotation(value);
      this.scheduleRefresh();
    }
  },
  scale: function scale(value) {
    if (this.$style && !isEqual(value, this.$style.getScale())) {
      this.$style.setScale(value);
      this.scheduleRefresh();
    }
  },
  text: function text(value) {
    if (this.$style && !isEqual(value, this.$style.getText())) {
      this.$style.setText(value);
      this.scheduleRefresh();
    }
  },
  textAlign: function textAlign(value) {
    if (this.$style && !isEqual(value, this.$style.getTextAlign())) {
      this.$style.setTextAlign(value);
      this.scheduleRefresh();
    }
  },
  textBaseline: function textBaseline(value) {
    if (this.$style && !isEqual(value, this.$style.getTextBaseline())) {
      this.$style.setTextBaseline(value);
      this.scheduleRefresh();
    }
  }
};
var script = {
  name: 'vl-style-text',
  mixins: [style, withFillStrokeStyle],
  props: props,
  methods: methods,
  watch: watch,
  stubVNode: {
    empty: false,
    attrs: function attrs() {
      return {
        class: this.$options.name
      };
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
