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
import Vue from 'vue';
import RegularShape from 'ol/style/RegularShape';
import imageStyle from '../mixin/image-style';
import withFillStrokeStyle from '../mixin/with-fill-stroke-style';
import { isEqual, pick } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';

var props = {
  points: {
    type: Number,
    required: true
  },
  radius: Number,
  radius1: Number,
  radius2: Number,
  angle: {
    type: Number,
    default: 0
  },
  rotation: {
    type: Number,
    default: 0
  },
  rotateWithView: {
    type: Boolean,
    default: false
  }
};
var methods = {
  /**
   * @return {RegularShape}
   * @protected
   */
  createStyle: function createStyle() {
    return RegularShape({
      points: this.points,
      radius: this.radius,
      radius1: this.radius1,
      radius2: this.radius2,
      angle: this.angle,
      rotation: this.rotation,
      rotateWithView: this.rotateWithView,
      fill: this._fill,
      stroke: this._stroke
    });
  },

  /**
   * @returns {Object}
   * @protected
   */
  getServices: function getServices() {
    var vm = this;
    return mergeDescriptors(imageStyle.methods.getServices.call(this), {
      get stylesContainer() {
        return vm;
      }

    });
  },

  /**
   * @param {Fill|Vue|undefined} fill
   * @return {void}
   */
  setFill: function setFill(fill) {
    fill = fill instanceof Vue ? fill.$style : fill;

    if (fill !== this._fill) {
      this._fill = fill;
      this.scheduleRefresh();
    }
  },

  /**
   * @param {Stroke|Vue|undefined} stroke
   * @return {void}
   */
  setStroke: function setStroke(stroke) {
    stroke = stroke instanceof Vue ? stroke.$style : stroke;

    if (stroke !== this._stroke) {
      this._stroke = stroke;
      this.scheduleRefresh();
    }
  }
};
var watch = {
  points: function points(value) {
    if (this.$style && !isEqual(value, this.$style.getPoints())) {
      this.scheduleRefresh();
    }
  },
  radius: function radius(value) {
    if (this.$style && !isEqual(value, this.$style.getRadius())) {
      this.scheduleRefresh();
    }
  },
  radius1: function radius1(value) {
    if (this.$style && !isEqual(value, this.$style.getRadius())) {
      this.scheduleRefresh();
    }
  },
  radius2: function radius2(value) {
    if (this.$style && !isEqual(value, this.$style.getRadius2())) {
      this.scheduleRefresh();
    }
  },
  angle: function angle(value) {
    if (this.$style && !isEqual(value, this.$style.getAngle())) {
      this.scheduleRefresh();
    }
  },
  rotation: function rotation(value) {
    if (this.$style && !isEqual(value, this.$style.getRotation())) {
      this.scheduleRefresh();
    }
  },
  rotateWithView: function rotateWithView(value) {
    if (this.$style && !isEqual(value, this.$style.getRotateWithView())) {
      this.scheduleRefresh();
    }
  }
};
var script = {
  name: 'vl-style-reg-shape',
  mixins: [imageStyle, withFillStrokeStyle],
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

function __vue_normalize__(template, style, script$$1, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
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

function plugin(Vue$$1) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Style, options);
  Vue$$1.component(Style.name, Style);
}

export default plugin;
export { Style, plugin as install };