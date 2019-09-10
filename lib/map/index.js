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
import { defaults } from 'ol/control';
import { defaults as defaults$1 } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import Collection from 'ol/Collection';
import Map$1 from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import { merge } from 'rxjs/_esm5/internal/observable/merge';
import { distinctUntilChanged } from 'rxjs/_esm5/internal/operators/distinctUntilChanged';
import { map } from 'rxjs/_esm5/internal/operators/map';
import { throttleTime } from 'rxjs/_esm5/internal/operators/throttleTime';
import Vue from 'vue';
import { olCmp, overlaysContainer, layersContainer, interactionsContainer, featuresContainer, projTransforms } from '../mixin';
import { initializeInteraction, setMapDataProjection, EPSG_3857, MAX_ZOOM, MIN_ZOOM, ZOOM_FACTOR } from '../ol-ext';
import { observableFromOlEvent, observableFromOlChangeEvent } from '../rx-ext';
import { hasMap, hasView } from '../util/assert';
import { isEqual, arrayLengthValidator, coalesce, isFunction, isPlainObject, noop, pick } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';
import { makeWatchers } from '../util/vue-helpers';
import { distinctUntilKeyChanged } from 'rxjs/_esm5/internal/operators/distinctUntilKeyChanged';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/**
 * Container for **layers**, **interactions**, **controls** and **overlays**. It responsible for viewport
 * rendering and low level interaction events.
 */

var script = {
  name: 'vl-map',
  mixins: [olCmp, layersContainer, interactionsContainer, overlaysContainer, featuresContainer, projTransforms],
  props: {
    /**
     * Options for default controls added to the map by default. Set to `false` to disable all map controls. Object
     * value is used to configure controls.
     * @type {Object|boolean}
     * @todo remove when vl-control-* components will be ready
     */
    defaultControls: {
      type: [Object, Boolean],
      default: true
    },

    /**
     * Options for default interactions added to the map by default. Object
     * value is used to configure default interactions.
     * @type {Object|boolean}
     */
    defaultInteractions: {
      type: [Object, Boolean],
      default: function _default() {
        return {};
      }
    },

    /**
     * The element to listen to keyboard events on. For example, if this option is set to `document` the keyboard
     * interactions will always trigger. If this option is not specified, the element the library listens to keyboard
     * events on is the component root element.
     * @type {string|Element|Document}
     */
    keyboardEventTarget: [String, Element, Document],

    /**
     * When set to `true`, tiles will be loaded during animations.
     * @type {boolean}
     */
    loadTilesWhileAnimating: {
      type: Boolean,
      default: false
    },

    /**
     * When set to `true`, tiles will be loaded while interacting with the map.
     * @type {boolean}
     */
    loadTilesWhileInteracting: {
      type: Boolean,
      default: false
    },

    /**
     * The minimum distance in pixels the cursor must move to be detected as a map move event instead of a click.
     * Increasing this value can make it easier to click on the map.
     * @type {Number}
     */
    moveTolerance: {
      type: Number,
      default: 1
    },

    /**
     * The ratio between physical pixels and device-independent pixels (dips) on the device.
     * @type {number}
     */
    pixelRatio: {
      type: Number,
      default: function _default() {
        return window.devicePixelRatio || 1;
      }
    },

    /**
     * Maximum number tiles to load simultaneously.
     * @type {number}
     */
    maxTilesLoading: {
      type: Number,
      default: 16
    },

    /**
     * Root element `tabindex` attribute value. Value should be provided to allow keyboard events on map.
     * @type {number|string}
     */
    tabindex: [String, Number],

    /**
     * Projection for input/output coordinates in plain data.
     * @type {string}
     */
    dataProjection: String,

    /**
     * @type {boolean}
     */
    wrapX: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /**
     * @return {module:ol/PluggableMap~PluggableMap}
     * @protected
     */
    createOlObject: function createOlObject() {
      var map$$1 = new Map$1({
        loadTilesWhileAnimating: this.loadTilesWhileAnimating,
        loadTilesWhileInteracting: this.loadTilesWhileInteracting,
        pixelRatio: this.pixelRatio,
        moveTolerance: this.moveTolerance,
        keyboardEventTarget: this.keyboardEventTarget,
        maxTilesLoading: this.maxTilesLoading,
        controls: this._controlsCollection,
        interactions: this._interactionsCollection,
        layers: this._layersCollection,
        overlays: this._overlaysCollection,
        view: this._view
      });
      setMapDataProjection(map$$1, this.dataProjection);

      this._featuresOverlay.setMap(map$$1);

      return map$$1;
    },

    /**
     * @param {number[]} pixel
     * @return {number[]} Coordinates in the map data projection.
     */
    getCoordinateFromPixel: function getCoordinateFromPixel(pixel) {
      hasMap(this);
      var coordinate = this.$map.getCoordinateFromPixel(pixel);
      return this.pointToDataProj(coordinate);
    },

    /**
     * @param {number[]} coordinate Coordinates in map data projection
     * @return {number[]}
     */
    getPixelFromCoordinate: function getPixelFromCoordinate(coordinate) {
      hasMap(this);
      return this.$map.getPixelFromCoordinate(this.pointToViewProj(coordinate));
    },

    /**
     * Triggers focus on map container.
     * @return {void}
     */
    focus: function focus() {
      this.$el.focus();
    },

    /**
     * @param {number[]} pixel
     * @param {function} callback
     * @param {Object} [opts]
     * @return {*|undefined}
     */
    forEachFeatureAtPixel: function forEachFeatureAtPixel(pixel, callback) {
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      hasMap(this);
      return this.$map.forEachFeatureAtPixel(pixel, callback, opts);
    },

    /**
     * @param {number[]} pixel
     * @param {function} callback
     * @param {Object} [opts]
     * @return {*|undefined}
     */
    forEachLayerAtPixel: function forEachLayerAtPixel(pixel, callback) {
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      hasMap(this);
      return this.$map.forEachLayerAtPixel(pixel, callback, opts);
    },

    /**
     * @param {number[]} pixel
     * @param {Object} [opts]
     */
    getFeaturesAtPixel: function getFeaturesAtPixel(pixel) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      hasMap(this);
      return this.$map.getFeaturesAtPixel(pixel, opts);
    },

    /**
     * Updates map size and re-renders map.
     * @return {Promise}
     */
    refresh: function refresh() {
      var _this = this;

      this.updateSize();
      return this.render().then(function () {
        return olCmp.methods.refresh.call(_this);
      });
    },

    /**
     * @return {Promise}
     */
    render: function render() {
      var _this2 = this;

      return new Promise(function (resolve) {
        hasMap(_this2);

        _this2.$map.once('postrender', function () {
          return resolve();
        });

        _this2.$map.render();
      });
    },

    /**
     * Updates map size.
     * @return {void}
     */
    updateSize: function updateSize() {
      hasMap(this);
      this.$map.updateSize();
    },

    /**
     * @param {module:ol/View~View|Vue|undefined} view
     * @return {void}
     * @protected
     */
    setView: function setView(view) {
      view = view instanceof Vue ? view.$view : view;
      view || (view = new View());

      if (view !== this._view) {
        this._view = view;
      }

      if (this.$map && view !== this.$map.getView()) {
        this.$map.setView(view);
      }
    },

    /**
     * @return {void}
     * @protected
     */
    mount: function mount() {
      hasMap(this);
      this.$map.setTarget(this.$el);
      this.$nextTick(this.updateSize.bind(this));
      this.subscribeAll();
    },

    /**
     * @return {void}
     * @protected
     */
    unmount: function unmount() {
      hasMap(this);
      this.clearFeatures();
      this.clearLayers();
      this.clearInteractions();
      this.clearOverlays();
      this.unsubscribeAll();
      this.$map.setTarget(null);
    },

    /**
     * @return {void}
     * @protected
     */
    subscribeAll: function subscribeAll() {
      subscribeToEvents.call(this);
    },

    /**
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      var vm = this;
      return mergeDescriptors(olCmp.methods.getServices.call(this), layersContainer.methods.getServices.call(this), interactionsContainer.methods.getServices.call(this), overlaysContainer.methods.getServices.call(this), featuresContainer.methods.getServices.call(this), {
        get map() {
          return vm.$map;
        },

        get view() {
          return vm.$view;
        },

        get viewContainer() {
          return vm;
        }

      });
    }
  },
  watch: _objectSpread({}, makeWatchers(['keyboardEventTarget', 'loadTilesWhileAnimating', 'loadTilesWhileInteracting', 'moveTolerance', 'pixelRatio', 'renderer', 'maxTilesLoading'], function () {
    return function () {
      this.scheduleRecreate();
    };
  }), {
    controls: function controls(value) {
      if (value === false) {
        this._controlsCollection.clear();

        return;
      }

      value = _typeof(value) === 'object' ? value : undefined;

      this._controlsCollection.clear();

      this._controlsCollection.extend(defaults(value).getArray());
    },
    wrapX: function wrapX(value) {
      if (this._featuresOverlay == null) return;

      this._featuresOverlay.setSource(new VectorSource({
        features: this._featuresCollection,
        wrapX: value
      }));
    },
    dataProjection: function dataProjection(value) {
      if (!this.$map) return;
      setMapDataProjection(this.$map, value);
      this.scheduleRefresh();
    }
  }),
  created: function created() {
    this._view = new View(); // todo make controls handling like with interactions

    this._controlsCollection = this.defaultControls !== false ? defaults(_typeof(this.defaultControls) === 'object' ? this.defaultControls : undefined) : new Collection(); // todo initialize without interactions and provide vl-interaction-default component

    this._interactionsCollection = this.defaultInteractions !== false ? defaults$1(_typeof(this.defaultInteractions) === 'object' ? this.defaultInteractions : undefined) : new Collection();

    this._interactionsCollection.forEach(function (interaction) {
      return initializeInteraction(interaction);
    }); // prepare default overlay


    this._featuresOverlay = new VectorLayer({
      source: new VectorSource({
        features: this._featuresCollection,
        wrapX: this.wrapX
      })
    });
    defineServices.call(this);
  }
};

function defineServices() {
  var _this3 = this;

  Object.defineProperties(this, {
    /**
     * OpenLayers map instance.
     * @type {module:ol/PluggableMap~PluggableMap|undefined}
     */
    $map: {
      enumerable: true,
      get: function get() {
        return _this3.$olObject;
      }
    },

    /**
     * OpenLayers view instance.
     * @type {module:ol/View~View}
     */
    $view: {
      enumerable: true,
      get: function get() {
        return _this3._view;
      }
    }
  });
}
/**
 * Subscribe to OL map events.
 *
 * @return {void}
 * @private
 */


function subscribeToEvents() {
  var _this4 = this;

  hasMap(this);
  hasView(this);
  var ft = 1000 / 60; // pointer

  var pointerEvents = merge(observableFromOlEvent(this.$map, ['click', 'dblclick', 'singleclick']), observableFromOlEvent(this.$map, ['pointerdrag', 'pointermove']).pipe(throttleTime(ft), distinctUntilChanged(function (a, b) {
    return isEqual(a.coordinate, b.coordinate);
  }))).pipe(map(function (evt) {
    return _objectSpread({}, evt, {
      coordinate: _this4.pointToDataProj(evt.coordinate)
    });
  })); // other

  var otherEvents = observableFromOlEvent(this.$map, ['movestart', 'moveend', 'postrender', 'rendercomplete', 'precompose', 'postcompose', 'rendercomplete']);
  var events = merge(pointerEvents, otherEvents);
  this.subscribeTo(events, function (evt) {
    _this4.$emit(evt.type, evt);
  });
}

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: [_vm.$options.name],
    attrs: {
      "tabindex": _vm.tabindex
    }
  }, [_vm._t("default")], 2);
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

  component.__file = "map.vue";

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


var Map$2 = __vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

/**
 * Represents a simple **2D view** of the map. This is the component to act upon to change the **center**,
 * **resolution**, and **rotation** of the map.
 */

var script$1 = {
  name: 'vl-view',
  mixins: [olCmp, projTransforms],
  props: {
    /**
     * The center coordinate in the view projection.
     * @type {number[]}
     * @default [0, 0]
     */
    center: {
      type: Array,
      default: function _default() {
        return [0, 0];
      },
      validator: arrayLengthValidator(2)
    },
    constrainRotation: {
      type: [Boolean, Number],
      default: true
    },
    enableRotation: {
      type: Boolean,
      default: true
    },

    /**
     * The extent that constrains the center defined in the view projection,
     * in other words, center cannot be set outside this extent.
     * @default undefined
     */
    extent: {
      type: Array,
      validator: arrayLengthValidator(4)
    },
    maxResolution: Number,
    minResolution: Number,

    /**
     * @default 28
     */
    maxZoom: {
      type: Number,
      default: MAX_ZOOM
    },

    /**
     * @default 0
     */
    minZoom: {
      type: Number,
      default: MIN_ZOOM
    },

    /**
     * @type {string}
     * @default EPSG:3857
     */
    projection: {
      type: String,
      default: EPSG_3857
    },
    resolution: Number,
    resolutions: Array,

    /**
     * The initial rotation for the view in **radians** (positive rotation clockwise).
     * @type {number}
     * @vueSync
     */
    rotation: {
      type: Number,
      default: 0
    },

    /**
     * Zoom level used to calculate the resolution for the view as `int` value. Only used if `resolution` is not defined.
     * @type {number}
     * @default 0
     * @vueSync
     */
    zoom: {
      type: Number,
      default: MIN_ZOOM
    },

    /**
     * @default 2
     */
    zoomFactor: {
      type: Number,
      default: ZOOM_FACTOR
    }
  },
  computed: {
    currentZoom: function currentZoom() {
      if (this.rev && this.$view) {
        return this.$view.getZoom();
      }

      return this.zoom;
    },
    currentRotation: function currentRotation() {
      if (this.rev && this.$view) {
        return this.$view.getRotation();
      }

      return this.rotation;
    },
    currentResolution: function currentResolution() {
      if (this.rev && this.$view) {
        return this.$view.getResolution();
      }

      return this.resolution;
    },
    currentCenter: function currentCenter() {
      if (this.rev && this.$view) {
        return this.pointToDataProj(this.$view.getCenter());
      }
    },
    currentCenterViewProj: function currentCenterViewProj() {
      if (this.rev && this.$view) {
        return this.$view.getCenter();
      }
    },

    /**
     * @return {ProjectionLike}
     */
    resolvedDataProjection: function resolvedDataProjection() {
      // exclude this.projection from lookup to allow view rendering in projection
      // that differs from data projection
      return coalesce(this.$viewContainer && this.$viewContainer.resolvedDataProjection, this.$options.dataProjection, this.viewProjection);
    }
  },
  methods: {
    /**
     * @see {@link https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#animate}
     * @param {...(AnimationOptions|function(boolean))} args
     * @return {Promise} Resolves when animation completes
     */
    animate: function animate() {
      var _this = this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      hasView(this);
      var cb = noop;

      if (isFunction(args[args.length - 1])) {
        cb = args[args.length - 1];
        args = args.slice(0, args.length - 1);
      }

      args.forEach(function (opts) {
        if (!Array.isArray(opts.center)) return;
        opts.center = _this.pointToViewProj(opts.center);
      });
      return new Promise(function (resolve) {
        var _this$$view;

        return (_this$$view = _this.$view).animate.apply(_this$$view, _toConsumableArray(args).concat([function (complete) {
          cb(complete);
          resolve(complete);
        }]));
      });
    },

    /**
     * @return {ol/View~View}
     * @protected
     */
    createOlObject: function createOlObject() {
      return new View({
        center: this.pointToViewProj(this.center),
        constrainRotation: this.constrainRotation,
        enableRotation: this.enableRotation,
        extent: this.extent ? this.extentToViewProj(this.extent) : undefined,
        maxResolution: this.maxResolution,
        minResolution: this.minResolution,
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        projection: this.projection,
        resolution: this.resolution,
        resolutions: this.resolutions,
        rotation: this.rotation,
        zoom: this.zoom,
        zoomFactor: this.zoomFactor
      });
    },

    /**
     * @see {@link https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit}
     * @param {Object|module:ol/geom/SimpleGeometry~SimpleGeometry|module:ol/extent~Extent|Vue} geometryOrExtent
     * @param {FitOptions} [options]
     * @return {Promise} Resolves when view changes
     */
    fit: function fit(geometryOrExtent) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      hasView(this); // transform from GeoJSON, vl-feature to ol.Feature

      if (isPlainObject(geometryOrExtent)) {
        geometryOrExtent = this.readGeometryInDataProj(geometryOrExtent);
      } else if (geometryOrExtent instanceof Vue) {
        geometryOrExtent = geometryOrExtent.$geometry;
      }

      var cb = options.callback || noop;
      return new Promise(function (resolve) {
        _this2.$view.fit(geometryOrExtent, _objectSpread({}, options, {
          callback: function callback(complete) {
            cb(complete);
            resolve(complete);
          }
        }));
      });
    },

    /**
     * @return {void}
     * @protected
     */
    mount: function mount() {
      this.$viewContainer && this.$viewContainer.setView(this);
      this.subscribeAll();
    },

    /**
     * @return {void}
     * @protected
     */
    unmount: function unmount() {
      this.unsubscribeAll();
      this.$viewContainer && this.$viewContainer.setView(undefined);
    },

    /**
     * @return {void}
     * @protected
     */
    subscribeAll: function subscribeAll() {
      subscribeToEvents$1.call(this);
    }
  },
  watch: _objectSpread({
    center: function center(value) {
      if (!this.$view || this.$view.getAnimating()) return;
      value = this.pointToViewProj(value);

      if (!isEqual(value, this.currentCenterViewProj)) {
        this.$view.setCenter(value);
      }
    },
    resolution: function resolution(value) {
      if (!this.$view || this.$view.getAnimating()) return;

      if (value !== this.currentResolution) {
        this.$view.setResolution(value);
      }
    },
    zoom: function zoom(value) {
      if (!this.$view || this.$view.getAnimating()) return;

      if (value !== this.currentZoom) {
        this.$view.setZoom(value);
      }
    },
    rotation: function rotation(value) {
      if (!this.$view || this.$view.getAnimating()) return;

      if (value !== this.currentRotation) {
        this.$view.setRotation(value);
      }
    },
    minZoom: function minZoom(value) {
      if (!this.$view) return;

      if (value !== this.$view.getMinZoom()) {
        this.$view.setMinZoom(value);
      }
    },
    maxZoom: function maxZoom(value) {
      if (!this.$view) return;

      if (value !== this.$view.getMaxZoom()) {
        this.$view.setMaxZoom(value);
      }
    }
  }, makeWatchers(['resolvedDataProjection', 'constrainRotation', 'enableRotation', 'extent', 'maxResolution', 'minResolution', 'projection', 'resolutions', 'zoomFactor'], function () {
    return function () {
      this.scheduleRecreate();
    };
  })),
  stubVNode: {
    empty: function empty() {
      return this.$options.name;
    }
  },
  created: function created() {
    defineServices$1.call(this);
  }
};

function defineServices$1() {
  var _this3 = this;

  Object.defineProperties(this, {
    /**
     * @type {ol/View~View|undefined}
     */
    $view: {
      enumerable: true,
      get: function get() {
        return _this3.$olObject;
      }
    },
    $viewContainer: {
      enumerable: true,
      get: function get() {
        return _this3.$services && _this3.$services.viewContainer;
      }
    }
  });
}
/**
 * Subscribe to OpenLayers significant events
 * @return {void}
 * @private
 */


function subscribeToEvents$1() {
  var _this4 = this;

  hasView(this);
  var ft = 1000 / 60;
  var resolution = observableFromOlChangeEvent(this.$view, 'resolution', true, ft);
  var zoom = resolution.pipe(map(function () {
    return {
      prop: 'zoom',
      value: _this4.$view.getZoom()
    };
  }), distinctUntilKeyChanged('value'));
  var changes = merge(observableFromOlChangeEvent(this.$view, 'center', true, ft, function () {
    return _this4.pointToDataProj(_this4.$view.getCenter());
  }), observableFromOlChangeEvent(this.$view, 'rotation', true, ft), resolution, zoom);
  this.subscribeTo(changes, function (_ref) {
    var prop = _ref.prop,
        value = _ref.value;
    ++_this4.rev;

    _this4.$emit("update:".concat(prop), value);
  });
}

/* script */
var __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('i', {
    class: [_vm.$options.name],
    staticStyle: {
      "display": "none !important"
    }
  }, [_vm._t("default", null, {
    center: _vm.currentCenter,
    zoom: _vm.currentZoom,
    resolution: _vm.currentResolution,
    rotation: _vm.currentRotation
  })], 2);
};

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = undefined;
/* functional template */

var __vue_is_functional_template__$1 = false;
/* component normalizer */

function __vue_normalize__$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "view.vue";

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


var View$1 = __vue_normalize__$1({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, undefined, undefined);

function plugin(Vue$$1) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Map$2, options);
  Object.assign(View$1, options);
  Vue$$1.component(Map$2.name, Map$2);
  Vue$$1.component(View$1.name, View$1);
}

export default plugin;
export { Map$2 as Map, View$1 as View, plugin as install };
