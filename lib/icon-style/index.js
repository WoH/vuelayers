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
import Icon from 'ol/style/Icon';
import imageStyle from '../mixin/image-style';
import { isEqual, isEmpty, arrayLengthValidator, pick } from '../util/minilo';
import { assert } from '../util/assert';
import { makeWatchers } from '../util/vue-helpers';

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
  name: 'vl-style-icon',
  mixins: [imageStyle],
  props: {
    src: String,
    size: {
      type: Array,
      validator: arrayLengthValidator(2)
    },
    img: Image,
    imgSize: {
      type: Array,
      validator: arrayLengthValidator(2)
    },
    anchor: {
      type: Array,
      default: function _default() {
        return [0.5, 0.5];
      },
      validator: arrayLengthValidator(2)
    },
    anchorOrigin: {
      type: String,
      default: 'top-left' // bottom-left, bottom-right, top-left or top-right

    },
    anchorXUnits: {
      type: String,
      default: 'fraction' // pixels, fraction

    },
    anchorYUnits: {
      type: String,
      default: 'fraction' // pixels, fraction

    },
    color: [Array, String],
    crossOrigin: String,
    offset: {
      type: Array,
      default: function _default() {
        return [0, 0];
      },
      validator: arrayLengthValidator(2)
    },
    offsetOrigin: {
      type: String,
      default: 'top-left' // bottom-left, bottom-right, top-left or top-right

    },
    opacity: {
      type: Number,
      default: 1
    },
    scale: {
      type: Number,
      default: 1
    },
    rotateWithView: {
      type: Boolean,
      default: false
    },
    rotation: {
      type: Number,
      default: 0
    }
  },
  methods: {
    /**
     * @return {Icon}
     * @protected
     */
    createStyle: function createStyle() {
      assert(this.src && !this.img || !this.src && this.img, "vl-style-icon one of 'image' or 'src' prop must be provided.");
      assert(!this.img || this.img && !isEmpty(this.imgSize), "vl-style-icon 'imgSize' must be set when image is provided.");
      return new Icon({
        anchor: this.anchor,
        anchorOrigin: this.anchorOrigin,
        anchorXUnits: this.anchorXUnits,
        anchorYUnits: this.anchorYUnits,
        color: this.color,
        crossOrigin: this.crossOrigin,
        offset: this.offset,
        offsetOrigin: this.offsetOrigin,
        opacity: this.opacity,
        scale: this.scale,
        rotateWithView: this.rotateWithView,
        rotation: this.rotation,
        size: this.size,
        src: this.src,
        img: this.img,
        imgSize: this.imgSize
      });
    }
  },
  watch: _objectSpread({
    src: function src(value) {
      if (this.$style && !isEqual(value, this.$style.getSrc())) {
        this.scheduleRefresh();
      }
    },
    size: function size(value) {
      if (this.$style && !isEqual(value, this.$style.getSize())) {
        this.scheduleRefresh();
      }
    },
    anchor: function anchor(value) {
      if (this.$style && !isEqual(value, this.$style.getAnchor())) {
        this.scheduleRefresh();
      }
    },
    color: function color(value) {
      if (this.$style && !isEqual(value, this.$style.getColor())) {
        this.scheduleRefresh();
      }
    },
    opacity: function opacity(value) {
      if (this.$style && !isEqual(value, this.$style.getOpacity())) {
        this.scheduleRefresh();
      }
    },
    scale: function scale(value) {
      if (this.$style && !isEqual(value, this.$style.getScale())) {
        this.scheduleRefresh();
      }
    },
    rotateWithView: function rotateWithView(value) {
      if (this.$style && !isEqual(value, this.$style.getRotateWithView())) {
        this.scheduleRefresh();
      }
    },
    rotation: function rotation(value) {
      if (this.$style && !isEqual(value, this.$style.getRotation())) {
        this.scheduleRefresh();
      }
    }
  }, makeWatchers(['anchorOrigin', 'anchorXUnits', 'anchorYUnits', 'crossOrigin', 'offset', 'offsetOrigin', 'img', 'imgSize'], function () {
    return function () {
      this.scheduleRefresh();
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
