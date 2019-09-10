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
import style from '../mixin/style';
import stylesContainer from '../mixin/styles-container';
import { hasMap } from '../util/assert';
import { warn } from '../util/log';
import { isFunction, noop, pick } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';

/**
 * Style function component for advanced styling.
 * Plays the role of both a style that mounts itself to style target component (vl-layer-vector, vl-feature & etc.)
 * and style target for inner style containers (vl-style-box) as fallback style.
 */

var props = {
  /**
   * @type {function(): function(feature: Feature): Style}
   */
  factory: {
    type: Function,
    required: true
  }
};
var computed = {
  styleFunc: function styleFunc() {
    var func = this.factory();

    if (!isFunction(func)) {
      if (process.env.NODE_ENV !== 'production') {
        warn("Factory returned a value not of Function type, fallback style will be used");
      }

      func = noop;
    }

    return func;
  }
};
var methods = {
  /**
   * @return {function(feature: Feature): Style}
   * @protected
   */
  createStyle: function createStyle() {
    hasMap(this); // user provided style function

    var providedStyleFunc = this.styleFunc; // fallback style function made from inner style containers

    var fallbackStyleFunc = this.createStyleFunc();
    return function __styleFunc(feature, resolution) {
      var styles = providedStyleFunc(feature, resolution); // not empty or null style

      if (styles === null || Array.isArray(styles) && styles.length) {
        return styles;
      }

      return fallbackStyleFunc(feature, resolution);
    };
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
   * Overrides stylesContainer `setStyle` method
   * @param {Array<{ style: Style, condition: (function|boolean|undefined) }>|function(feature: Feature): Style|Vue|undefined} styles
   * @return {void}
   */
  setStyle: function setStyle(styles) {
    if (styles !== this._styles) {
      // simply save all inner styles and
      // use them later in style function as fallback
      this._styles = styles;
      this.scheduleRefresh();
    }
  },

  /**
   * @return {Promise}
   */
  refresh: function refresh() {
    // recreate style
    return this.recreate();
  }
};
var watch = {
  factory: function factory() {
    this.scheduleRefresh();
  }
};
var script = {
  name: 'vl-style-func',
  mixins: [style, stylesContainer],
  props: props,
  computed: computed,
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
