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
import { never, shiftKeyOnly, singleClick } from 'ol/events/condition';
import Feature from 'ol/Feature';
import SelectInteraction from 'ol/interaction/Select';
import Vue from 'vue';
import { merge } from 'rxjs/_esm5/internal/observable/merge';
import { map } from 'rxjs/_esm5/internal/operators/map';
import { debounceTime } from 'rxjs/_esm5/internal/operators/debounceTime';
import { interaction, projTransforms, stylesContainer, featuresContainer } from '../mixin';
import { getFeatureId, createStyle, defaultEditStyle, getLayerId, initializeFeature } from '../ol-ext';
import { observableFromOlEvent } from '../rx-ext';
import { hasInteraction, hasMap } from '../util/assert';
import { constant, difference, forEach, isEqual, isFunction, mapValues, stubArray, pick } from '../util/minilo';
import mergeDescriptors from '../util/multi-merge-descriptors';
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
  name: 'vl-interaction-select',
  mixins: [interaction, featuresContainer, stylesContainer, projTransforms],
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
     * A function that takes an `ol.Feature` and an `ol.layer.Layer` and returns `true` if the feature may be selected or `false` otherwise.
     * @type {function|undefined}
     */
    filter: {
      type: Function,
      default: constant(true)
    },

    /**
     * A list of layers from which features should be selected. Alternatively, a filter function can be provided.
     * @type {string[]|function|undefined}
     */
    layers: {
      type: [Array, Function],
      default: undefined
    },

    /**
     * Hit-detection tolerance. Pixels inside the radius around the given position will be checked for features.
     * This only works for the canvas renderer and not for WebGL.
     * @type {number}
     */
    hitTolerance: {
      type: Number,
      default: 0
    },

    /**
     * A boolean that determines if the default behaviour should select only single features or all (overlapping)
     * features at the clicked map position.
     * @type {boolean}
     */
    multi: {
      type: Boolean,
      default: false
    },

    /**
     * Selected features as array of GeoJSON features with coordinates in the map view projection.
     * @type {string[]|number[]|Object[]}
     */
    features: {
      type: Array,
      default: stubArray
    },

    /**
     * Wrap the world horizontally on the selection overlay.
     * @type {boolean}
     */
    wrapX: {
      type: Boolean,
      default: true
    },

    /**
     * A function that takes an `ol.MapBrowserEvent` and returns a boolean to indicate whether that event should
     * be handled. By default, this is `ol.events.condition.never`. Use this if you want to use different events
     * for `add` and `remove` instead of `toggle`.
     * @type {function|undefined}
     */
    addCondition: {
      type: Function,
      default: never
    },

    /**
     * A function that takes an `ol.MapBrowserEvent` and returns a boolean to indicate whether that event should be handled.
     * This is the event for the selected features as a whole. By default, this is `ol.events.condition.singleClick`.
     * Clicking on a feature selects that feature and removes any that were in the selection. Clicking outside any feature
     * removes all from the selection.
     * @type {function|undefined}
     */
    condition: {
      type: Function,
      default: singleClick
    },

    /**
     * A function that takes an `ol.MapBrowserEvent` and returns a boolean to indicate whether that event should be handled.
     * By default, this is `ol.events.condition.never`. Use this if you want to use different events for `add` and `remove`
     * instead of `toggle`.
     * @type {function|undefined}
     */
    removeCondition: {
      type: Function,
      default: never
    },

    /**
     * A function that takes an `ol.MapBrowserEvent` and returns a boolean to indicate whether that event should be handled.
     * This is in addition to the `condition` event. By default, `ol.events.condition.shiftKeyOnly`, i.e. pressing `shift`
     * as well as the `condition` event, adds that feature to the current selection if it is not currently selected,
     * and removes it if it is.
     * @type {function|undefined}
     */
    toggleCondition: {
      type: Function,
      default: shiftKeyOnly
    }
  },
  computed: {
    layerFilter: function layerFilter() {
      var _this = this;

      return Array.isArray(this.layers) ? function (layer) {
        return _this.layers.includes(getLayerId(layer));
      } : this.layers;
    }
  },
  methods: {
    /**
     * @return {Select}
     * @protected
     */
    createInteraction: function createInteraction() {
      return new SelectInteraction({
        features: this._featuresCollection,
        multi: this.multi,
        wrapX: this.wrapX,
        filter: this.filter,
        layers: this.layerFilter,
        style: this.createStyleFunc(),
        addCondition: this.addCondition,
        condition: this.condition,
        removeCondition: this.removeCondition,
        toggleCondition: this.toggleCondition
      });
    },

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
      this.features.forEach(this.select);
    },

    /**
     * @return {void}
     * @protected
     */
    unmount: function unmount() {
      this.unselectAll();
      interaction.methods.unmount.call(this);
    },

    /**
     * @param {Object|Vue|Feature|string|number} feature
     * @return {void}
     * @throws {Error}
     */
    select: function select(feature) {
      var _this2 = this;

      hasMap(this);

      if (feature instanceof Vue) {
        feature = feature.$feature;
      }

      if (!(feature instanceof Feature)) {
        var featureId = getFeatureId(feature);

        if (!featureId) {
          throw new Error('Undefined feature id');
        }

        feature = undefined;
        forEach(this.$map.getLayers().getArray(), function (layer) {
          if (_this2.layerFilter && !_this2.layerFilter(layer)) {
            return false;
          }

          var source = layer.getSource();

          if (source && isFunction(source.getFeatureById)) {
            feature = source.getFeatureById(featureId);
          }

          return !feature;
        });
      }

      if (!feature) return;
      this.addFeature(feature);
    },

    /**
     * @param {Object|Vue|Feature|string|number} feature
     * @return {void}
     */
    unselect: function unselect(feature) {
      this.removeFeature(feature);
    },

    /**
     * Removes all features from selection.
     * @return {void}
     */
    unselectAll: function unselectAll() {
      this.clearFeatures();
    },

    /**
     * @param {Array<{style: Style, condition: (function|boolean|undefined)}>|function(feature: Feature): Style|Vue|undefined} styles
     * @return {void}
     * @protected
     */
    setStyle: function setStyle(styles) {
      if (styles !== this._styles) {
        this._styles = styles;
        this.scheduleRefresh();
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
  watch: _objectSpread({
    features: {
      deep: true,
      handler: function handler(features) {
        if (!this.$interaction) return;
        features = features.slice().map(function (feature) {
          return initializeFeature(_objectSpread({}, feature));
        });
        this.addFeatures(features);
        var forUnselect = difference(this.getFeatures(), features, function (a, b) {
          return getFeatureId(a) === getFeatureId(b);
        });
        this.removeFeatures(forUnselect);
      }
    },
    featuresDataProj: {
      deep: true,
      handler: function handler(value, prev) {
        if (!isEqual(value, prev)) {
          this.$emit('update:features', value);
        }
      }
    }
  }, makeWatchers(['filter', 'hitTolerance', 'multi', 'wrapX', 'addCondition', 'condition', 'removeCondition', 'toggleCondition'], function () {
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
  var _this3 = this;

  hasInteraction(this);
  var select = observableFromOlEvent(this._featuresCollection, 'add').pipe(map(function (_ref) {
    var element = _ref.element;
    return {
      type: 'select',
      feature: element
    };
  }));
  var unselect = observableFromOlEvent(this._featuresCollection, 'remove').pipe(map(function (_ref2) {
    var element = _ref2.element;
    return {
      type: 'unselect',
      feature: element
    };
  }));
  var events = merge(select, unselect);
  this.subscribeTo(events, function (evt) {
    return _this3.$emit(evt.type, evt.feature);
  }); // emit event to allow `sync` modifier

  this.subscribeTo(events.pipe(debounceTime(1000 / 60)), function () {
    _this3.$emit('update:features', _this3.featuresDataProj);
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
    }
  }, [_vm._t("default", null, {
    features: _vm.featuresDataProj
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


var Interaction = __vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

function plugin(Vue$$1) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (plugin.installed) {
    return;
  }

  plugin.installed = true;
  options = pick(options, 'dataProjection');
  Object.assign(Interaction, options);
  Vue$$1.component(Interaction.name, Interaction);
}

export default plugin;
export { Interaction, plugin as install };
