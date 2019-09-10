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
import HeatmapLayer from 'ol/layer/Heatmap';
import { isEqual, pick } from '../util/minilo';
import { makeWatchers } from '../util/vue-helpers';
import { vectorLayer } from '../mixin';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var script = {
  name: 'vl-layer-heatmap',
  mixins: [vectorLayer],
  props: {
    gradient: {
      type: Array,
      default: function _default() {
        return ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#f00'];
      }
    },
    radius: {
      type: Number,
      default: 8
    },
    blur: {
      type: Number,
      default: 15
    },
    shadow: {
      type: Number,
      default: 250
    },
    weight: {
      type: String,
      default: 'weight'
    }
  },
  methods: {
    createLayer: function createLayer() {
      return new HeatmapLayer({
        id: this.id,
        minResolution: this.minResolution,
        maxResolution: this.maxResolution,
        opacity: this.opacity,
        visible: this.visible,
        extent: this.extent,
        zIndex: this.zIndex,
        renderMode: this.renderMode,
        gradient: this.gradient,
        radius: this.radius,
        blur: this.blur,
        shadow: this.shadow,
        weight: this.weight
      });
    }
  },
  watch: _objectSpread({
    blur: function blur(value) {
      if (!this.$layer || this.$layer.getBlur() === value) return;
      this.$layer.setBlur(value);
    },
    gradient: function gradient(value) {
      if (!this.$layer || isEqual(this.$layer.getGradient(), value)) return;
      this.$layer.setGradient(value);
    },
    radius: function radius(value) {
      if (!this.$layer || this.$layer.getRadius() === value) return;
      this.$layer.setRadius(value);
    }
  }, makeWatchers(['shadow', 'weight'], function () {
    return function () {
      this.scheduleRecreate();
    };
  }))
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
