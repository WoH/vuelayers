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
import Feature from 'ol/Feature';
import uuid from 'uuid/v4';
import { Observable } from 'rxjs/_esm5/internal/Observable';
import { merge } from 'rxjs/_esm5/internal/observable/merge';
import { distinctUntilChanged } from 'rxjs/_esm5/internal/operators/distinctUntilChanged';
import { map } from 'rxjs/_esm5/internal/operators/map';
import { mergeAll } from 'rxjs/_esm5/internal/operators/mergeAll';
import { geometryContainer, olCmp, projTransforms, stylesContainer, useMapCmp } from '../mixin';
import { findPointOnSurface, initializeFeature } from '../ol-ext';
import { observableFromOlEvent } from '../rx-ext';
import { hasFeature, hasMap } from '../util/assert';
import { isEqual, plainProps, pick } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';

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

/**
 * A vector object for geographic features with a geometry and other attribute properties,
 * similar to the features in vector file formats like **GeoJSON**.
 */

var script = {
  name: 'vl-feature',
  mixins: [olCmp, useMapCmp, geometryContainer, stylesContainer, projTransforms],
  props: {
    /**
     * Feature identifier.
     * @type {string|number}
     * @default UUID
     */
    id: {
      type: [String, Number],
      default: function _default() {
        return uuid();
      }
    },

    /**
     * All feature properties.
     * @type {Object}
     * @default {}
     */
    properties: {
      type: Object,
      default: function _default() {
        return Object.create(null);
      }
    }
  },
  computed: {
    /**
     * **GeoJSON** encoded geometry.
     * @type {Object|undefined}
     */
    geometry: function geometry() {
      if (this.rev && this.resolvedDataProjection && this.$geometry) {
        return this.writeGeometryInDataProj(this.$geometry);
      }
    },

    /**
     * @return {number[]|undefined}
     */
    point: function point() {
      if (this.pointViewProj && this.resolvedDataProjection) {
        return this.pointToDataProj(this.pointViewProj);
      }
    },
    geometryViewProj: function geometryViewProj() {
      if (this.rev && this.resolvedDataProjection && this.$geometry) {
        return this.writeGeometryInViewProj(this.$geometry);
      }
    },
    pointViewProj: function pointViewProj() {
      if (this.rev && this.$geometry) {
        return findPointOnSurface(this.$geometry);
      }
    }
  },
  methods: {
    /**
     * Create feature without inner style applying, feature level style
     * will be applied in the layer level style function.
     * @return {module:ol/Feature~Feature}
     * @protected
     */
    createOlObject: function createOlObject() {
      var feature = new Feature(this.properties);
      initializeFeature(feature, this.id);
      feature.setGeometry(this.$geometry);
      return feature;
    },

    /**
     * @return {{
     *     getGeometry: function(): (module:ol/geom/Geometry~Geometry|undefined),
     *     setGeometry: function((module:ol/geom/Geometry~Geometry|undefined)): void
     *   }|Feature|undefined}
     * @protected
     */
    getGeometryTarget: function getGeometryTarget() {
      return this.$feature;
    },

    /**
     * @return {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return mergeDescriptors(olCmp.methods.getServices.call(this), geometryContainer.methods.getServices.call(this), stylesContainer.methods.getServices.call(this), {
        get feature() {
          return vm.$feature;
        }

      });
    },

    /**
     * @return {module:ol/Feature~Feature|undefined}
     * @protected
     */
    getStyleTarget: function getStyleTarget() {
      return this.$feature;
    },

    /**
     * Checks if feature lies at `pixel`.
     * @param {number[]} pixel
     * @return {boolean}
     */
    isAtPixel: function isAtPixel(pixel) {
      var _this = this;

      hasMap(this);
      return this.$map.forEachFeatureAtPixel(pixel, function (f) {
        return f === _this.$feature;
      }, {
        layerFilter: function layerFilter(l) {
          return l === _this.$layer;
        }
      });
    },

    /**
     * @return {void}
     * @protected
     */
    mount: function mount() {
      this.$featuresContainer && this.$featuresContainer.addFeature(this);
      this.subscribeAll();
    },

    /**
     * @return {void}
     * @protected
     */
    unmount: function unmount() {
      this.unsubscribeAll();
      this.$featuresContainer && this.$featuresContainer.removeFeature(this);
    },

    /**
     * @return {void}
     * @protected
     */
    subscribeAll: function subscribeAll() {
      subscribeToEvents.call(this);
    }
  },
  watch: {
    /**
     * @param {string|number} value
     */
    id: function id(value) {
      if (this.$feature && value !== this.$feature.getId()) {
        this.$feature.setId(value);
      }
    },

    /**
     * @param {Object} value
     */
    properties: function properties(value) {
      value = plainProps(value);

      if (this.$feature && !isEqual(value, plainProps(this.$feature.getProperties()))) {
        this.$feature.setProperties(value);
      }
    }
  },
  created: function created() {
    defineServices.call(this);
  }
};

function defineServices() {
  var _this2 = this;

  Object.defineProperties(this, {
    $feature: {
      enumerable: true,
      get: function get() {
        return _this2.$olObject;
      }
    },
    $layer: {
      enumerable: true,
      get: function get() {
        return _this2.$services && _this2.$services.layer;
      }
    },
    $map: {
      enumerable: true,
      get: function get() {
        return _this2.$services && _this2.$services.map;
      }
    },
    $view: {
      enumerable: true,
      get: function get() {
        return _this2.$services && _this2.$services.view;
      }
    },
    $featuresContainer: {
      enumerable: true,
      get: function get() {
        return _this2.$services && _this2.$services.featuresContainer;
      }
    }
  });
}
/**
 * @return {void}
 * @private
 */


function subscribeToEvents() {
  var _this3 = this;

  hasFeature(this);

  var getPropValue = function getPropValue(prop) {
    return _this3.$feature.get(prop);
  }; // all plain properties + geometry


  var propChanges = observableFromOlEvent(this.$feature, 'propertychange', function (_ref) {
    var key = _ref.key;
    return {
      prop: key,
      value: getPropValue(key)
    };
  }); // id, style and other generic changes

  var changes = observableFromOlEvent(this.$feature, 'change').pipe(map(function () {
    return Observable.create(function (obs) {
      if (_this3.$feature.getId() !== _this3.id) {
        obs.next({
          prop: 'id',
          value: _this3.$feature.getId()
        });
      } // todo style?

    });
  }), mergeAll()); // all changes

  var allChanges = merge(propChanges, changes).pipe(distinctUntilChanged(isEqual));
  this.subscribeTo(allChanges, function (_ref2) {
    var prop = _ref2.prop,
        value = _ref2.value;
    ++_this3.rev;

    if (prop === 'id') {
      _this3.$emit("update:".concat(prop), value);
    } else if (prop !== _this3.$feature.getGeometryName()) {
      _this3.$emit('update:properties', _objectSpread({}, _this3.properties, _defineProperty({}, prop, value)));
    }
  });
}

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('i', {
    class: [_vm.$options.name],
    staticStyle: {
      "display": "none !important"
    },
    attrs: {
      "id": [_vm.$options.name, _vm.id].join('-')
    }
  }, [_vm._t("default", null, {
    id: _vm.id,
    properties: _vm.properties,
    geometry: _vm.geometry,
    point: _vm.point
  })], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* component normalizer */

function __vue_normalize__(template, style, script$$1, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "feature.vue";

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


var Feature$1 = __vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Feature$1, options);
  Vue.component(Feature$1.name, Feature$1);
}

export default plugin;
export { Feature$1 as Feature, plugin as install };
