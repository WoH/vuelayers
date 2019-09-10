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
import ImageStaticSource from 'ol/source/ImageStatic';
import imageSource from '../mixin/image-source';
import withUrl from '../mixin/with-url';
import { makeWatchers } from '../util/vue-helpers';
import { pick } from '../util/minilo';

/**
 * @vueProps
 */

var props =
/** @lends module:image-static-source/source# */
{
  /**
   * Image extent in the source projection.
   * @type {number[]}
   */
  extent: {
    type: Array,
    required: true,
    validator: function validator(value) {
      return value.length === 4;
    }
  },

  /**
   * Optional function to load an image given a URL.
   * @type {function|undefined}
   */
  loadFunc: Function,

  /**
   * Image size in pixels.
   * @type {number[]}
   */
  size: {
    type: Array,
    validator: function validator(value) {
      return value.length === 2;
    }
  },

  /**
   * Image URL.
   * @type {string}
   */
  url: {
    type: String,
    required: true,
    validator: function validator(value) {
      return !!value.length;
    }
  }
  /**
   * @vueMethods
   */

};
var methods =
/** @lends module:image-static-source/source# */
{
  /**
   * @return {ImageStatic}
   * @protected
   */
  createSource: function createSource() {
    return new ImageStaticSource({
      attributions: this.attributions,
      crossOrigin: this.crossOrigin,
      imageExtent: this.extent,
      imageLoadFunction: this.loadFunc,
      logo: this.logo,
      projection: this.projection,
      imageSize: this.size,
      url: this.urlTmpl
    });
  }
};
var watch = makeWatchers(Object.keys(props), function () {
  return function () {
    this.scheduleRecreate();
  };
});
/**
 * A layer source for displaying a single, static image.
 *
 * @vueProto
 * @title vl-source-image-static
 * @alias module:image-static-source/source
 */

var script = {
  name: 'vl-source-image-static',
  mixins: [imageSource, withUrl],
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

  component.__file = "source.vue";

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


var Source = __vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Source, options);
  Vue.component(Source.name, Source);
}

export default plugin;
export { Source, plugin as install };
