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
import Style from 'ol/style/Style';
import style from '../mixin/style';
import withFillStrokeStyle from '../mixin/with-fill-stroke-style';
import mergeDescriptors from '../util/multi-merge-descriptors';
import { isEqual, pick } from '../util/minilo';

/**
 * Style box component.
 * Wrapper for Style class. Can be inserted into component with setStyle/getStyle methods (vl-layer-vector, vl-feature & etc.)
 * and acts as a box for inner style components (vl-style-fill, vl-style-stroke, icon ...)
 */

var props = {
  zIndex: {
    type: Number,
    default: 0
  },
  condition: {
    type: [Function, Boolean],
    default: true
  }
};
var methods = {
  /**
   * @return {Style}
   * @protected
   */
  createStyle: function createStyle() {
    return new Style({
      zIndex: this.zIndex,
      image: this._image,
      stroke: this._stroke,
      fill: this._fill,
      text: this._text,
      geometry: this._geometry
    });
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
  },

  /**
   * @return {void}
   * @protected
   */
  mount: function mount() {
    this.$stylesContainer && this.$stylesContainer.addStyle(this);
  },

  /**
   * @return {void}
   * @protected
   */
  unmount: function unmount() {
    this.$stylesContainer && this.$stylesContainer.removeStyle(this);
  },

  /**
   * @param {Image|Vue|undefined} image
   * @return {void}
   */
  setImage: function setImage(image) {
    image = image instanceof Vue ? image.$style : image;

    if (image !== this._image) {
      this._image = image;
    }

    if (this.$style && image !== this.$style.getImage()) {
      this.$style.setImage(image);
      this.scheduleRefresh();
    }
  },

  /**
   * @param {Geometry|Vue|undefined} geom
   * @return {void}
   */
  setGeometry: function setGeometry(geom) {
    geom = geom instanceof Vue ? geom.$geometry : geom;

    if (geom !== this._geometry) {
      this._geometry = geom;
    }

    if (this.$style && geom !== this.$style.getGeometry()) {
      this.$style.setGeometry(geom);
      this.scheduleRefresh();
    }
  },

  /**
   * @param {Text|undefined} text
   * @return {void}
   */
  setText: function setText(text) {
    text = text instanceof Vue ? text.$style : text;

    if (text !== this._text) {
      this._text = text;
    }

    if (this.$style && text !== this.$style.getText()) {
      this.$style.setText(text);
      this.scheduleRefresh();
    }
  }
};
var watch = {
  zIndex: function zIndex(value) {
    if (this.$style && !isEqual(value, this.$style.getZIndex())) {
      this.$style.setZIndex(value);
      this.scheduleRefresh();
    }
  }
};
var script = {
  name: 'vl-style-box',
  mixins: [style, withFillStrokeStyle],
  props: props,
  methods: methods,
  watch: watch,
  created: function created() {
    /**
     * @type {Image|undefined}
     * @private
     */
    this._image = undefined;
    /**
     * @type {Text|undefined}
     * @private
     */

    this._text = undefined;
    /**
     * @type {Geometry|undefined}
     * @private
     */

    this._geometry = undefined;
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


var Style$1 = __vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue$$1) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Style$1, options);
  Vue$$1.component(Style$1.name, Style$1);
}

export default plugin;
export { Style$1 as Style, plugin as install };
