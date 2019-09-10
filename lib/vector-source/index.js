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
import VectorSource from 'ol/source/Vector';
import { fetch } from 'whatwg-fetch';
import { vectorSource } from '../mixin';
import { createGeoJsonFmt, getFeatureId, initializeFeature, loadingAll, transform } from '../ol-ext';
import { constant, difference, isEmpty, isFinite, isFunction, stubArray, pick } from '../util/minilo';
import { makeWatchers } from '../util/vue-helpers';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

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

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var script = {
  name: 'vl-source-vector',
  mixins: [vectorSource],
  props: {
    /**
     * Array of GeoJSON features with coordinates in the map view projection.
     * @type {Object[]} features
     */
    features: {
      type: Array,
      default: stubArray
    },

    /**
     * Source loader factory.
     * Source loader should load features from some remote service, decode them and pas to `features` prop to render.
     * @type {(function(): FeatureLoader|undefined)} loaderFactory
     */
    loaderFactory: {
      type: Function,
      default: defaultLoaderFactory
    },

    /**
     * Source format factory
     * @type {(function(): Feature|undefined)} formatFactory
     */
    formatFactory: {
      type: Function,
      default: defaultFormatFactory
    },

    /**
     * String or url factory
     * @type {(string|function(): string|FeatureUrlFunction|undefined)} url
     */
    url: [String, Function],

    /**
     * Loading strategy factory.
     * Extent here in map view projection.
     * @type {(function(): LoadingStrategy|undefined)} strategyFactory
     */
    strategyFactory: {
      type: Function,
      default: defaultStrategyFactory
    },
    overlaps: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    urlFunc: function urlFunc() {
      var _this = this;

      if (!this.url) {
        return;
      }

      var url = this.url;

      if (!isFunction(url)) {
        url = constant(this.url);
      } // wrap strategy function to transform map view projection to source projection


      return function (extent, resolution, projection) {
        return url(transformExtent(extent, projection, _this.resolvedDataProjection), resolution, _this.resolvedDataProjection);
      };
    },
    loaderFunc: function loaderFunc() {
      var _this2 = this;

      var loader = this.loaderFactory(this); // wrap strategy function to transform map view projection to source projection

      return (
        /*#__PURE__*/
        function () {
          var _ref = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(extent, resolution, projection) {
            var features;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return loader(transformExtent(extent, projection, _this2.resolvedDataProjection), resolution, _this2.resolvedDataProjection);

                  case 2:
                    features = _context.sent;

                    if (Array.isArray(features)) {
                      _this2.addFeatures(features);
                    }

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          return function (_x, _x2, _x3) {
            return _ref.apply(this, arguments);
          };
        }()
      );
    },
    loadingStrategy: function loadingStrategy() {
      return this.strategyFactory();
    },
    dataFormat: function dataFormat() {
      return this.formatFactory();
    }
  },
  methods: {
    /**
     * @return {VectorSource}
     * @protected
     */
    createSource: function createSource() {
      return new VectorSource({
        attributions: this.attributions,
        features: this._featuresCollection,
        projection: this.resolvedDataProjection,
        loader: this.loaderFunc,
        useSpatialIndex: this.useSpatialIndex,
        wrapX: this.wrapX,
        logo: this.logo,
        strategy: this.loadingStrategy,
        format: this.dataFormat,
        url: this.urlFunc,
        overlaps: this.overlaps
      });
    },

    /**
     * @return {void}
     * @protected
     */
    mount: function mount() {
      vectorSource.methods.mount.call(this);
      this.addFeatures(this.features);
    },

    /**
     * @return {void}
     * @protected
     */
    unmount: function unmount() {
      this.clear();
      vectorSource.methods.unmount.call(this);
    }
  },
  watch: _objectSpread({
    features: {
      deep: true,
      handler: function handler(features) {
        if (!this.$source) return;
        features = features.slice().map(function (feature) {
          return initializeFeature(_objectSpread({}, feature));
        });
        this.addFeatures(features);
        var forRemove = difference(this.getFeatures(), features, function (a, b) {
          return getFeatureId(a) === getFeatureId(b);
        });
        this.removeFeatures(forRemove);
      }
    }
  }, makeWatchers(['loadingStrategy', 'dataFormat', 'urlFunc', 'loaderFactory', 'formatFactory', 'strategyFactory', 'overlaps'], function () {
    return function () {
      this.scheduleRecreate();
    };
  }))
  /**
   * @return {LoadingStrategy}
   */

};

function defaultStrategyFactory() {
  return loadingAll;
}
/**
 * @return {GeoJSON}
 */


function defaultFormatFactory() {
  return createGeoJsonFmt();
}
/**
 * Default loader for provided URL.
 *
 * @param vm
 * @return {Function}
 */


function defaultLoaderFactory(vm) {
  return function (extent, resolution, projection) {
    var url = vm.$source.getUrl();

    if (isFunction(url)) {
      url = url(extent, resolution, projection);
    }

    if (isEmpty(url)) {
      return [];
    }

    return fetch(url, {
      credentials: 'same-origin',
      mode: 'cors'
    }).then(function (response) {
      return response.text();
    }).then(function (text) {
      if (!vm.$source) {
        return [];
      }

      return vm.$source.getFormat().readFeatures(text, {
        featureProjection: vm.viewProjection,
        dataProjection: vm.resolvedDataProjection
      });
    });
  };
}

function transformExtent(extent, sourceProj, destProj) {
  extent = extent.slice();

  if (isFinite(extent[0]) && isFinite(extent[1])) {
    var _transform = transform([extent[0], extent[1]], sourceProj, destProj);

    var _transform2 = _slicedToArray(_transform, 2);

    extent[0] = _transform2[0];
    extent[1] = _transform2[1];
  }

  if (isFinite(extent[2]) && isFinite(extent[3])) {
    var _transform3 = transform([extent[2], extent[3]], sourceProj, destProj);

    var _transform4 = _slicedToArray(_transform3, 2);

    extent[2] = _transform4[0];
    extent[3] = _transform4[1];
  }

  return extent;
}

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
