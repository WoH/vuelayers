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
import Circle from 'ol/geom/Circle';
import { geometry } from '../mixin';
import { GEOMETRY_TYPE } from '../ol-ext';
import { hasGeometry } from '../util/assert';
import { constant, pick } from '../util/minilo';

/**
 * @alias module:circle-geom/geom
 * @title vl-geom-circle
 * @vueProto
 */

var script = {
  name: 'vl-geom-circle',
  mixins: [geometry],
  props: {
    coordinates: {
      type: Array,
      required: true,
      validator: function validator(value) {
        return value.length === 2;
      }
    },
    radius: {
      type: Number,
      default: 0
    }
  },
  computed: {
    type: constant(GEOMETRY_TYPE.POINT),

    /**
     * @type {Array|undefined}
     */
    coordinatesViewProj: function coordinatesViewProj() {
      if (this.rev && this.$geometry) {
        return this.$geometry.getCenter();
      }
    }
  },
  methods: {
    /**
     * @return {Circle}
     * @protected
     */
    createGeometry: function createGeometry() {
      return new Circle(this.toViewProj(this.coordinates), this.radius);
    },

    /**
     * @return {Coordinate}
     */
    getCoordinates: function getCoordinates() {
      hasGeometry(this);
      return this.toDataProj(this.$geometry.getCenter());
    },

    /**
     * @param {Coordinate} coordinate
     */
    setCoordinates: function setCoordinates(coordinate) {
      hasGeometry(this);
      this.$geometry.setCenter(this.toViewProj(coordinate));
    }
  },
  watch: {
    radius: function radius(value) {
      if (!this.$geometry) return;

      if (value !== this.$geometry.getRadius()) {
        this.$geometry.setRadius(value);
      }
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

function __vue_normalize__(template, style, script$$1, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "geom.vue";

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


var Geom = __vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Geom, options);
  Vue.component(Geom.name, Geom);
}

export default plugin;
export { Geom, plugin as install };
