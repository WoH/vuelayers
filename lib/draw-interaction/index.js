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
import { noModifierKeys, shiftKeyOnly } from 'ol/events/condition';
import DrawInteraction from 'ol/interaction/Draw';
import { merge } from 'rxjs/_esm5/internal/observable/merge';
import { map } from 'rxjs/_esm5/internal/operators/map';
import interaction from '../mixin/interaction';
import stylesContainer from '../mixin/styles-container';
import { GEOMETRY_TYPE } from '../ol-ext/consts';
import { initializeFeature } from '../ol-ext/feature';
import { createStyle, defaultEditStyle } from '../ol-ext/style';
import { isCollection, isVectorSource } from '../ol-ext/util';
import observableFromOlEvent from '../rx-ext/from-ol-event';
import { assert, hasInteraction } from '../util/assert';
import { camelCase, mapValues, upperFirst, pick } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';
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

var transformType = function transformType(type) {
  return upperFirst(camelCase(type));
};
/**
 * @alias module:draw-interaction/interaction
 * @title vl-interaction-draw
 * @vueProto
 */


var script = {
  name: 'vl-interaction-draw',
  mixins: [interaction, stylesContainer],
  stubVNode: {
    empty: false,
    attrs: function attrs() {
      return {
        class: this.$options.name
      };
    }
  },
  props: {
    /**
     * Target source or collection identifier from IdentityMap.
     * @type {String}
     */
    source: {
      type: String,
      required: true
    },

    /**
     * The maximum distance in pixels between "down" and "up" for a "up" event to be considered a "click" event and
     * actually add a point/vertex to the geometry being drawn. Default is 6 pixels. That value was chosen for the
     * draw interaction to behave correctly on mouse as well as on touch devices.
     * @type {number}
     */
    clickTolerance: {
      type: Number,
      default: 6
    },

    /**
     * Pixel distance for snapping to the drawing finish.
     * @type {number}
     */
    snapTolerance: {
      type: Number,
      default: 12
    },

    /**
     * Drawing type ('Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon' or 'Circle').
     * @type {string}
     */
    type: {
      type: String,
      required: true,
      validator: function validator(value) {
        return Object.values(GEOMETRY_TYPE).includes(transformType(value));
      }
    },

    /**
     * Stop click, singleclick, and doubleclick events from firing during drawing.
     * @type {boolean}
     */
    stopClick: {
      type: Boolean,
      default: false
    },

    /**
     * The number of points that can be drawn before a polygon ring or line string is finished.
     * @type {number|undefined}
     */
    maxPoints: Number,

    /**
     * The number of points that must be drawn before a polygon ring or line string can be finished.
     * Default is `3` for polygon rings and `2` for line strings.
     * @type {number|undefined}
     */
    minPoints: Number,

    /**
     * A function that takes an ol.MapBrowserEvent and returns a boolean to indicate whether the drawing can be finished.
     * @type {function|undefined}
     */
    finishCondition: Function,

    /**
     * Function that is called when a geometry's coordinates are updated.
     * @type {function|undefined}
     */
    geometryFunction: Function,

    /**
     * Name of the geometry attribute for newly created features.
     * @type {string}
     */
    geometryName: {
      type: String,
      default: 'geometry'
    },

    /**
     * A function that takes an `ol.MapBrowserEvent` and returns a boolean to indicate whether that event should be handled.
     * By default `ol.events.condition.noModifierKeys`, i.e. a click, adds a vertex or deactivates freehand drawing.
     * @type {function|undefined}
     */
    condition: {
      type: Function,
      default: noModifierKeys
    },

    /**
     * Operate in freehand mode for lines, polygons, and circles. This makes the interaction always operate in
     * freehand mode and takes precedence over any `freehandCondition` option.
     * @type {boolean}
     */
    freehand: {
      type: Boolean,
      default: false
    },

    /**
     * Condition that activates freehand drawing for lines and polygons. This function takes an `ol.MapBrowserEvent` and
     * returns a boolean to indicate whether that event should be handled. The default is `ol.events.condition.shiftKeyOnly`,
     * meaning that the Shift key activates freehand drawing.
     * @type {function|undefined}
     */
    freehandCondition: {
      type: Function,
      default: shiftKeyOnly
    },

    /**
     * Wrap the world horizontally on the sketch overlay.
     * @type {boolean}
     */
    wrapX: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * @return {Promise<Draw>}
     * @protected
     */
    createInteraction: function () {
      var _createInteraction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var sourceIdent, source;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                sourceIdent = this.makeIdent(this.source);
                _context.next = 3;
                return this.$identityMap.get(sourceIdent, this.$options.INSTANCE_PROMISE_POOL);

              case 3:
                source = _context.sent;
                assert(isVectorSource(source), "Source \"".concat(sourceIdent, "\" doesn't exists in the identity map."));
                assert(isCollection(source.getFeaturesCollection()), "Source \"".concat(sourceIdent, "\" doesn't provide features collection."));
                return _context.abrupt("return", new DrawInteraction({
                  features: source.getFeaturesCollection(),
                  clickTolerance: this.clickTolerance,
                  snapTolerance: this.snapTolerance,
                  type: transformType(this.type),
                  stopClick: this.stopClick,
                  maxPoints: this.maxPoints,
                  minPoints: this.minPoints,
                  finishCondition: this.finishCondition,
                  style: this.createStyleFunc(),
                  geometryFunction: this.geometryFunction,
                  geometryName: this.geometryName,
                  condition: this.condition,
                  freehand: this.freehand,
                  freehandCondition: this.freehandCondition,
                  wrapX: this.wrapX
                }));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function createInteraction() {
        return _createInteraction.apply(this, arguments);
      };
    }(),

    /**
     * @return {function(feature: Feature): Style}
     * @protected
     */
    getDefaultStyles: function getDefaultStyles() {
      var defaultStyles = mapValues(defaultEditStyle(), function (styles) {
        return styles.map(createStyle);
      });
      return function __selectDefaultStyleFunc(feature) {
        if (feature.getGeometry()) {
          return defaultStyles[feature.getGeometry().getType()];
        }
      };
    },

    /**
     * @returns {Object}
     * @protected
     */
    getServices: function getServices() {
      return mergeDescriptors(interaction.methods.getServices.call(this), stylesContainer.methods.getServices.call(this));
    },

    /**
     * @return {Interaction|undefined}
     * @protected
     */
    getStyleTarget: function getStyleTarget() {
      return this.$interaction;
    },

    /**
     * @return {void}
     * @protected
     */
    mount: function mount() {
      interaction.methods.mount.call(this);
    },

    /**
     * @return {void}
     * @protected
     */
    unmount: function unmount() {
      interaction.methods.unmount.call(this);
    },

    /**
     * @param {Array<{style: Style, condition: (function|boolean|undefined)}>|function(feature: Feature): Style|Vue|undefined} styles
     * @return {void}
     * @protected
     */
    setStyle: function setStyle(styles) {
      if (styles !== this._styles) {
        this._styles = styles;
        this.scheduleRecreate();
      }
    },

    /**
     * @return {void}
     * @protected
     */
    subscribeAll: function subscribeAll() {
      interaction.methods.subscribeAll.call(this);
      subscribeToInteractionChanges.call(this);
    }
  },
  watch: _objectSpread({}, makeWatchers(['source', 'clickTolerance', 'snapTolerance', 'type', 'stopClick', 'maxPoints', 'minPoints', 'finishCondition', 'geometryFunction', 'geometryName', 'condition', 'freehand', 'freehandCondition', 'wrapX'], function () {
    return function () {
      this.scheduleRecreate();
    };
  }))
  /**
   * @return {void}
   * @private
   */

};

function subscribeToInteractionChanges() {
  var _this = this;

  hasInteraction(this);
  var drawEvents = merge(observableFromOlEvent(this.$interaction, 'drawstart').pipe(map(function (evt) {
    initializeFeature(evt.feature);
    return evt;
  })), observableFromOlEvent(this.$interaction, 'drawend'));
  this.subscribeTo(drawEvents, function (evt) {
    ++_this.rev;

    _this.$emit(evt.type, evt);
  });
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

  component.__file = "interaction.vue";

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


var Interaction = __vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Interaction, options);
  Vue.component(Interaction.name, Interaction);
}

export default plugin;
export { Interaction, plugin as install };
